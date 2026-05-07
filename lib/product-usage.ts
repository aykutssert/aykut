import { createServiceClient } from '@/lib/supabase/server'
import { getProductGenerationUnitCost as _getUnitCost } from '@/lib/product-image-sizes'
import type { ProductImageQuality, ProductImageSize } from '@/lib/product-image-sizes'

export const PRODUCT_USAGE_PLANS = {
  free: { monthlyUnits: 20, monthlyPriceUsd: 0 },
  starter: { monthlyUnits: 500, monthlyPriceUsd: 9 },
  pro: { monthlyUnits: 1200, monthlyPriceUsd: 19 },
} as const

export type ProductPlanKey = keyof typeof PRODUCT_USAGE_PLANS

type ProductUsageRow = {
  user_id: string
  plan_key: string
  period_start: string
  units_used: number
  updated_at: string
}

export type ProductUsageSnapshot = {
  planKey: ProductPlanKey
  monthlyUnits: number
  unitsUsed: number
  unitsRemaining: number
  periodStart: string
  usagePercent: number
}

type ProductUsageEventInput = {
  userId: string
  resultId: string
  action: 'image_generation' | 'regenerate'
  units: number
  metadata?: Record<string, unknown>
}

const PERIOD_MS = 30 * 24 * 60 * 60 * 1000

export function getProductGenerationUnitCost(imageSize: ProductImageSize, imageQuality: ProductImageQuality) {
  return _getUnitCost(imageSize, imageQuality)
}

export async function getProductUsageSnapshot(userId: string): Promise<ProductUsageSnapshot> {
  const usage = await getOrCreateProductUsage(userId)
  return toSnapshot(usage)
}

export async function assertProductUsageAvailable(userId: string, units: number) {
  const usage = await getOrCreateProductUsage(userId)
  const snapshot = toSnapshot(usage)

  if (snapshot.unitsRemaining < units) {
    throw new ProductUsageLimitError(snapshot, units)
  }

  return snapshot
}

export async function recordProductUsageEvent({
  userId,
  resultId,
  action,
  units,
  metadata = {},
}: ProductUsageEventInput) {
  const service = createServiceClient()
  const usage = await getOrCreateProductUsage(userId)
  const nextUnitsUsed = usage.units_used + units

  const { error: usageError } = await service
    .from('product_usage')
    .update({
      units_used: nextUnitsUsed,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)

  if (usageError) throw new Error(usageError.message)

  const { error: eventError } = await service
    .from('product_usage_events')
    .insert({
      user_id: userId,
      result_id: resultId,
      action,
      units,
      metadata,
    })

  if (eventError) throw new Error(eventError.message)

  return toSnapshot({ ...usage, units_used: nextUnitsUsed })
}

export class ProductUsageLimitError extends Error {
  snapshot: ProductUsageSnapshot
  requiredUnits: number

  constructor(snapshot: ProductUsageSnapshot, requiredUnits: number) {
    super('Product usage limit exceeded')
    this.name = 'ProductUsageLimitError'
    this.snapshot = snapshot
    this.requiredUnits = requiredUnits
  }
}

async function getOrCreateProductUsage(userId: string): Promise<ProductUsageRow> {
  const service = createServiceClient()
  const { data, error } = await service
    .from('product_usage')
    .select('user_id, plan_key, period_start, units_used, updated_at')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw new Error(error.message)

  if (!data) {
    const { data: created, error: createError } = await service
      .from('product_usage')
      .insert({ user_id: userId })
      .select('user_id, plan_key, period_start, units_used, updated_at')
      .single()

    if (createError) throw new Error(createError.message)
    return created
  }

  if (!isExpired(data.period_start)) return data

  const { data: reset, error: resetError } = await service
    .from('product_usage')
    .update({
      period_start: new Date().toISOString(),
      units_used: 0,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .select('user_id, plan_key, period_start, units_used, updated_at')
    .single()

  if (resetError) throw new Error(resetError.message)
  return reset
}

function toSnapshot(usage: ProductUsageRow): ProductUsageSnapshot {
  const planKey = resolveProductPlanKey(usage.plan_key)
  const monthlyUnits = PRODUCT_USAGE_PLANS[planKey].monthlyUnits
  const unitsUsed = usage.units_used
  const unitsRemaining = Math.max(monthlyUnits - unitsUsed, 0)

  return {
    planKey,
    monthlyUnits,
    unitsUsed,
    unitsRemaining,
    periodStart: usage.period_start,
    usagePercent: monthlyUnits > 0 ? Math.min(Math.round((unitsUsed / monthlyUnits) * 100), 100) : 100,
  }
}

function resolveProductPlanKey(planKey: string): ProductPlanKey {
  return planKey in PRODUCT_USAGE_PLANS ? planKey as ProductPlanKey : 'free'
}

function isExpired(periodStart: string) {
  return Date.now() - new Date(periodStart).getTime() >= PERIOD_MS
}

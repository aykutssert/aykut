export const PRODUCT_IMAGE_SIZE_MAP = {
  '1:1': '1024x1024',
  '4:5': '1024x1280',
  '16:9': '1536x864',
} as const

export type ProductImageSize = keyof typeof PRODUCT_IMAGE_SIZE_MAP

export const PRODUCT_IMAGE_SIZE_OPTIONS: Array<{
  value: ProductImageSize
  label: string
  detail: ProductImageSize
  output: string
}> = [
  { value: '1:1', label: 'Square', detail: '1:1', output: PRODUCT_IMAGE_SIZE_MAP['1:1'] },
  { value: '4:5', label: 'Portrait', detail: '4:5', output: PRODUCT_IMAGE_SIZE_MAP['4:5'] },
  { value: '16:9', label: 'Landscape', detail: '16:9', output: PRODUCT_IMAGE_SIZE_MAP['16:9'] },
]

export function isProductImageSize(value: string): value is ProductImageSize {
  return value in PRODUCT_IMAGE_SIZE_MAP
}

export const PRODUCT_IMAGE_QUALITY_OPTIONS = [
  { value: 'low', label: 'Low', detail: 'Fast draft' },
  { value: 'medium', label: 'Medium', detail: 'Balanced' },
  { value: 'high', label: 'High', detail: 'Best detail' },
] as const

export type ProductImageQuality = typeof PRODUCT_IMAGE_QUALITY_OPTIONS[number]['value']

export function isProductImageQuality(value: string): value is ProductImageQuality {
  return PRODUCT_IMAGE_QUALITY_OPTIONS.some((option) => option.value === value)
}

export const PRODUCT_GENERATION_UNIT_COST: Record<ProductImageSize, Record<ProductImageQuality, number>> = {
  '1:1': { low: 1, medium: 7, high: 20 },
  '4:5': { low: 1, medium: 8, high: 25 },
  '16:9': { low: 1, medium: 8, high: 25 },
}

export function getProductGenerationUnitCost(size: ProductImageSize, quality: ProductImageQuality): number {
  return PRODUCT_GENERATION_UNIT_COST[size][quality]
}

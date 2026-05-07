'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, Package, Sparkles, X, Zap } from 'lucide-react'

const STORAGE_KEY = 'product-studio-onboarding-v1'

const STEPS = [
  {
    n: 1,
    icon: Package,
    label: 'Add your product',
    sub: 'Upload a product photo',
  },
  {
    n: 2,
    icon: Sparkles,
    label: 'Pick a template',
    sub: 'Choose a scene',
  },
  {
    n: 3,
    icon: Zap,
    label: 'Generate',
    sub: 'Get studio-quality photos',
  },
]

export function ProductOnboardingBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem(STORAGE_KEY)) {
      setVisible(true)
    }
  }, [])

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="mb-4 flex items-center gap-3 rounded-xl border border-orange-200/60 bg-orange-50/60 px-4 py-3 dark:border-orange-800/30 dark:bg-orange-950/20">
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-1 gap-y-2">
        <span className="mr-2 shrink-0 text-xs font-semibold text-orange-700 dark:text-orange-400">
          How it works
        </span>

        {STEPS.map((step, i) => {
          const Icon = step.icon
          return (
            <span key={step.n} className="flex items-center gap-1.5">
              {i > 0 && (
                <ArrowRight className="h-3 w-3 shrink-0 text-orange-300 dark:text-orange-700" />
              )}
              <span className="flex items-center gap-1 rounded-lg border border-orange-200/80 bg-white/70 px-2.5 py-1 dark:border-orange-800/40 dark:bg-orange-950/40">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-orange-100 text-[9px] font-bold text-orange-600 dark:bg-orange-900/60 dark:text-orange-400">
                  {step.n}
                </span>
                <Icon className="h-3 w-3 shrink-0 text-orange-500 dark:text-orange-400" />
                <span className="text-[11px] font-medium text-orange-800 dark:text-orange-300">
                  {step.label}
                </span>
                <span className="hidden text-[11px] text-orange-500/80 dark:text-orange-500 sm:inline">
                  — {step.sub}
                </span>
              </span>
            </span>
          )
        })}
      </div>

      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss"
        className="ml-auto shrink-0 rounded-md p-1 text-orange-400 transition-colors hover:bg-orange-100 hover:text-orange-600 dark:hover:bg-orange-900/40 dark:hover:text-orange-300"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

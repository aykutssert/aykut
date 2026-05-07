'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ProductOnboardingBanner } from '@/components/product-templates/ProductOnboardingBanner'

const links = [
  { href: '/product-studio/products', label: 'My Products' },
  { href: '/product-studio/templates', label: 'Templates' },
  { href: '/product-studio/results', label: 'Results' },
]

export function ProductSubnav() {
  const pathname = usePathname()

  return (
    <div className="w-full">
      <ProductOnboardingBanner />
    <div className="relative mb-6 w-full">
      <div className="absolute bottom-0 left-0 right-0 h-px bg-border" />
      <nav className="flex items-center gap-1">
        {links.map((link) => {
          const active =
            pathname.startsWith(link.href) ||
            (link.href === '/product-studio/products' && pathname.startsWith('/product-studio/create'))

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'relative pb-2 pt-1 px-3 text-xs font-medium transition-colors',
                active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {link.label}
              {active && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground dark:bg-[#D5A27F]" />
              )}
            </Link>
          )
        })}
      </nav>
    </div>
    </div>
  )
}

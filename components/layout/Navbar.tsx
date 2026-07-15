'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { MouseEvent } from 'react'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from './ThemeToggle'
import { MobileNav } from './MobileNav'
import { RoamingPetToggle } from '@/components/pets/RoamingPetToggle'
import { HomeLink } from './HomeLink'
import { LanguageToggle } from './LanguageToggle'
import { useTranslations } from 'next-intl'

export function Navbar() {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const navLinkClass = 'flex h-8 items-center rounded-md px-3 text-xs font-medium text-muted-foreground transition-colors duration-200 hover:bg-[#EEEEE8] hover:text-foreground dark:hover:bg-[#171513]'

  function handleSectionClick(event: MouseEvent<HTMLAnchorElement>, id: string) {
    if (pathname !== '/') return

    const target = document.getElementById(id)
    if (!target) return

    event.preventDefault()
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.history.pushState(null, '', `#${id}`)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-[57px] items-center gap-1.5 px-3 md:px-0 md:gap-4 max-w-[1400px] mx-auto w-full">
        <MobileNav />

        <HomeLink className="flex items-center gap-1.5 shrink-0 pr-1 md:pr-0">
          <Image
            src="/kernel-logo.svg"
            alt="Aykut Sert"
            width={20}
            height={20}
            className="md:w-6 md:h-6"
            priority
          />
          <span className="font-semibold text-sm">Aykut Sert</span>
        </HomeLink>

        <div className="flex-1" />

        <div className="hidden md:flex items-center gap-1.5">
          <Link href="/#experience" className={navLinkClass} onClick={(event) => handleSectionClick(event, 'experience')}>
            {t('experience')}
          </Link>
          <Link href="/#projects" className={navLinkClass} onClick={(event) => handleSectionClick(event, 'projects')}>
            {t('projects')}
          </Link>
          <Link href="/blog" className={navLinkClass}>
            {t('blog')}
          </Link>
          <LanguageToggle />
          <ThemeToggle />
          <RoamingPetToggle />
        </div>
        <div className="flex md:hidden items-center gap-1.5">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

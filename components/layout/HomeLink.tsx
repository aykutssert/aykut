'use client'

import { useRouter, usePathname } from 'next/navigation'

export function HomeLink({ children, className }: { children: React.ReactNode; className?: string }) {
  const router = useRouter()
  const pathname = usePathname()

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault()
    router.push('/')
    if (pathname === '/') window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <a href="/" onClick={handleClick} className={className}>
      {children}
    </a>
  )
}

import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/theme-provider'
import { RoamingPetWrapper } from '@/components/pets/RoamingPetWrapper'
import { siteUrl } from '@/lib/site'
import { LocaleProvider } from '@/components/layout/LocaleProvider'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Aykut Sert',
    template: '%s',
  },
  description: 'Portfolio of Aykut Sert, full-stack developer building web apps, iOS apps, and AI integrations with Go, C#, Next.js, and Swift.',
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: 'website',
    siteName: 'Aykut Sert',
    title: 'Aykut Sert',
    description: 'Portfolio of Aykut Sert, full-stack developer building web apps, iOS apps, and AI integrations with Go, C#, Next.js, and Swift.',
    url: siteUrl,
    images: [{ url: '/kernel-logo.png', width: 512, height: 512, alt: 'Aykut Sert' }],
  },
  twitter: {
    card: 'summary',
    title: 'Aykut Sert',
    description: 'Portfolio of Aykut Sert, full-stack developer building web apps, iOS apps, and AI integrations with Go, C#, Next.js, and Swift.',
    images: ['/kernel-logo.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="tr"
      suppressHydrationWarning
    >
      <link rel="preload" href="/fonts/AnthropicSans-400.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      <link rel="preload" href="/fonts/AnthropicSans-700.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      <body className="min-h-screen bg-background font-sans antialiased" suppressHydrationWarning>
        <LocaleProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <div id="page-root">{children}</div>
            <RoamingPetWrapper />
          </ThemeProvider>
        </LocaleProvider>
      </body>
    </html>
  )
}

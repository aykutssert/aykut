import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/theme-provider'
import { defaultOgImage, siteDescription, siteName, siteUrl } from '@/lib/site'
import { LocaleProvider } from '@/components/layout/LocaleProvider'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: siteName,
    template: `%s - ${siteName}`,
  },
  description: siteDescription,
  metadataBase: new URL(siteUrl),
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  openGraph: {
    type: 'website',
    siteName,
    title: siteName,
    description: siteDescription,
    images: [defaultOgImage],
  },
  twitter: {
    card: 'summary',
    title: siteName,
    description: siteDescription,
    images: [defaultOgImage.url],
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
          </ThemeProvider>
        </LocaleProvider>
      </body>
    </html>
  )
}

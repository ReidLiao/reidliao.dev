import './globals.css'
import './clerk.css'
import './prism.css'

import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata, Viewport } from 'next'

import { ThemeProvider } from '~/app/(main)/ThemeProvider'
import { url } from '~/lib'
import { zhCN } from '~/lib/clerkLocalizations'
import { sansFont } from '~/lib/font'
import { seo } from '~/lib/seo'

export const metadata: Metadata = {
  metadataBase: seo.url,
  title: {
    template: '%s | Reidliao.dev',
    default: seo.title,
  },
  description: seo.description,
  keywords: 'Reidliao.dev, 全栈建站, 系统运维, Docker容器, 云服务器方案, 软件下载, 个人博客',
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico?v=4', sizes: 'any' },
      {
        url: '/favicon-16x16.png?v=4',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        url: '/favicon-32x32.png?v=4',
        sizes: '32x32',
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: '/apple-touch-icon.png?v=4',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    shortcut: '/favicon.ico?v=4',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: {
      default: seo.title,
      template: '%s | Reidliao.dev',
    },
    description: seo.description,
    siteName: 'Reidliao.dev',
    locale: 'zh_CN',
    type: 'website',
    url: 'https://reidliao.dev',
  },
  twitter: {
    card: 'summary_large_image',
    title: seo.title,
    description: seo.description,
  },
  alternates: {
    canonical: url('/'),
    types: {
      'application/rss+xml': [{ url: '/feed.xml', title: 'RSS 订阅' }],
    },
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#000212' },
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider localization={zhCN}>
      <html
        lang="zh-CN"
        className={`${sansFont.variable} m-0 h-full p-0 font-sans antialiased`}
        suppressHydrationWarning
      >
        <body className="flex h-full flex-col">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}

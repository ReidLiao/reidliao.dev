import './globals.css'
import './clerk.css'
import './prism.css'

import type { Metadata, Viewport } from 'next'

import { ThemeProvider } from '~/app/(main)/ThemeProvider'
import { url } from '~/lib'
import { sansFont } from '~/lib/font'
import { seo } from '~/lib/seo'

const sourceWarning =
  '⚠️ WARNING：本站内容版权所有 © 2026 青柠夜栈 | Dark Lime Stack，reidliao.dev，未经允许禁止转载、复制、爬取，违者追究。'

export const metadata: Metadata = {
  metadataBase: seo.url,
  title: {
    template: '%s | 青柠夜栈',
    default: seo.title,
  },
  description: seo.description,
  keywords: 'Reidliao.dev, 全栈建站, 系统运维, Docker容器, 云服务器方案, 软件下载, 个人博客',
  verification: {
    google: 'njpotjl7IQBgP2iiDXiyomgWTMSOD1INlQv9PTXWzPk',
    other: {
      'msvalidate.01': '54236E3CF0D4AC42B4D20FD0B520982D',
      'baidu-site-verification': 'codeva-98CUpMFAJd',
    },
  },
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico?v=5', sizes: 'any' },
      {
        url: '/favicon-16x16.png?v=5',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        url: '/favicon-32x32.png?v=5',
        sizes: '32x32',
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: '/apple-touch-icon.png?v=5',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    shortcut: '/favicon.ico?v=5',
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
      template: '%s | 青柠夜栈',
    },
    description: seo.description,
    siteName: '青柠夜栈',
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
    <html
      lang="zh-CN"
      className={`${sansFont.variable} m-0 h-full p-0 font-sans antialiased`}
      suppressHydrationWarning
    >
      <head>
        <noscript
          dangerouslySetInnerHTML={{ __html: `<!-- ${sourceWarning} -->` }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme')||'system';var d=document.documentElement;var dark=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);d.classList.remove('light','dark','system');d.classList.add(dark?'dark':'light');d.style.colorScheme=dark?'dark':'light'}catch(_){}})();console.warn(${JSON.stringify(sourceWarning)});`,
          }}
        />
      </head>
      <body className="flex h-full flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

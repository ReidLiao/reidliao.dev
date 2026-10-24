import './blog/[slug]/blog.css'

import { Suspense } from 'react'
import type { Image as SanityImage } from 'sanity'

import { Footer } from '~/app/(main)/Footer'
import { Header } from '~/app/(main)/Header'
import { QueryProvider } from '~/app/QueryProvider'
import { BackToTop } from '~/components/BackToTop'
import { FirstVisitAnnouncement } from '~/components/FirstVisitAnnouncement'
import { FloatingContact } from '~/components/FloatingContact'
import { JsonLd } from '~/components/JsonLd'
import { MotionProvider } from '~/components/MotionProvider'
import { url } from '~/lib'
import { seo } from '~/lib/seo'
import { urlForImage } from '~/sanity/lib/image'
import { getAnnouncement } from '~/sanity/queries'

const siteUrl = seo.url.href
const websiteId = `${siteUrl}#website`
const organizationId = `${siteUrl}#organization`
const personId = `${siteUrl}about#person`

import { SkipLink } from './SkipLink'

export default async function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const announcement = await getAnnouncement().catch(() => null)
  const announcementImageUrl = announcement?.image
    ? urlForImage(announcement.image as unknown as SanityImage)
        .width(1200)
        .height(675)
        .fit('crop')
        .url()
    : undefined

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'WebSite',
              '@id': websiteId,
              url: siteUrl,
              name: 'Reidliao.dev',
              description: seo.description,
              inLanguage: 'zh-CN',
              publisher: { '@id': organizationId },
              creator: { '@id': personId },
            },
            {
              '@type': 'Organization',
              '@id': organizationId,
              name: 'Reidliao.dev',
              url: siteUrl,
              logo: {
                '@type': 'ImageObject',
                url: url('/avatar.png').href,
              },
            },
            {
              '@type': 'Person',
              '@id': personId,
              name: 'Reid Liao',
              url: url('/about').href,
              image: url('/avatar.png').href,
              description: 'Reidliao.dev 的搭建与维护者。',
              sameAs: ['https://github.com/ReidLiao'],
            },
          ],
        }}
      />
      <SkipLink />
      <div className="pointer-events-none fixed inset-0 select-none bg-[url('/grid-black.svg')] bg-top bg-repeat dark:bg-[url('/grid.svg')]" />
      <span className="pointer-events-none fixed top-0 block h-[800px] w-full select-none bg-[radial-gradient(103.72%_46.58%_at_50%_0%,rgba(5,5,5,0.045)_0%,rgba(0,0,0,0)_100%)] dark:bg-[radial-gradient(103.72%_46.58%_at_50%_0%,rgba(255,255,255,0.09)_0%,rgba(255,255,255,0)_100%)]" />

      <div className="fixed inset-0 flex justify-center sm:px-8">
        <div className="flex w-full max-w-7xl lg:px-8">
          <div className="w-full bg-zinc-50/90 ring-1 ring-zinc-100 transition-colors duration-300 dark:bg-zinc-900/80 dark:ring-zinc-400/20" />
        </div>
      </div>

      <QueryProvider>
        <MotionProvider>
          <div className="relative text-zinc-800 transition-colors duration-300 dark:text-zinc-200">
            <Header />
            <main id="main-content" tabIndex={-1}>{children}</main>
            <Suspense>
              <Footer />
            </Suspense>
          </div>
          <BackToTop />
          <FloatingContact />
          <FirstVisitAnnouncement announcement={announcement ? { ...announcement, imageUrl: announcementImageUrl } : null} />
        </MotionProvider>
      </QueryProvider>
    </>
  )
}

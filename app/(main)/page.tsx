import React from 'react'

import { BlogPosts } from '~/app/(main)/blog/BlogPosts'
import { Headline } from '~/app/(main)/Headline'
import { LatestSoftware } from '~/app/(main)/LatestSoftware'
import { LimitedOffers } from '~/app/(main)/LimitedOffers'
import { Photos } from '~/app/(main)/Photos'
import { PencilSwooshIcon } from '~/assets'
import { BreadcrumbJsonLd } from '~/components/BreadcrumbJsonLd'
import { Container } from '~/components/ui/Container'
import { getLatestBlogPosts, getSettings } from '~/sanity/queries'

export default async function BlogHomePage() {
  const [settings, posts] = await Promise.all([
    getSettings(),
    getLatestBlogPosts({ limit: 5, forDisplay: true }),
  ])

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: '首页', path: '/' }]} />
      <Container className="mt-10">
        <Headline />
      </Container>

      {settings?.heroPhotos && <Photos photos={settings.heroPhotos} />}

      <Container className="-mb-20 mt-24 md:mt-28">
        <div className="mx-auto grid max-w-xl grid-cols-1 gap-y-20 lg:max-w-none lg:grid-cols-2">
          <div className="flex flex-col gap-6 pt-6">
            <h2 className="flex items-center text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              <PencilSwooshIcon className="h-5 w-5 flex-none" />
              <span className="ml-2">近期写作</span>
            </h2>
            <BlogPosts posts={posts ?? []} showEmptyState />
          </div>
          <aside className="space-y-10 lg:sticky lg:top-8 lg:h-fit lg:pl-16 xl:pl-20">
            <LimitedOffers
              offers={settings?.limitedOffers ?? []}
              allLink={settings?.offersAllLink}
              avatarNote={settings?.offersAvatarNote}
              description={settings?.offersDescription}
            />
            <LatestSoftware items={settings?.latestSoftware ?? []} />
          </aside>
        </div>
      </Container>
    </>
  )
}

export const revalidate = 600

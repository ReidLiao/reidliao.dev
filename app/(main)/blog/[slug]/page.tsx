import { parseDateTime } from '@zolplay/utils'
import { type Metadata } from 'next'
import { notFound } from 'next/navigation'

import { BlogPostPage } from '~/app/(main)/blog/BlogPostPage'
import { LivePostMetricsProvider } from '~/app/(main)/blog/LivePostMetrics'
import { QueryProvider } from '~/app/QueryProvider'
import { JsonLd } from '~/components/JsonLd'
import { PostPortableText } from '~/components/PostPortableText'
import { url } from '~/lib'
import { cdnImageSrc } from '~/lib/cdn-image'
import { pageMetadata } from '~/lib/page-metadata'
import { postModifiedAt } from '~/lib/post-dates'
import { getBlogPost } from '~/sanity/queries'

export const generateMetadata = async (
  props: {
    params: Promise<{ slug: string }>
  }
) => {
  const params = await props.params;
  const post = await getBlogPost(params.slug)
  if (!post) {
    notFound()
  }

  const { title, description, mainImage } = post

  const ogImage = cdnImageSrc(mainImage.asset.url, {
    width: 1200,
    quality: 80,
    absolute: true,
  })

  const modifiedAt = postModifiedAt(post.publishedAt, post.updatedAt)

  return {
    title,
    description,
    alternates: pageMetadata(`/blog/${params.slug}`).alternates,
    openGraph: {
      ...pageMetadata(`/blog/${params.slug}`).openGraph,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: modifiedAt,
    },
    twitter: {
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      title,
      description,
      card: 'summary_large_image',
    },
  } satisfies Metadata
}

export default async function BlogPage(
  props: {
    params: Promise<{ slug: string }>
  }
) {
  const params = await props.params;
  const post = await getBlogPost(params.slug)
  if (!post) {
    notFound()
  }

  const ogImageAbs = cdnImageSrc(post.mainImage.asset.url, {
    width: 1200,
    quality: 80,
    absolute: true,
  })

  const siteUrl = url('/').href
  const postUrl = url(`/blog/${post.slug}`).href
  const breadcrumbId = `${postUrl}#breadcrumb`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${postUrl}#article`,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': postUrl,
        },
        headline: post.title,
        description: post.description,
        image: [ogImageAbs],
        datePublished: post.publishedAt,
        dateModified: postModifiedAt(post.publishedAt, post.updatedAt),
        author: { '@id': `${siteUrl}about#person` },
        publisher: { '@id': `${siteUrl}#organization` },
        ...(post.categories?.length
          ? { articleSection: post.categories.join(', ') }
          : {}),
        breadcrumb: { '@id': breadcrumbId },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': breadcrumbId,
        itemListElement: [
          { name: '首页', item: url('/').href },
          { name: '近期写作', item: url('/blog').href },
          { name: post.title, item: postUrl },
        ].map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          ...item,
        })),
      },
    ],
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      <LivePostMetricsProvider
        postIds={[
          post._id,
          ...(post.related?.map(({ _id }) => _id) ?? []),
        ]}
        incrementPostId={post._id}
      >
      <QueryProvider>
        <BlogPostPage
          post={post}
          publishedDate={
            parseDateTime({
              date: new Date(post.publishedAt),
              timezone: 'UTC',
            })?.format('YYYY/MM/DD') ?? ''
          }
        >
          <PostPortableText value={post.body} />
        </BlogPostPage>
      </QueryProvider>
      </LivePostMetricsProvider>
    </>
  )
}

// 内容缓存靠 Sanity Webhook 即时刷新；此处仅作兜底。
export const revalidate = 600

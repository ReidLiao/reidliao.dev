import { type Metadata } from 'next'
import { notFound } from 'next/navigation'

import { BlogPostPage } from '~/app/(main)/blog/BlogPostPage'
import { kvKeys } from '~/config/kv'
import { url } from '~/lib'
import { cdnImageSrc } from '~/lib/cdn-image'
import { isProduction } from '~/lib/is-production'
import { postModifiedAt } from '~/lib/post-dates'
import { redis } from '~/lib/redis'
import { getBlogPost } from '~/sanity/queries'

export const generateMetadata = async ({
  params,
}: {
  params: { slug: string }
}) => {
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
    openGraph: {
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

export default async function BlogPage({
  params,
}: {
  params: { slug: string }
}) {
  const post = await getBlogPost(params.slug)
  if (!post) {
    notFound()
  }

  let views: number
  if (isProduction) {
    views = await redis.incr(kvKeys.postViews(post._id))
  } else {
    views = 30578
  }

  let reactions: number[] = []
  try {
    if (isProduction) {
      const res = await fetch(url(`/api/reactions?id=${post._id}`), {
        next: {
          tags: [`reactions:${post._id}`],
        },
      })
      const data = await res.json()
      if (Array.isArray(data)) {
        reactions = data
      }
    } else {
      reactions = Array.from({ length: 4 }, () =>
        Math.floor(Math.random() * 50000)
      )
    }
  } catch (error) {
    console.error(error)
  }

  let relatedViews: number[] = []
  if (typeof post.related !== 'undefined' && post.related.length > 0) {
    if (!isProduction) {
      relatedViews = post.related.map(() => Math.floor(Math.random() * 1000))
    } else {
      const postIdKeys = post.related.map(({ _id }) => kvKeys.postViews(_id))
      relatedViews = await redis.mget<number[]>(...postIdKeys)
    }
  }

  const ogImageAbs = cdnImageSrc(post.mainImage.asset.url, {
    width: 1200,
    quality: 80,
    absolute: true,
  })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url(`/blog/${post.slug}`).href,
    },
    headline: post.title,
    description: post.description,
    image: [ogImageAbs],
    datePublished: post.publishedAt,
    dateModified: postModifiedAt(post.publishedAt, post.updatedAt),
    author: {
      '@type': 'Person',
      name: 'Reid Liao',
      url: url('/').href,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Reidliao.dev',
      logo: {
        '@type': 'ImageObject',
        url: url('/avatar.jpg').href,
      },
    },
    ...(post.categories?.length
      ? { articleSection: post.categories.join(', ') }
      : {}),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogPostPage
        post={post}
        views={views}
        relatedViews={relatedViews}
        reactions={reactions.length > 0 ? reactions : undefined}
      />
    </>
  )
}

// 内容缓存靠 Sanity Webhook 即时刷新；此处仅作兜底。
export const revalidate = 600

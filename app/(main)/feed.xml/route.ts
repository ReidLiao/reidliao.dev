import RSS from 'rss'

import { seo } from '~/lib/seo'
import { getLatestBlogPosts } from '~/sanity/queries'

export const revalidate = 600

function escapeHtml(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function toCdata(html: string) {
  return html.replace(/]]>/g, ']]]]><![CDATA[>')
}

function buildItemContent(input: {
  description: string
  url: string
  categories?: string[]
  readingTime?: number
  imageUrl?: string
}) {
  const parts: string[] = []

  if (input.categories?.length) {
    parts.push(
      `<p><strong>分类：</strong>${input.categories
        .map((c) => escapeHtml(c))
        .join(' · ')}</p>`
    )
  }

  if (typeof input.readingTime === 'number' && input.readingTime > 0) {
    parts.push(`<p>阅读约 ${input.readingTime} 分钟</p>`)
  }

  if (input.description) {
    parts.push(`<p>${escapeHtml(input.description)}</p>`)
  }

  if (input.imageUrl) {
    parts.push(
      `<p><img src="${escapeHtml(input.imageUrl)}" alt="" /></p>`
    )
  }

  parts.push(
    `<p><a href="${escapeHtml(input.url)}">在 reidliao.dev 阅读全文 →</a></p>`
  )

  return parts.join('\n')
}

export async function GET() {
  const data = await getLatestBlogPosts({
    limit: 999,
    forDisplay: false,
  })

  if (!data) {
    return new Response('Not found', { status: 404 })
  }

  const feedCategories = Array.from(
    new Set(data.flatMap((post) => post.categories ?? []).filter(Boolean))
  )

  const feed = new RSS({
    title: seo.title,
    description: seo.description,
    site_url: seo.url.href,
    feed_url: `${seo.url.href}feed.xml`,
    language: 'zh-CN',
    image_url: `${seo.url.href}opengraph-image.png`,
    generator: 'reidliao.dev',
    copyright: `${new Date().getFullYear()} reidliao.dev`,
    ttl: 60,
    categories: feedCategories,
    custom_namespaces: {
      content: 'http://purl.org/rss/1.0/modules/content/',
    },
  })

  data.forEach((post) => {
    const postUrl = `${seo.url.href}blog/${post.slug}`
    const imageUrl = post.mainImage?.asset?.url
    const categories = (post.categories ?? []).filter(Boolean)
    const html = buildItemContent({
      description: post.description ?? '',
      url: postUrl,
      categories,
      readingTime: post.readingTime,
      imageUrl,
    })

    feed.item({
      title: post.title,
      guid: postUrl,
      url: postUrl,
      description: post.description ?? '',
      date: new Date(post.publishedAt),
      author: 'Reidliao.dev',
      categories,
      ...(imageUrl
        ? {
            enclosure: {
              url: imageUrl,
              type: 'image/jpeg',
            },
          }
        : {}),
      custom_elements: [
        {
          'content:encoded': {
            _cdata: toCdata(html),
          },
        },
      ],
    })
  })

  return new Response(feed.xml({ indent: true }), {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=86400',
    },
  })
}

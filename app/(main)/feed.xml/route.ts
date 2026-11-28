import RSS from 'rss'

import { seo } from '~/lib/seo'
import { getLatestBlogPostsForFeed } from '~/sanity/queries'

export const revalidate = 600

function toCdata(html: string) {
  return html.replace(/]]>/g, ']]]]><![CDATA[>')
}

type FeedBlock = Record<string, unknown>

function escapeHtml(value: unknown) {
  const text =
    typeof value === 'string'
      ? value
      : typeof value === 'number' || typeof value === 'boolean'
        ? `${value}`
        : ''

  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function safeHref(value: unknown) {
  if (typeof value !== 'string') return ''
  return /^(https?:|mailto:)/i.test(value) || (value.startsWith('/') && !value.startsWith('//'))
    ? value
    : ''
}

function renderPortableText(body: unknown) {
  if (!Array.isArray(body)) return ''

  const output: string[] = []
  const blocks = body as FeedBlock[]
  const numberedStarts = new WeakMap<FeedBlock, number>()
  let number = 0
  let listLevel: number | undefined
  let previousWasNumbered = false
  let separatedByCodeBlock = false

  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index]
    if (!block || typeof block !== 'object') continue

    if (block._type === 'block' && block.listItem === 'number') {
      const level = typeof block.level === 'number' ? block.level : 1
      if (!previousWasNumbered && !(separatedByCodeBlock && level === listLevel)) {
        number = 0
      }
      number += 1
      listLevel = level
      previousWasNumbered = true
      separatedByCodeBlock = false
      numberedStarts.set(block, number)
      continue
    }

    if (block._type === 'codeBlock' && (previousWasNumbered || separatedByCodeBlock)) {
      previousWasNumbered = false
      separatedByCodeBlock = true
    } else {
      number = 0
      listLevel = undefined
      previousWasNumbered = false
      separatedByCodeBlock = false
    }
  }

  const renderBlockChildren = (block: FeedBlock) => {
    const children = Array.isArray(block.children) ? (block.children as FeedBlock[]) : []
    const markDefs = Array.isArray(block.markDefs) ? (block.markDefs as FeedBlock[]) : []
    const marksByKey = new Map<string, FeedBlock>()
    for (const mark of markDefs) {
      if (typeof mark._key === 'string') marksByKey.set(mark._key, mark)
    }

    return children
      .map((child) => {
        if (child._type !== 'span') return ''
        let text = escapeHtml(child.text)
        const marks = Array.isArray(child.marks) ? (child.marks as string[]) : []
        for (const markKey of [...marks].reverse()) {
          const annotation = marksByKey.get(markKey)
          const markType = annotation?._type ?? markKey
          if (markType === 'strong') text = `<strong>${text}</strong>`
          else if (markType === 'em') text = `<em>${text}</em>`
          else if (markType === 'underline') text = `<u>${text}</u>`
          else if (markType === 'code') text = `<code>${text}</code>`
          else if (markType === 'link') {
            const href = safeHref(annotation?.href)
            if (href) text = `<a href="${escapeHtml(href)}">${text}</a>`
          } else if (markType === 'textBackground') {
            const bg = annotation?.color === 'zinc' ? '#e4e4e7' : '#ecfdf5'
            text = `<mark style="background-color:${bg};color:#18181b">${text}</mark>`
          } else if (markType === 'textColor') {
            const colors: Record<string, string> = {
              lime: '#047857', emerald: '#047857', sky: '#0369a1',
              amber: '#b45309', rose: '#be123c', violet: '#6d28d9', zinc: '#52525b',
            }
            const color = typeof annotation?.color === 'string' ? colors[annotation.color] : colors.lime
            if (color) text = `<span style="color:${color}">${text}</span>`
          }
        }
        return text
      })
      .join('')
  }

  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index]
    if (!block || typeof block !== 'object') continue

    if (block._type === 'block') {
      if (typeof block.listItem === 'string') {
        const listType = block.listItem === 'number' ? 'ol' : 'ul'
        const level = typeof block.level === 'number' ? block.level : 1
        const items: string[] = []
        let cursor = index
        while (cursor < blocks.length) {
          const item = blocks[cursor]
          if (item?._type !== 'block' || item.listItem !== block.listItem || (typeof item.level === 'number' ? item.level : 1) !== level) break
          items.push(`<li>${renderBlockChildren(item)}</li>`)
          cursor += 1
        }
        const start = listType === 'ol' ? numberedStarts.get(block) : undefined
        output.push(`<${listType}${start && start > 1 ? ` start="${start}"` : ''}>${items.join('')}</${listType}>`)
        index = cursor - 1
        continue
      }

      const content = renderBlockChildren(block)
      const style = typeof block.style === 'string' ? block.style : 'normal'
      const tag = ({
        h1: 'h1', h2: 'h2', h3: 'h3', h4: 'h4', blockquote: 'blockquote',
      } as Record<string, string>)[style] ?? 'p'
      output.push(`<${tag}>${content}</${tag}>`)
      continue
    }

    if (block._type === 'image') {
      const src = safeHref(block.url)
      if (src) {
        output.push(`<figure><img src="${escapeHtml(src)}" alt="${escapeHtml(block.alt)}" />${block.label ? `<figcaption>${escapeHtml(block.label)}</figcaption>` : ''}</figure>`)
      }
    } else if (block._type === 'codeBlock') {
      output.push(`<figure>${block.filename ? `<figcaption>${escapeHtml(block.filename)}</figcaption>` : ''}<pre><code>${escapeHtml(block.code)}</code></pre></figure>`)
    } else if (block._type === 'tweet') {
      const id = typeof block.id === 'string' ? encodeURIComponent(block.id) : ''
      if (id) output.push(`<p><a href="https://x.com/i/status/${id}">查看原推文</a></p>`)
    } else if (block._type === 'download') {
      const files = Array.isArray(block.files) ? (block.files as FeedBlock[]) : []
      const items = files.map((file) => {
        const label = [file.platform, file.version, file.arch, file.language, file.size]
          .filter((part) => typeof part === 'string' && part)
          .map(escapeHtml)
          .join(' · ') || escapeHtml(block.title || '下载')
        const href = safeHref(file.url)
        return `<li>${href ? `<a href="${escapeHtml(href)}">${label}</a>` : label}</li>`
      })
      const legacyUrl = safeHref(block.url)
      output.push(`<section>${block.title ? `<h3>${escapeHtml(block.title)}</h3>` : ''}${block.note ? `<p>${escapeHtml(block.note)}</p>` : ''}${items.length ? `<ul>${items.join('')}</ul>` : legacyUrl ? `<p><a href="${escapeHtml(legacyUrl)}">下载</a></p>` : ''}</section>`)
    } else if (block._type === 'videoEmbed') {
      const href = safeHref(block.url)
      if (href) output.push(`<figure>${block.title ? `<figcaption>${escapeHtml(block.title)}</figcaption>` : ''}<a href="${escapeHtml(href)}">打开视频</a></figure>`)
    }
  }

  return output.join('\n')
}

function buildItemContent(input: {
  bodyHtml: string
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

  if (input.bodyHtml) {
    parts.push(input.bodyHtml)
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
  const data = await getLatestBlogPostsForFeed()

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
      bodyHtml: renderPortableText(post.body),
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
              type: post.mainImage.asset.mimeType ?? 'application/octet-stream',
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

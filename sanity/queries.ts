import { groq } from 'next-sanity'

import { getDate } from '~/lib/date'
import { client } from '~/sanity/lib/client'
import { type Post, type PostDetail } from '~/sanity/schemas/post'
import { type Project } from '~/sanity/schemas/project'

export type Donor = {
  _id: string
  name: string
  date: string
  message?: string | null
}

export const getDonorsQuery = () =>
  groq`
  *[_type == "donor" && !(_id in path("drafts.**"))]
    | order(date desc, _createdAt desc) {
      _id,
      name,
      date,
      message
    }
  `

export const getDonors = async () => {
  try {
    return (
      (await client.fetch<Donor[]>(getDonorsQuery(), {}, {
        next: { tags: ['donors'], revalidate: 600 },
      })) ?? []
    )
  } catch (error) {
    console.error('[Sanity donors]', error)
    return []
  }
}

export type BlogPostSitemapEntry = {
  slug: string
  publishedAt: string
  updatedAt?: string | null
}

export const getAllLatestBlogPostSlugsQuery = () =>
  groq`
  *[_type == "post" && !(_id in path("drafts.**"))
  && publishedAt <="${getDate().toISOString()}"
  && defined(slug.current)] | order(publishedAt desc).slug.current
  `

export const getAllLatestBlogPostSlugs = () => {
  return client.fetch<string[]>(getAllLatestBlogPostSlugsQuery())
}

export const getBlogPostsForSitemapQuery = () =>
  groq`
  *[_type == "post" && !(_id in path("drafts.**"))
  && publishedAt <="${getDate().toISOString()}"
  && defined(slug.current)] | order(publishedAt desc) {
    "slug": slug.current,
    publishedAt,
    updatedAt
  }
  `

export const getBlogPostsForSitemap = () =>
  client.fetch<BlogPostSitemapEntry[]>(getBlogPostsForSitemapQuery(), {}, {
    next: { tags: ['posts'], revalidate: 60 },
  })

type GetBlogPostsOptions = {
  limit?: number
  offset?: number
  forDisplay?: boolean
  categorySlug?: string
}

export type BlogCategoryCount = { title: string; slug: string; count: number }

export const getBlogCategoryCountsQuery = () => groq`
  *[_type == "category" && defined(slug.current)] | order(title asc) {
    title,
    "slug": slug.current,
    "count": count(*[_type == "post" && !(_id in path("drafts.**"))
      && publishedAt <= "${getDate().toISOString()}"
      && defined(slug.current) && references(^._id)])
  }
`

export const getBlogCategoryCounts = () =>
  client.fetch<BlogCategoryCount[]>(getBlogCategoryCountsQuery(), {}, {
    next: { tags: ['posts'], revalidate: 600 },
  })

export const getPublishedBlogPostCount = (categorySlug?: string) =>
  client.fetch<number>(
    groq`count(*[_type == "post" && !(_id in path("drafts.**"))
      && publishedAt <= "${getDate().toISOString()}" && defined(slug.current)
      ${categorySlug ? '&& $categorySlug in categories[]->slug.current' : ''}])`,
    categorySlug ? { categorySlug } : {},
    { next: { tags: ['posts'], revalidate: 600 } }
  )

export const getLatestBlogPostsQuery = ({
  limit = 5,
  offset = 0,
  forDisplay = true,
  categorySlug,
}: GetBlogPostsOptions) => {
  return groq`
  *[_type == "post" && !(_id in path("drafts.**")) && publishedAt <= "${getDate().toISOString()}"
  && defined(slug.current) ${categorySlug ? '&& $categorySlug in categories[]->slug.current' : ''}] | order(publishedAt desc)[${offset}...${offset + limit}] {
    _id,
    title,
    "slug": slug.current,
    "categories": categories[]->title,
    description,
    publishedAt,
    readingTime,
    mainImage {
      _ref,
      asset->{
        url,
        ${
          forDisplay
            ? '"lqip": metadata.lqip, "dominant": metadata.palette.dominant,'
            : ''
        }
      }
    }
  }`
}

export const getLatestBlogPosts = (options: GetBlogPostsOptions) =>
  client.fetch<Post[] | null>(
    getLatestBlogPostsQuery(options),
    options.categorySlug ? { categorySlug: options.categorySlug } : {},
    { next: { tags: ['posts'], revalidate: 600 } }
  )

export const getBlogPostQuery = groq`
  *[_type == "post" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
    _id,
    title,
    "slug": slug.current,
    "categories": categories[]->title,
    description,
    publishedAt,
    updatedAt,
    readingTime,
    mood,
    body[] {
      ...,
      _type == "image" => {
        "url": asset->url,
        "lqip": asset->metadata.lqip,
        "dimensions": asset->metadata.dimensions,
        ...
      }
    },
    "headings": body[length(style) == 2 && string::startsWith(style, "h")],
    mainImage {
      _ref,
      asset->{
        url,
        "lqip": metadata.lqip
      }
    },
    "related": *[_type == "post" && !(_id in path("drafts.**")) && slug.current != $slug && defined(slug.current) && publishedAt <= "${getDate().toISOString()}" && count(categories[@._ref in ^.^.categories[]._ref]) > 0] | order(publishedAt desc, _createdAt desc) [0..2] {
      _id,
      title,
      "slug": slug.current,
      "categories": categories[]->title,
      publishedAt,
      readingTime,
      mainImage {
        _ref,
        asset->{
          url,
          "lqip": metadata.lqip,
          "dominant": metadata.palette.dominant
        }
      },
    }
  }`
export const getBlogPost = async (slug: string) => {
  const post = await client.fetch<PostDetail | undefined, { slug: string }>(
    getBlogPostQuery,
    { slug },
    { next: { tags: [`post:${slug}`, 'posts'], revalidate: 600 } }
  )
  if (!post) return post

  const related = post.related ?? []
  if (related.length >= 3) return post
  const latest = await getLatestBlogPosts({ limit: 12, forDisplay: true })
  const used = new Set([post._id, ...related.map((item) => item._id)])
  const fill = (latest ?? []).filter((item) => !used.has(item._id))
  const merged = [...related, ...fill].slice(0, 3)
  return { ...post, related: merged }
}

export const getSettingsQuery = () =>
  groq`
  *[_type == "settings"][0] {
    "projects": projects[]->{
      _id,
      name,
      url,
      description,
      group,
      badge,
      icon
    },
    "heroPhotos": heroPhotos[]{
      "url": asset->url,
      "lqip": asset->metadata.lqip
    },
    "resume": resume[]{
      company,
      title,
      start,
      end,
      "logo": logo.asset->url
    }
}`

export type HeroPhoto = {
  url: string
  lqip?: string
}

export type SiteAnnouncement = {
  enabled?: boolean
  version?: string
  title?: string
  body?: string
  buttonText?: string
  buttonLink?: string
  image?: { _type: 'image'; asset: { _id?: string; _ref?: string; url?: string }; crop?: unknown; hotspot?: unknown } | null
}

export const getAnnouncement = () =>
  client.fetch<SiteAnnouncement | null>(
    groq`*[_type == "settings"][0] {
      "announcement": {
        enabled,
        version,
        title,
        body,
        buttonText,
        buttonLink,
        "image": image { ..., "asset": asset->{_id, _ref, url} }
      }
    }.announcement`,
    {},
    { next: { tags: ['settings'], revalidate: 300 } }
  )

export const getSettings = () =>
  client.fetch<
    {
      projects: Project[] | null
      heroPhotos?: HeroPhoto[] | null
      resume?:
        | {
            company: string
            title: string
            logo: string
            start: string
            end?: string
          }[]
        | null
    },
    Record<string, never>
  >(getSettingsQuery(), {}, { next: { tags: ['settings'], revalidate: 300 } })

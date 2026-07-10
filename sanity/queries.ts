import { groq } from 'next-sanity'

import { getDate } from '~/lib/date'
import { client } from '~/sanity/lib/client'
import { type Post, type PostDetail } from '~/sanity/schemas/post'
import { type Project } from '~/sanity/schemas/project'

export const getAllLatestBlogPostSlugsQuery = () =>
  groq`
  *[_type == "post" && !(_id in path("drafts.**"))
  && publishedAt <="${getDate().toISOString()}"
  && defined(slug.current)] | order(publishedAt desc).slug.current
  `

export const getAllLatestBlogPostSlugs = () => {
  return client.fetch<string[]>(getAllLatestBlogPostSlugsQuery())
}

type GetBlogPostsOptions = {
  limit?: number
  offset?: number
  forDisplay?: boolean
  category?: string
}

export const getLatestBlogPostsQuery = ({
  limit = 5,
  offset = 0,
  forDisplay = true,
  category,
}: GetBlogPostsOptions) => {
  const categoryFilter = category
    ? '&& $category in categories[]->title'
    : ''

  return groq`
  *[_type == "post" && !(_id in path("drafts.**")) && publishedAt <= "${getDate().toISOString()}"
  && defined(slug.current) ${categoryFilter}] | order(publishedAt desc)[${offset}...${offset + limit}] {
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
    options.category ? { category: options.category } : {}
  )

export const getBlogPostsCountQuery = ({ category }: { category?: string } = {}) => {
  const categoryFilter = category
    ? '&& $category in categories[]->title'
    : ''

  return groq`
  count(*[_type == "post" && !(_id in path("drafts.**")) && publishedAt <= "${getDate().toISOString()}"
  && defined(slug.current) ${categoryFilter}])
  `
}

export const getBlogPostsCount = (options: { category?: string } = {}) =>
  client.fetch<number>(
    getBlogPostsCountQuery(options),
    options.category ? { category: options.category } : {}
  )

export const getBlogCategoriesQuery = () =>
  groq`
  array::unique(*[_type == "post" && !(_id in path("drafts.**")) && publishedAt <= "${getDate().toISOString()}"
  && defined(slug.current) && defined(categories)].categories[]->title)
  `

export const getBlogCategories = () =>
  client.fetch<string[] | null>(getBlogCategoriesQuery())

export const getBlogPostQuery = groq`
  *[_type == "post" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
    _id,
    title,
    "slug": slug.current,
    "categories": categories[]->title,
    description,
    publishedAt,
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
    "related": *[_type == "post" && slug.current != $slug && count(categories[@._ref in ^.^.categories[]._ref]) > 0] | order(publishedAt desc, _createdAt desc) [0..2] {
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
export const getBlogPost = (slug: string) =>
  client.fetch<PostDetail | undefined, { slug: string }>(getBlogPostQuery, {
    slug,
  })

export const getSettingsQuery = () =>
  groq`
  *[_type == "settings"][0] {
    "projects": projects[]->{
      _id,
      name,
      url,
      description,
      icon
    },
    "heroPhotos": heroPhotos[].asset->url,
    "resume": resume[]{
      company,
      title,
      start,
      end,
      "logo": logo.asset->url
    }
}`
export const getSettings = () =>
  client.fetch<{
    projects: Project[] | null
    heroPhotos?: string[] | null
    resume?:
      | {
          company: string
          title: string
          logo: string
          start: string
          end?: string
        }[]
      | null
  }>(getSettingsQuery())

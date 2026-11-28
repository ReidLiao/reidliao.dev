import { groq } from 'next-sanity'

import { client } from '~/sanity/lib/client'

export type Resource = {
  _id: string
  name: string
  url: string
}

export const getResources = async (): Promise<Resource[]> => {
  const resources = await client.fetch<Resource[]>(groq`
    *[_type == "resource" && !(_id in path("drafts.**")) && defined(name) && defined(url)]
      | order(_createdAt desc) {
        _id,
        name,
        url
      }
  `, {}, { next: { tags: ['resources'], revalidate: 600 } })

  return resources ?? []
}

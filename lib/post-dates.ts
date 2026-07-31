/** Effective last-modified time for SEO / sitemap. */
export function postModifiedAt(
  publishedAt: string,
  updatedAt?: string | null
): string {
  if (!updatedAt) return publishedAt
  const published = new Date(publishedAt).getTime()
  const updated = new Date(updatedAt).getTime()
  if (Number.isNaN(updated) || updated <= published) return publishedAt
  return updatedAt
}

/** Whether the article page should show an "updated" label. */
export function hasMeaningfulUpdate(
  publishedAt: string,
  updatedAt?: string | null
): boolean {
  return postModifiedAt(publishedAt, updatedAt) !== publishedAt
}

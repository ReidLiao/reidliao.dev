import { url } from '~/lib'

const siteName = '青柠夜栈'

export function pageMetadata(path: string) {
  const pageUrl = url(path).href

  return {
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      url: pageUrl,
      siteName,
    },
  }
}

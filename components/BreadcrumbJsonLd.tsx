import { JsonLd } from '~/components/JsonLd'
import { url } from '~/lib'

type BreadcrumbItem = {
  name: string
  path: string
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: url(item.path).href,
        })),
      }}
    />
  )
}

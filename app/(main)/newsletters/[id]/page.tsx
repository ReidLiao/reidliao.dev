import { eq } from 'drizzle-orm'
import { type Metadata } from 'next'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'

import { Container } from '~/components/ui/Container'
import { db } from '~/db'
import { newsletters } from '~/db/schema'
import { pageMetadata } from '~/lib/page-metadata'

export const dynamic = 'force-dynamic'

function summarizeNewsletter(subject: string | null, body: string) {
  const paragraphs = body
    .split(/\r?\n\s*\r?\n/)
    .map((paragraph) =>
      paragraph
        .replace(/^#{1,6}\s+/gm, '')
        .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
        .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
        .replace(/<[^>]+>/g, ' ')
        .replace(/[>*_~`]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
    )
    .filter(Boolean)

  const summary = paragraphs.find((paragraph) => paragraph !== subject) ?? ''
  const withoutRepeatedSubject = subject && summary.startsWith(subject)
    ? summary.slice(subject.length).replace(/^[\s:：—-]+/, '')
    : summary

  return Array.from(withoutRepeatedSubject).slice(0, 160).join('').trim()
}

async function getNewsletter(id: string) {
  const [newsletter] = await db
    .select()
    .from(newsletters)
    .where(eq(newsletters.id, parseInt(id)))

  if (!newsletter || !newsletter.body) {
    notFound()
  }

  return newsletter
}

export async function generateMetadata(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const newsletter = await getNewsletter(params.id)
  const description = summarizeNewsletter(newsletter.subject, newsletter.body ?? '')

  const imageUrlRegex = /!\[[^\]]*\]\((.*?)\)/
  const match = newsletter.body?.match(imageUrlRegex)
  let imageUrl: string | undefined = undefined

  if (match) {
    imageUrl = match[1]
  }

  return {
    title: newsletter.subject,
    description: description || undefined,
    alternates: pageMetadata(`/newsletters/${params.id}`).alternates,
    openGraph: {
      ...pageMetadata(`/newsletters/${params.id}`).openGraph,
      images: imageUrl ? [{ url: imageUrl }] : undefined,
      title: newsletter.subject ?? '',
      description,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: newsletter.subject ?? '',
      description,
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    },
  } satisfies Metadata
}

export default async function NewsletterRenderPage(
  props: {
    params: Promise<{ id: string }>
  }
) {
  const params = await props.params;
  const newsletter = await getNewsletter(params.id)

  if (!newsletter.body) {
    return null
  }

  return (
    <Container className="mt-16">
      <article className="prose mx-auto max-w-[500px] dark:prose-invert">
        <ReactMarkdown>{newsletter.body}</ReactMarkdown>
      </article>
    </Container>
  )
}

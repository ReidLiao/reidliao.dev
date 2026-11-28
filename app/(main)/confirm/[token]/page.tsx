import { eq } from 'drizzle-orm'
import { type Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { Button } from '~/components/ui/Button'
import { Container } from '~/components/ui/Container'
import { db } from '~/db'
import { subscribers } from '~/db/schema'
import { pageMetadata } from '~/lib/page-metadata'

import { confirmSubscription } from './actions'

export const dynamic = 'force-dynamic'

export async function generateMetadata(props: { params: Promise<{ token: string }> }) {
  const params = await props.params;
  const title = '确认订阅'
  return {
    title,
    alternates: pageMetadata(`/confirm/${params.token}`).alternates,
    openGraph: {
      ...pageMetadata(`/confirm/${params.token}`).openGraph,
      title,
    },
    robots: { index: false, follow: false },
  } satisfies Metadata
}

export default async function ConfirmPage(
  props: {
    params: Promise<{ token: string }>
  }
) {
  const params = await props.params;
  const [subscriber] = await db
    .select()
    .from(subscribers)
    .where(eq(subscribers.token, params.token))

  if (!subscriber || subscriber.subscribedAt) {
    redirect('/')
  }

  return (
    <Container className="mt-16 sm:mt-32">
      <header className="relative mx-auto flex w-full max-w-2xl flex-col items-center justify-center text-center">
        <h1
          className="w-full text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl"
          id="confirm-subscription"
        >
          确认订阅
        </h1>
        <p className="mt-6 max-w-md text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          点击下方按钮后，才会确认将建站与运维笔记发送到这个邮箱。每月至多一封，随时可取消。
        </p>
        <form action={confirmSubscription}>
          <input type="hidden" name="token" value={params.token} />
          <Button type="submit" className="mt-8 rounded-full px-5 py-2.5">
            确认订阅
          </Button>
        </form>
        <Link
          href="/"
          className="mt-4 inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium text-zinc-700 transition hover:text-emerald-700 dark:text-zinc-300 dark:hover:text-emerald-400"
        >
          返回首页
        </Link>
      </header>
    </Container>
  )
}

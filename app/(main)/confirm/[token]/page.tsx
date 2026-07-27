import { eq } from 'drizzle-orm'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { Container } from '~/components/ui/Container'
import { db } from '~/db'
import { subscribers } from '~/db/schema'

import { SubbedCelebration } from './SubbedCelebration'

export const metadata = {
  title: '订阅已确认',
}

export default async function ConfirmPage({
  params,
}: {
  params: { token: string }
}) {
  const [subscriber] = await db
    .select()
    .from(subscribers)
    .where(eq(subscribers.token, params.token))

  if (!subscriber || subscriber.subscribedAt) {
    redirect('/')
  }

  await db
    .update(subscribers)
    .set({ subscribedAt: new Date(), token: null })
    .where(eq(subscribers.id, subscriber.id))

  return (
    <Container className="mt-16 sm:mt-32">
      <header className="relative mx-auto flex w-full max-w-2xl flex-col items-center justify-center text-center">
        <h1
          className="w-full text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl"
          id="subbed-celebration"
        >
          订阅已确认 🎉
        </h1>
        <p className="mt-6 max-w-md text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          之后有建站与运维笔记更新，会发到你的邮箱。每月至多一封，随时可取消。
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          返回首页
        </Link>
      </header>
      <SubbedCelebration />
    </Container>
  )
}

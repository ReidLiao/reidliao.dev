import { type Metadata } from 'next'
import Balancer from 'react-wrap-balancer'

import { Container } from '~/components/ui/Container'
import { fetchGuestbookMessages } from '~/db/queries/guestbook'

import { Guestbook } from './Guestbook'

const title = '留言墙'
const description =
  '欢迎在这台「终端」留下足迹：文章看法、技术勘误，或一句鼓励、槽点。每条留言我都会看到，也欢迎就自建与运维交流。'
export const metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
  twitter: {
    title,
    description,
    card: 'summary_large_image',
  },
} satisfies Metadata

function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-semibold text-zinc-800 dark:text-zinc-100">
      {children}
    </span>
  )
}

export default async function GuestBookPage() {
  const messages = await fetchGuestbookMessages()

  return (
    <Container className="mt-16 sm:mt-32">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
          留言墙
        </h1>
        <p className="mt-6 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          <Balancer>
            欢迎在这台
            <span className="font-mono font-medium text-emerald-500">
              「终端」
            </span>
            留下足迹：文章看法、
            <Highlight>技术勘误</Highlight>
            ，或一句鼓励、槽点。每条留言我都会
            <Highlight>看到</Highlight>
            ，也欢迎就自建与运维
            <Highlight>交流</Highlight>
            。
          </Balancer>
        </p>
      </header>
      <div className="mt-16 sm:mt-20">
        <Guestbook messages={messages} />
      </div>
    </Container>
  )
}

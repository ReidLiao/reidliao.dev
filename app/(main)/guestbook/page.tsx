import { type Metadata } from 'next'
import Balancer from 'react-wrap-balancer'

import { Container } from '~/components/ui/Container'
import { fetchGuestbookMessages } from '~/db/queries/guestbook'

import { Guestbook } from './Guestbook'

const title = '留言墙'
const description =
  '欢迎在这台「终端」留下你的足迹。无论是对文章的独特见解、硬核的技术勘误，还是随意的友情赞美、鼓励与槽点，每一条私信都将在这里被真诚接收并读取。'
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
        <p className="font-mono text-sm text-zinc-500 dark:text-zinc-400">
          /guestbook
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
          欢迎来到我的留言墙
        </h1>
        <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
          <Balancer>
            欢迎在这台
            <span className="font-mono font-medium text-lime-600 dark:text-lime-400">
              「终端」
            </span>
            留下你的足迹。无论是对文章的独特见解、硬核的
            <Highlight>技术勘误</Highlight>
            ，还是随意的友情赞美、鼓励与槽点，每一条私信都将在这里
            <Highlight>被真诚接收并读取</Highlight>
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

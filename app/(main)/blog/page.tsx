import Balancer from 'react-wrap-balancer'

import { SocialLink } from '~/components/links/SocialLink'
import { Container } from '~/components/ui/Container'

import { BlogPosts } from './BlogPosts'

const description =
  '这里写全栈建站、Docker 自建、系统运维与软件工具——只记录自己踩过的坑和验证过的做法。不追流量密码，有 RSS 可订阅，更新也不定期。'

export const metadata = {
  title: '近期写作',
  description,
  openGraph: {
    title: '近期写作',
    description,
  },
  twitter: {
    title: '近期写作',
    description,
    card: 'summary_large_image',
  },
}

function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-semibold text-zinc-800 dark:text-zinc-100">
      {children}
    </span>
  )
}

export default function BlogPage() {
  return (
    <Container className="mt-16 sm:mt-24">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
          近期写作
        </h1>
        <p className="my-6 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          <Balancer>
            这里写
            <Highlight>全栈建站</Highlight>、
            <Highlight>Docker 自建</Highlight>、
            <Highlight>系统运维</Highlight>
            与软件工具——只记录自己踩过的坑和验证过的做法。不追流量密码，有
            RSS 可订阅，更新也不定期。
          </Balancer>
        </p>
        <p className="flex items-center">
          <SocialLink href="/feed.xml" platform="rss" />
        </p>
      </header>
      <div className="mt-12 grid grid-cols-1 gap-6 sm:mt-20 lg:grid-cols-2 lg:gap-8">
        <BlogPosts limit={20} />
      </div>
    </Container>
  )
}

// 静态缓存 10 分钟；发布/更新走 Sanity Webhook → /api/revalidate 即时刷新。
export const revalidate = 600

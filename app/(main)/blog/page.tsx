import Balancer from 'react-wrap-balancer'

import { SocialLink } from '~/components/links/SocialLink'
import { Container } from '~/components/ui/Container'

import { BlogPosts } from './BlogPosts'

const description =
  '记录折腾日常，传递技术干货。这里聚焦现代全栈架构与系统运维实战，同时收录高效的软件工具推荐、优质云服务评测，以及那些填坑与创造路上的真实心得。'

export const metadata = {
  title: '我的博客',
  description,
  openGraph: {
    title: '我的博客',
    description,
  },
  twitter: {
    title: '我的博客',
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
        <p className="font-mono text-sm text-zinc-500 dark:text-zinc-400">
          /blog
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
          欢迎光临我的博客
        </h1>
        <p className="my-6 text-base text-zinc-600 dark:text-zinc-400">
          <Balancer>
            记录折腾日常，传递
            <Highlight>技术干货</Highlight>
            。这里聚焦
            <Highlight>现代全栈架构</Highlight>
            与
            <Highlight>系统运维实战</Highlight>
            ，同时收录高效的软件工具推荐、优质云服务评测，以及那些填坑与创造路上的真实心得。
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

export const revalidate = 60

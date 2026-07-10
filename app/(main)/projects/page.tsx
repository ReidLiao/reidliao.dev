import { type Metadata } from 'next'
import Balancer from 'react-wrap-balancer'

import { Projects } from '~/app/(main)/projects/Projects'
import { Container } from '~/components/ui/Container'

const title = '我的项目'
const description =
  '聚合开源脚本，沉淀容器应用。这里收录了我多年来折腾、筛选并重点维护的极客项目，既有实用的提效利器，也有纯粹有趣的工程实验，见证着我在技术领域的持续探索。'
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

export default function ProjectsPage() {
  return (
    <Container className="mt-16 sm:mt-32">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
          我开发与精选的项目合集。
        </h1>
        <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
          <Balancer>
            聚合
            <Highlight>开源脚本</Highlight>
            ，沉淀
            <Highlight>容器应用</Highlight>
            。这里收录了我多年来折腾、筛选并重点维护的
            <Highlight>极客项目</Highlight>
            ，既有实用的提效利器，也有纯粹有趣的工程实验，见证着我在技术领域的持续探索。
          </Balancer>
        </p>
      </header>
      <div className="mt-16 sm:mt-20">
        <Projects />
      </div>
    </Container>
  )
}

export const revalidate = 3600

import { type Metadata } from 'next'
import Balancer from 'react-wrap-balancer'

import { Projects } from '~/app/(main)/vps/Projects'
import { Container } from '~/components/ui/Container'

const title = '机房'
const description =
  '这里只收录我真正上手部署、长期跑站的 VPS 与线路。不谈纸面参数，只看实际表现。'
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
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
            机房
          </h1>
          <span className="inline-flex items-center gap-2 font-mono text-xs text-zinc-500 dark:text-zinc-400">
            <span
              aria-hidden="true"
              className="h-2 w-2 animate-pulse rounded-full bg-lime-500 shadow-[0_0_10px_rgba(132,204,22,0.7)] dark:bg-lime-400"
            />
            运行中
          </span>
        </div>
        <p className="mt-4 text-lg font-medium tracking-tight text-zinc-800 dark:text-zinc-100">
          跑站用到的服务与装备
        </p>
        <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          <Balancer>
            这里只收录我真正上手部署、
            <Highlight>长期跑站</Highlight>
            的 VPS 与线路。不谈纸面参数，只看
            <Highlight>实际表现</Highlight>
            。
          </Balancer>
        </p>
      </header>
      <div className="mt-16 sm:mt-20">
        <Projects />
      </div>
      <aside
        aria-label="推广链接披露"
        className="mt-16 max-w-2xl rounded-r-xl border-y border-r border-zinc-200 border-l-2 border-lime-500/70 px-3 py-2.5 text-xs leading-relaxed text-zinc-600 dark:border-zinc-800 dark:border-l-lime-400/70 dark:text-zinc-400"
      >
        部分链接为推广链接：通过它们购买价格不变，我会获得一点佣金；其中部分还附带专属优惠。
      </aside>
    </Container>
  )
}

export const revalidate = 3600

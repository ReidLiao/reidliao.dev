import { type Metadata } from 'next'
import Balancer from 'react-wrap-balancer'

import { Projects } from '~/app/(main)/vps/Projects'
import { Container } from '~/components/ui/Container'

const title = '机房'
const description =
  '精选自用过的 VPS 与机房线路。这里只放我真正上手部署、长期跑站的服务商，附上优惠链接——帮你少踩坑，也给我一点续杯咖啡的动力。'
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
          长期自用的机房
        </h1>
        <p className="mt-6 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          <Balancer>
            精选
            <Highlight>自用过的 VPS</Highlight>
            与
            <Highlight>机房线路</Highlight>
            。这里只放我真正上手部署、长期跑站的服务商，附上
            <Highlight>优惠链接</Highlight>
            ——帮你少踩坑，也给我一点续杯咖啡的动力。
          </Balancer>
        </p>
      </header>
      <div className="mt-16 sm:mt-20">
        <Projects />
        <p className="mt-12 max-w-2xl text-xs leading-relaxed text-zinc-400 dark:text-zinc-500">
          本页含联盟推广链接；经此下单可能为站点带来佣金，不会额外增加你的费用。推荐均来自自用体验，请自行核验条款与线路。
        </p>
      </div>
    </Container>
  )
}

export const revalidate = 3600

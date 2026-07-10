import { type Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Balancer from 'react-wrap-balancer'

import { AtomIcon, GitHubIcon } from '~/assets'
import { PeekabooLink } from '~/components/links/PeekabooLink'
import { Container } from '~/components/ui/Container'

const title = '关于本站'
const description =
  '了解 Reidliao.dev 的部署架构、技术理念与内容定位——一台 DMIT VPS 上的纯 Docker 自建博客。'

const rolePills = ['Self-hosted', 'Docker', 'Ops'] as const

const techStack = [
  'Next.js 14',
  'Docker',
  'Nginx Proxy Manager',
  'Neon PostgreSQL',
  'Sanity CMS',
  'Upstash Redis',
  'Clerk Auth',
  'Resend',
]

const contentTopics = [
  {
    title: '全栈建站架构',
    detail: 'Next.js App Router、数据库、CMS、认证与邮件系统的整合实践。',
  },
  {
    title: 'Docker 容器化',
    detail: '镜像构建、Compose 编排、生产部署与跨平台交叉编译经验。',
  },
  {
    title: '系统运维实战',
    detail: 'Linux 服务管理、反向代理、监控告警与线上故障排查。',
  },
  {
    title: '软件 & 云服务',
    detail: 'macOS / Windows 工具安利，以及高性价比 VPS 真实评测。',
  },
]

const deployReasons = [
  {
    title: '极致控制权',
    detail: '镜像、反代、环境变量、日志策略——全部由自己掌控，不依赖平台黑盒。',
  },
  {
    title: '摆脱平台绑定',
    detail: '随时迁移 VPS、换机房，数据与进程始终在自己手里。',
  },
  {
    title: '运维即乐趣',
    detail: '从构建镜像到排障上线，折腾过程本身就是值得记录的技术资产。',
  },
]

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

export default function AboutPage() {
  return (
    <Container className="mt-16 sm:mt-32">
      <header className="max-w-3xl">
        <p className="inline-flex items-center rounded-full border border-lime-500/20 bg-lime-500/5 px-3 py-1 text-xs font-medium text-lime-700 dark:border-lime-400/20 dark:bg-lime-400/10 dark:text-lime-300">
          <AtomIcon className="mr-1.5 h-3.5 w-3.5" />
          Independent · Self-hosted · Docker
        </p>
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
          关于 Reidliao.dev
        </h1>
        <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400">
          <Balancer>
            这不是一份简历，而是一台独立服务器上的技术实验室——记录我在全栈建站、容器化与系统运维领域的真实折腾。
          </Balancer>
        </p>
      </header>

      <section className="mt-12 border-t border-zinc-100 pt-10 dark:border-zinc-700/40">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
          <div className="relative mx-auto h-24 w-24 shrink-0 overflow-hidden rounded-full sm:mx-0">
            <Image
              src="/avatar.jpg"
              alt="Reidliao.dev"
              width={96}
              height={96}
              className="h-full w-full object-cover"
              priority
            />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
              {rolePills.map((pill) => (
                <span
                  key={pill}
                  className="rounded-md border border-zinc-200 px-2.5 py-1 font-mono text-[11px] font-medium tracking-wide text-zinc-600 dark:border-zinc-700 dark:text-zinc-300"
                >
                  {pill}
                </span>
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              我维护着这台服务器的每一个细节：从 Docker 镜像构建、Nginx 反代，到 Redis
              缓存与邮件通知。写博客、搭服务、测工具——保持好奇，折腾不止。
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3 sm:justify-start">
              <Link
                href="https://github.com/ReidLiao/reidliao.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900 px-4 py-2 text-xs font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
              >
                <GitHubIcon className="h-3.5 w-3.5" />
                查看源码
              </Link>
              <Link
                href="/guestbook"
                className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-transparent px-4 py-2 text-xs font-medium text-zinc-700 transition hover:border-lime-500/40 hover:text-lime-600 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-lime-400/40 dark:hover:text-lime-400"
              >
                留言交流
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-12">
        <section>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            服务器选择
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            本站运行在一台{' '}
            <PeekabooLink
              href="https://www.dmit.io/aff.php?aff=7399"
              target="_blank"
            >
              DMIT VPS
            </PeekabooLink>{' '}
            上，系统环境为 Debian/Ubuntu。这不是「租来就跑」的共享虚拟主机，而是一台承载独立精神的小型服务器——CPU、内存与带宽都由我自行规划与监控。
          </p>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            <PeekabooLink href="https://www.dmit.io" target="_blank">
              DMIT
            </PeekabooLink>{' '}
            是一家主打优质国际线路的 VPS 服务商，在香港、洛杉矶、东京等地均有机房节点，以稳定低延迟的网络表现著称，非常适合搭建个人博客、代理节点或开发测试环境。如果你也在寻找高性价比的 VPS，不妨通过上方链接了解一下。
          </p>
          <ul className="mt-4 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            <li className="flex gap-2">
              <span className="text-lime-600 dark:text-lime-400">▸</span>
              完整 root 权限，可自由定制内核参数与服务
            </li>
            <li className="flex gap-2">
              <span className="text-lime-600 dark:text-lime-400">▸</span>
              可预期的资源配额，适合长期稳定运行个人服务
            </li>
            <li className="flex gap-2">
              <span className="text-lime-600 dark:text-lime-400">▸</span>
              博客宿主 + 运维试验田，一举两得
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            部署理念
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            本项目 fork 自优秀的开源博客模板，原作者方案面向 Vercel 等 Serverless
            平台。我没有沿用那条路径，而是选择{' '}
            <strong className="text-zinc-800 dark:text-zinc-200">
              纯 Docker 容器化自建
            </strong>
            ：本地交叉编译镜像 → 推送 VPS → Nginx Proxy Manager 反代对外。
          </p>
          <div className="mt-5 space-y-4">
            {deployReasons.map((item) => (
              <div
                key={item.title}
                className="border-l-2 border-lime-500/50 pl-4 dark:border-lime-400/40"
              >
                <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  {item.title}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-14 border-t border-zinc-100 pt-10 dark:border-zinc-700/40">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          技术栈
        </h2>
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
          构建与运行分离，小内存 VPS 也能稳定承载完整博客服务。
        </p>
        <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2 font-mono text-xs text-zinc-600 dark:text-zinc-400 sm:grid-cols-4">
          {techStack.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span className="text-lime-600 dark:text-lime-400">$</span>
              {item}
            </li>
          ))}
        </ul>
        <pre className="mt-6 overflow-x-auto rounded-lg bg-zinc-950 px-4 py-4 font-mono text-xs leading-relaxed text-lime-400">
          <code>
            <span className="text-zinc-500"># 部署链路</span>
            {'\n'}
            本地 Docker Buildx (amd64) → 镜像导出 .tar → SFTP 推送 VPS
            {'\n'}
            → Dockge 运行容器 → NPM 反代 → reidliao.dev
          </code>
        </pre>
      </section>

      <section className="mt-14 border-t border-zinc-100 pt-10 dark:border-zinc-700/40">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          内容定位
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
          不追流量密码，只分享踩过坑、验证过的硬核干货。
        </p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {contentTopics.map((topic) => (
            <div
              key={topic.title}
              className="border-l-2 border-zinc-200 pl-4 dark:border-zinc-700"
            >
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {topic.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                {topic.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14 border-t border-dashed border-zinc-200 pt-10 dark:border-zinc-700">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          下载策略
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          本站运行在一台轻量级 VPS 上，带宽和存储都是宝贵资源。因此博客内分享的软件、工具包等资源，
          <strong className="text-zinc-800 dark:text-zinc-200">
            不会直接托管在本服务器上
          </strong>
          ，而是统一通过第三方优质网盘（阿里云盘、123 盘等）提供下载链接。
        </p>
        <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          这样做既能保证下载速度，也能让服务器专心做好「展示与写作」。链接失效欢迎在{' '}
          <PeekabooLink href="/guestbook">留言墙</PeekabooLink> 反馈。
        </p>
      </section>
    </Container>
  )
}

export const revalidate = 3600

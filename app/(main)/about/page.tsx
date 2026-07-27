import { type Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Balancer from 'react-wrap-balancer'

import { GitHubIcon } from '~/assets'
import { PeekabooLink } from '~/components/links/PeekabooLink'
import { Container } from '~/components/ui/Container'
import { WechatSubscribe } from '~/components/WechatSubscribe'

const title = '关于 reidliao.dev'
const description =
  'reidliao.dev：DMIT VPS 上 Docker 自建的技术博客——全栈建站、运维实战、软件下载与自用机房线路。'

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
    title: '软件 & 机房',
    detail:
      '文章内多平台下载块分享工具；机房页收录长期自用的 VPS 与线路。',
  },
]

const deployReasons = [
  {
    title: '全程可控',
    detail: '镜像、反代、环境变量、日志策略——按自己的节奏配置与排查。',
  },
  {
    title: '便于迁移',
    detail: '换 VPS、换机房时带走配置与进程即可，链路清晰可复现。',
  },
  {
    title: '运维即乐趣',
    detail: '从构建镜像到排障上线，折腾过程本身就是值得记录的技术资产。',
  },
]

const changelog = [
  {
    date: '2026-07',
    title: '正式上线',
    detail:
      'Clerk 生产环境、robots/sitemap；机房页（/vps）收录长期自用线路；下载块、发布即时刷新与自建栈收口，正式对外开放。',
  },
  {
    date: '2026-07',
    title: '内容与体验深化',
    detail:
      '正文下载块（多平台/自动预选/提取码）、视频嵌入、文字颜色与高亮；图片同源代理与磁盘缓存；Sanity Webhook 即时刷新；封面与 Studio 稳定性修复。',
  },
  {
    date: '2026-07',
    title: '上线打磨',
    detail:
      '统一品牌与 favicon，留言墙支持匿名短评，阅读进度条与主题切换过渡上线。',
  },
  {
    date: '2026-06',
    title: 'Docker 自建落地',
    detail:
      'Buildx 交叉编译 → 镜像推送 VPS → Dockge 运行 → NPM 反代对外。',
  },
  {
    date: '2026-05',
    title: '运行时收敛',
    detail:
      'API 跑在 Node；Geo 查询加 Redis 缓存，Footer 浏览量短缓存减负。',
  },
  {
    date: '2026-04',
    title: '项目起步',
    detail:
      '基于开源博客方案起步：替换域名与品牌，按自建场景裁剪功能，开始定制演进。',
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
        <p className="font-mono text-sm text-zinc-500 dark:text-zinc-400">
          /about
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
          <span className="font-normal text-zinc-400 dark:text-zinc-500">
            关于
          </span>{' '}
          <span className="font-mono text-zinc-800 dark:text-zinc-100">
            reidliao.dev
          </span>
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          <Balancer>
            这不是一份简历，而是一台独立服务器上的技术实验室——记录全栈建站、Docker
            自建与系统运维的真实折腾。本站已在自有 VPS 上跑通并正式开放。
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
              unoptimized
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
              缓存、认证与邮件通知。写博客、搭服务、测工具——保持好奇，折腾不止。
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
                href="/vps"
                className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-transparent px-4 py-2 text-xs font-medium text-zinc-700 transition hover:border-lime-500/40 hover:text-lime-600 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-lime-400/40 dark:hover:text-lime-400"
              >
                自用机房
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
            主打优质国际线路，香港、洛杉矶、东京等节点延迟表现稳定，适合博客、开发测试与长期跑站。更多我实际用过的服务商与优惠入口，见{' '}
            <PeekabooLink href="/vps">机房</PeekabooLink> 页。
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
            reidliao.dev 基于开源博客方案深度定制，跑在自有 VPS 上。部署采用{' '}
            <strong className="text-zinc-800 dark:text-zinc-200">
              Docker 容器化自建
            </strong>
            ：本地交叉编译镜像 → 推送 VPS → Dockge 运行容器 → Nginx Proxy
            Manager 反代对外。源码在 GitHub 公开，我会按自建场景持续迭代。
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

      <section className="mt-14 border-t border-zinc-100 pt-10 dark:border-zinc-700/40">
        <div className="max-w-xl">
          <WechatSubscribe />
        </div>
      </section>

      <section className="mt-14 border-t border-dashed border-zinc-200 pt-10 dark:border-zinc-700">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          下载策略
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          本站跑在轻量 VPS 上，带宽与磁盘都很宝贵。文章里的软件与工具通过正文
          <strong className="text-zinc-800 dark:text-zinc-200">
            下载块
          </strong>
          提供：支持多平台 / 多版本、按系统自动预选，以及提取码一键复制；文件本身
          <strong className="text-zinc-800 dark:text-zinc-200">
            不托管在本机
          </strong>
          ，统一走第三方网盘（阿里云盘、123 盘等）。
        </p>
        <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          这样下载更快，服务器也能专心做展示与写作。链接失效欢迎在{' '}
          <PeekabooLink href="/guestbook">留言墙</PeekabooLink> 反馈。
        </p>
      </section>

      <section className="mt-14 border-t border-zinc-100 pt-10 dark:border-zinc-700/40">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          Changelog
        </h2>
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
          运维与站点大事记——不记流水账，只记值得回看的节点。
        </p>
        <ol className="mt-6 space-y-6">
          {changelog.map((entry) => (
            <li key={`${entry.date}-${entry.title}`} className="flex gap-4">
              <time
                dateTime={entry.date}
                className="w-14 shrink-0 pt-0.5 font-mono text-[11px] tabular-nums text-zinc-400 dark:text-zinc-500"
              >
                {entry.date}
              </time>
              <div className="min-w-0 flex-1 border-l-2 border-lime-500/40 pl-4 dark:border-lime-400/30">
                <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  {entry.title}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {entry.detail}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </Container>
  )
}

export const revalidate = 3600

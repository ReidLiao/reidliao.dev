import { type Metadata } from 'next'
import Balancer from 'react-wrap-balancer'

import { CloudIcon, ScriptIcon, SparkleIcon } from '~/assets'
import { Container } from '~/components/ui/Container'
import { Prose } from '~/components/Prose'

const title = '关于本站'
const description =
  '了解 Reidliao.dev 的部署架构、技术理念与内容定位——一台 DMIT VPS 上的纯 Docker 自建博客。'

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
    <Container className="mt-16 sm:mt-24">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
          关于本站
        </h1>
        <p className="my-6 text-base text-zinc-600 dark:text-zinc-400">
          <Balancer>
            Reidliao.dev 是一台独立服务器上的个人实验室，记录我在全栈建站、容器化与系统运维领域的折腾与思考。
          </Balancer>
        </p>
      </header>

      <Prose className="mt-12 max-w-2xl">
        <h2 className="flex items-center gap-2">
          <CloudIcon className="h-5 w-5 text-lime-600 dark:text-lime-400" />
          服务器选择
        </h2>
        <p>
          本站运行在一台 <strong>DMIT VPS</strong> 上，系统环境为 Debian/Ubuntu。
          这不是一台「租来就跑」的共享主机，而是一台承载着独立精神的小型服务器——CPU、内存、带宽都由我自行规划与监控。
        </p>
        <p>
          选择 VPS 而非传统虚拟主机，是因为我需要完整的 root 权限、可预期的资源配额，以及随时折腾底层环境的自由。
          对独立博主来说，这台机器既是博客的宿主，也是运维实战的试验田。
        </p>

        <h2 className="flex items-center gap-2">
          <ScriptIcon className="h-5 w-5 text-lime-600 dark:text-lime-400" />
          部署理念
        </h2>
        <p>
          本项目最初 fork 自优秀的开源博客模板，原作者的部署方案面向 Vercel 等 Serverless
          平台，上手极快，但对基础设施的控制粒度有限。
        </p>
        <p>我没有沿用那条路径，原因很直接：</p>
        <ul>
          <li>
            <strong>极致控制权</strong>：容器镜像、反向代理、环境变量、日志策略——全部由自己掌控，不依赖平台黑盒。
          </li>
          <li>
            <strong>摆脱平台绑定</strong>：Serverless 生态迁移成本高，自建 Docker 方案可随时换 VPS、换机房，数据与进程都在自己手里。
          </li>
          <li>
            <strong>运维本身就是乐趣</strong>：从构建镜像、推送部署，到 Nginx Proxy Manager
            反代、监控与排障——这些「折腾」过程，正是我想记录和分享的一部分。
          </li>
        </ul>
        <p>
          最终方案是 <strong>纯 Docker 容器化自建</strong>：本地交叉编译镜像，推送到 VPS
          运行，由 Nginx 反代对外服务。构建与运行分离，小内存机器也能稳定承载。
        </p>

        <h2 className="flex items-center gap-2">
          <SparkleIcon className="h-5 w-5 text-lime-600 dark:text-lime-400" />
          内容定位
        </h2>
        <p>本博客主要聚焦以下方向：</p>
        <ul>
          <li>
            <strong>全栈建站架构</strong>：Next.js、数据库、CMS、认证与邮件等模块的整合实践
          </li>
          <li>
            <strong>Docker 容器化应用</strong>：镜像构建、Compose 编排、生产环境部署经验
          </li>
          <li>
            <strong>系统运维实战</strong>：Linux 服务管理、反向代理、监控与故障排查
          </li>
          <li>
            <strong>软件与云服务分享</strong>：macOS / Windows 优质工具安利，以及高性价比 VPS
            与云服务的真实评测
          </li>
        </ul>
        <p>
          这里不追求流量密码，只希望把踩过的坑、验证过的方案，整理成对你有参考价值的技术干货。
        </p>

        <h2>下载策略</h2>
        <p>
          本站运行在一台轻量级 VPS 上，带宽和存储都是宝贵资源。因此，博客内分享的软件、工具包等资源，
          <strong>不会直接托管在本服务器上</strong>，而是统一通过第三方优质网盘（如阿里云盘、123
          盘等）提供下载链接。
        </p>
        <p>
          这样做既能保证下载速度，也能让服务器专心做好「展示与写作」这一件事。如果你在某个资源的链接上遇到问题，欢迎在留言墙反馈。
        </p>
      </Prose>
    </Container>
  )
}

# reidliao.dev

[reidliao.dev](https://reidliao.dev) 个人技术博客源码仓库。  
记录全栈建站、Docker 自建与系统运维的真实折腾；站点跑在自有 VPS 上，由本仓库独立维护与持续更新。

## 站点定位

- 独立自建：镜像、反代、环境变量与日志策略自行掌控
- 内容方向：全栈架构、容器化部署、运维实战、软件下载与自用机房推荐
- 在线地址：[https://reidliao.dev](https://reidliao.dev)
- 仓库地址：[https://github.com/ReidLiao/reidliao.dev](https://github.com/ReidLiao/reidliao.dev)

## 技术栈

| 类别 | 选用 |
|------|------|
| 框架 | Next.js 14（App Router）+ Tailwind CSS |
| CMS | Sanity |
| 数据库 | Drizzle ORM + Neon PostgreSQL |
| 缓存 | Upstash Redis |
| 认证 | Clerk |
| 邮件 | Resend |
| 基础设施 | Docker、Dockge、Nginx Proxy Manager |

## 部署方式

面向小内存 VPS（如 2GB 档 DMIT）采用 **构建与运行分离**：

1. **本地构建**：在开发机用 Docker Buildx 交叉编译 `linux/amd64` 镜像，避免 VPS 上 `next build` 触发 OOM
2. **离线传输**：镜像导出为 `.tar`，经 SFTP 推到服务器
3. **轻量运行**：Dockge / Compose 只负责跑预构建镜像；Nginx Proxy Manager 反代对外
4. **图片缓存卷**：挂载 `reidliao-img-cache:/data/img-cache`（见 `docker-compose.yml`），重建容器不丢 Sanity 图片代理缓存

快速启动示例：

```bash
cp .env.example .env   # 按说明填入密钥
docker build -t reidliao-dev:latest .
docker compose up -d
```

环境变量说明见 [`.env.example`](./.env.example)。发布内容后可通过 Sanity Webhook 调用 `/api/revalidate` 即时刷新缓存。

## 本地开发

```bash
pnpm install
pnpm dev
```

需要数据库、Sanity、Clerk、Upstash、Resend 等相关环境变量时，同样参考 `.env.example`。

## 许可与维护

本仓库为 reidliao.dev 独立项目，源码公开，供学习与参考。  
后续功能与体验改进将在此仓库持续更新。

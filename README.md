# reidliao.dev

[reidliao.dev](https://reidliao.dev) 个人技术博客源码仓库。  
基于开源博客方案深度定制，记录全栈建站、Docker 自建与系统运维的真实折腾；站点跑在自有 VPS 上，按自建场景持续维护与更新。

## 站点定位

- 自建部署：镜像、反代、环境变量与日志策略自行掌控
- 内容方向：全栈架构、容器化部署、运维实战、软件下载与自用机房推荐
- 在线地址：[https://reidliao.dev](https://reidliao.dev)
- 仓库地址：[https://github.com/ReidLiao/reidliao.dev](https://github.com/ReidLiao/reidliao.dev)
- 版本发布：[Releases](https://github.com/ReidLiao/reidliao.dev/releases)

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

面向小内存 VPS（如 2GB 档）采用 **构建与运行分离**：**不要**在 VPS 上执行 `pnpm build` / 服务器内构建（易 OOM）。

1. **本地构建**：开发机用 Docker Buildx 交叉编译 `linux/amd64`，并用 BuildKit secret 注入 `.env`（避免密钥打进镜像层，同时满足 `next build` 校验）
2. **离线传输**：镜像导出为 `.tar`，经 SFTP 推到服务器
3. **轻量运行**：Dockge / Compose 只负责跑预构建镜像；Nginx Proxy Manager 反代对外
4. **图片缓存卷**：挂载 `reidliao-img-cache:/data/img-cache`（见 `docker-compose.yml`），重建容器不丢 Sanity 图片代理缓存

### 本地构建与启动示例

```bash
cp .env.example .env   # 按说明填入密钥（含 REVALIDATE_SECRET 等）

# 必须带 --secret；.dockerignore 已排除 .env
docker buildx build --platform linux/amd64 \
  --secret id=env,src=.env \
  -t reidliao-dev:latest --load .

docker compose up -d
```

导出离线包（部署到 VPS 时）：

```bash
docker save -o blog.tar reidliao-dev:latest
# 上传至服务器后：docker load -i blog.tar && docker compose up -d
```

环境变量说明见 [`.env.example`](./.env.example)。  
内容发布后可通过 Sanity Webhook 调用 `/api/revalidate`（请求头 `x-revalidate-secret` 与 `.env` 中 `REVALIDATE_SECRET` 一致）即时刷新缓存。

Compose 中的 `image` 名称须与构建时的 `-t` 标签一致（默认 `reidliao-dev:latest`）。

## 本地开发

```bash
pnpm install
pnpm dev
```

需要数据库、Sanity、Clerk、Upstash、Resend 等相关环境变量时，同样参考 `.env.example`。

## 许可与维护

本仓库源码公开，供学习与参考。  
在开源博客方案基础上持续定制，后续功能与体验改进将继续在此更新；正式版本见 [Releases](https://github.com/ReidLiao/reidliao.dev/releases)。

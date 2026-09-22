# AGENTS.md — reidliao.dev

个人自建技术博客。动手前先读 `docs/NEXTJS_BUSINESS_CONTEXT.md`（业务口径与历史禁区）；
以下约束优先于通用习惯；若与主人最新口头要求冲突，以主人为准。

## 技术栈
- Next.js 14 (App Router) + React 18 + pnpm 8.15.8
- Tailwind CSS 3（zinc 暗色 + **lime** 强调色）+ framer-motion
- Drizzle ORM + Neon (PostgreSQL)；Sanity 3 + Studio (`/studio`)；Clerk；Resend + react-email；Upstash Redis

## 部署红线（2GB VPS，违背会 OOM 死机）
- **绝不在服务器上**执行 `npm install` / `pnpm build` / 任何构建镜像的操作
- 构建只在本机：`docker buildx build --platform linux/amd64 --secret id=env,src=.env -t reidliao-dev:latest --load .`
- 依赖安装用 `pnpm install --frozen-lockfile`，保证构建可复现
- `.dockerignore` 必须排除 `.env`；密钥不进镜像层、不硬编码进代码
- 部署流：本机构建 → `docker save -o blog.tar reidliao-dev:latest` → 上传至 `/opt/stacks/reidliao-dev/` → 服务器 `docker load -i blog.tar` → Dockge 用 `image: reidliao-dev:latest` 纯运行模式更新容器
- Compose 约定：`env_file: .env` 注入环境变量（改 `.env` 后必须在 Dockge 重新部署，仅 Restart 不生效）；必须挂载 `reidliao-img-cache:/data/img-cache`（`IMAGE_CACHE_DIR`）；禁止随意 `prune --volumes`

## 架构红线
- 前后端收敛在 Next.js 内，不拆独立项目；后端逻辑走 Server Actions 或 Route Handlers
- 默认 Server Components；必须用 Client Components 时下推到组件树末端
- 浏览量等中间件统计用 fire-and-forget 模式，不阻塞响应

## 禁区（不要擅自做）
1. 文章主图必填（Sanity 手传）；**不**恢复自动封面、`GeneratedCover`、`/api/og/post`
2. **不**加 Footer 社交图标行、博客分类 Tab、移动端悬浮反应条
3. **不**引入新的分析 / 统计 SaaS
4. UI 保持 zinc + **lime** 强调色；全局 focus **不**强制写死 `border-radius`
5. 新增代码高亮语言时：必须同时改 `PortableTextCodeBlock` 注册表 **和** Sanity `languageAlternatives`
6. 文案口径：自建者 / 开源深度定制 / 持续维护；**不**提 cali.so fork 等对比话术
7. 中文走系统字体，**不**挂巨型 CJK webfont；英文用 Manrope
8. Sanity 图片走同源 `/api/img?u=...` 代理 + 磁盘缓存，不暴露超大原图直链

## 工作纪律
- 只改任务需要的文件；不顺手大重构；不写无关 markdown 文档
- 仅在用户明确要求时才 `git commit`，message 极简（如 `update`）
- 优先用中文沟通；代码注释保持克制
- 改 Drizzle / Sanity Schema 时提醒用户执行同步或迁移命令
- 高风险操作先给诊断结论和日志依据，不盲目让用户执行命令

# Next.js 代码库业务与历史上下文 — reidliao.dev

> 本文档供其他 AI / 开发者接手本仓库时使用。优先遵守文中的**产品偏好与禁区**，再改代码。
> 站点已正式上线：https://reidliao.dev
> 仓库：https://github.com/ReidLiao/reidliao.dev
>
> **最后更新：2026-09-22**
> **维护约定**：每次较大幅度改动后，接手的 AI / 开发者应同步更新本文；
> 若本文与主人最新口头要求冲突，以主人为准并更新本文。

---

## 1. 产品定位与身份

- **站点**：Reid Liao 的个人技术博客 / 自建站，中文为主。
- **身份文案（首页四词，已定稿，勿擅自改成三个）**：`<开发者/>`、架构师、软件迷、自建者。
- **首页描述要点**：我是 reidliao.dev 的搭建与维护者；全栈开发、云端架构、系统运维；记录折腾，并和读者一起创造、掌控属于自己的服务。
- **导航（`config/nav.ts`）**：首页 / 博客 / 机房 / 留言墙 / 关于。
- **机房页** `/vps`：精选自用 VPS 与线路实测（非空泛评测）；卡片来自 Sanity `settings.projects`。
- **公众号**：Reidliao.dev；展示位置约定为**关于页 + 文章文末**（`WechatSubscribe`），勿到处堆。
- **品牌表述**：基于开源、深度定制、持续维护的自建博客。**不要**再写「fork 自 cali.so / CaliCastle」「独立项目」「脱离 Vercel」等对比话术。关于页与 README 已按此口径改过。

---

## 2. 技术栈一览

| 层 | 选型 |
|----|------|
| 框架 | Next.js 14 App Router + React 18 |
| CMS | Sanity 3 + Studio `/studio` |
| 鉴权 | Clerk（留言墙登录、Admin `siteOwner`） |
| 数据库 | Neon Postgres + Drizzle（留言、评论、订阅、newsletter） |
| 缓存/计数 | Upstash Redis（浏览量、反应、访客 geo） |
| 邮件 | Resend + react-email |
| 样式 | Tailwind 3 + typography；暗色 `class`；主强调色 **lime** |
| 动效 | framer-motion；`MotionProvider` → `reducedMotion="user"` |
| 包管理 | pnpm 8.15.8（Docker corepack） |
| 部署 | 本机构建 Docker 镜像 → 传到 VPS → Dockge / Compose；前置 Nginx Proxy Manager（底层为 OpenResty，`Server` 头显示 `openresty` 属正常） |

关键文件：`package.json`、`env.mjs`、`.env.example`、`sanity.config.ts`、`middleware.ts`、`Dockerfile`、`docker-compose.yml`。

---

## 3. 路由与模块地图

### 3.1 前台 `app/(main)/`

| 路径 | 职责 |
|------|------|
| `/` | Headline、Photos、近期文章、Resume 等 |
| `/blog` | 文章列表（标题文案：**近期写作**） |
| `/blog/[slug]` | 文章详情、JSON-LD、OG、反应、段落留言、相关文章、文末微信 |
| `/vps` | 机房 / VPS 卡片列表 |
| `/guestbook` | 留言墙 |
| `/about` | 关于 + 微信订阅 |
| `/confirm/[token]` | 邮件订阅确认 + confetti |
| `/newsletters/[id]` | 往期 newsletter |
| `/feed.xml` | RSS（`/feed` `/rss` `/rss.xml` rewrite 至此） |

布局：`app/(main)/layout.tsx` — Header、Footer、`MotionProvider`、`BackToTop`、网格背景。

### 3.2 API `app/api/`

`revalidate`、`img`（图片同源代理+磁盘缓存）、`guestbook`、`comments`、`reactions`、`newsletter`、`link-preview`、`favicon`、`tweet`。

### 3.3 其他

- `/studio` — Sanity Studio（公开路由，靠 Sanity 账号权限）
- `/admin/*` — 站长后台（Clerk `publicMetadata.siteOwner`）
- `app/sitemap.ts`、`app/robots.ts`、`app/not-found.tsx`、`app/(main)/error.tsx`

短链 redirect（`next.config.mjs`）：`/projects`→`/vps`；`/github` `/twitter` `/x` `/youtube` `/bilibili` `/tg`。

---

## 4. 核心业务逻辑

### 4.1 内容（Sanity）

- **文章 `post`（`sanity/schemas/post.ts`）**
  - **必填**：`title`、`slug`、`publishedAt`、**`mainImage`（必须上传，不做自动生成封面）**、`description`、`readingTime`
  - **可选**：`updatedAt`（实质更新时手填；不能早于 `publishedAt`）；有更新时前台显示「更新于」，sitemap / JSON-LD `dateModified` / OG `modifiedTime` 用 `lib/post-dates.ts`
  - `mood`：happy / sad / neutral（反应区）
  - `categories`：引用 `category`
- **禁止再做**：自动生成封面、`GeneratedCover`、动态 `/api/og/post`、分类 Tab（均已撤回）
- **块内容 `blockContent`**：正文、图片、Tweet、**代码块**、**下载块**、视频嵌入；文字颜色 / 高亮标注
- **代码块语言**：Studio `languageAlternatives` **仅允许**前端 PrismLight 已注册语言（bash/js/ts/jsx/tsx/json/yaml/docker/nginx/python/sql/markdown/markup/css/scss/go/diff/toml/ini）。前后端语言表必须同步。
- **下载块**：多版本 `files[]`（`downloadItem`）；旧单链接字段 `hidden` 仅兼容；前台自动匹配平台；免责声明固定文案
- **机房项目**：`project` + `settings.projects`
- **查询**：`sanity/queries.ts`；列表/详情带 `next.tags`（`posts` / `post:{slug}` / `settings`）

### 4.2 缓存刷新

- Sanity Webhook → `POST /api/revalidate`（`x-revalidate-secret`）
- 过滤：`_type in ["post","settings","project"]`
- 刷新 tags + `/` `/blog` `/blog/{slug}` `/feed.xml` 等
- 页面 `revalidate` 多为 600s 兜底

> ⚠️ **待排查（2026-09-22 线上实测）**：首页响应头实际为
> `Cache-Control: private, no-cache, no-store`，600s 疑似未生效。
> 初步判断 middleware（Clerk / 访客统计）将页面逼成了动态渲染。
> 在结论出来之前，**不要**把「600s 兜底」当既定事实；相关排查见任务清单。

### 4.3 图片管道（性能关键）

1. Next `images.loader` → `lib/image-loader.ts`
2. Sanity CDN URL 改写为同源 `/api/img?u=...`（`lib/cdn-image.ts`）
3. `app/api/img` + `lib/img-cache.ts` 磁盘缓存（`IMAGE_CACHE_DIR`，Compose 挂 volume）
4. OG / RSS 可用 `cdnImageSrc(..., { absolute: true })` 直接打 CDN 带宽高
5. **所有文章必须有主图**；缺图会运行时炸（无 GeneratedCover 兜底）

### 4.4 互动与数据

- **段落留言**：Portable Text 段落/标题旁 `Commentable` → Neon `comments`
- **反应**：`BlogReactions` + Redis
- **浏览量**：文章 `INCR`；页脚总浏览 / 最近访客 geo（middleware **fire-and-forget**，不阻塞响应）
- **留言墙 / 订阅**：Clerk + Neon + Resend
- **链接预览**：默认关闭（`NEXT_PUBLIC_SITE_LINK_PREVIEW_ENABLED`）

### 4.5 鉴权边界

- Middleware：Clerk `publicRoutes` 含 catch-all → **页面级不强制登录**
- Admin：布局内检查 `siteOwner`
- `/studio`：Sanity 自身登录

---

## 5. UI / UX 设计规范（本站已形成的习惯）

### 5.1 视觉语言

- 背景：浅 zinc / 深 `primary.900`（`#000212`）+ 网格 SVG + 顶部径向渐变
- 强调色：**lime**（导航激活、hover、selection、focus ring、部分 CTA）
- 字体：Manrope（latin only）；**中文走系统字体**（不要擅自挂巨型 CJK webfont）
- 卡片：文章卡 `rounded-3xl` + 主图 dominant 色变量；机房卡有 spotlight hover
- 避免：紫渐变模板风、奶油衬线风、报纸密排风；勿为「好看」堆卡片/徽章/统计条

### 5.2 文案与版式偏好（主人明确反馈）

- 喜欢**简洁**；曾去掉博客标题装饰横线、撤回过重的移动端反应条与分类 Tab
- 博客 / 留言墙 / 机房页头描述要有实质内容（约两行信息量），不要空洞一行
- 邮件订阅区要美观；newsletter 可保留 emoji
- Footer：**不要**再加社交图标行（与首页 Headline 重复，已撤）
- 微信二维码：已有资源；暗色模式可读性曾优化过

### 5.3 无障碍与动效

- `globals.css`：`prefers-reduced-motion: reduce` 关闭动画与平滑滚动
- `MotionProvider`：`reducedMotion="user"`
- **Focus ring**：双层 box-shadow（背景色 + lime）；**禁止**在全局 focus 上写死 `border-radius`（曾导致下载块 `<select>` 聚焦变方，已修）
- 标题块：hover 显示 `#` 锚点；H1–H4 需一致 `opacity-100`

### 5.4 文章页体验

- 阅读进度条、桌面 TOC、移动 TOC、回到顶部
- 段落留言提示（桌面 hover / 移动点图标）
- 相关文章；文末 `WechatSubscribe` compact
- 代码块：`PrismLight` 按需语言 + 复制按钮；移动端字号略小

### 5.5 下载块 UI

- 胶囊形平台 `<select>` +「前往下载」按钮
- 聚焦/选中时必须保持圆角（依赖全局 focus 不覆盖 radius）
- 底部免责：第三方网盘、本站不托管

---

## 6. 代码架构习惯

### 6.1 目录约定

- `app/(main)/`：页面与页内大组件（Header、Footer、Blog*）
- `components/`：可复用 UI、Portable Text、链接
- `lib/`：纯逻辑与基础设施
- `sanity/`：schema、queries、Studio 组件
- `db/`：Drizzle schema
- `config/`：nav、kv keys、email
- `assets/icons`：SVG 图标统一导出

### 6.2 实现偏好

- Server Component 默认；交互用 `'use client'`
- 样式：Tailwind + `clsxm`；少造新设计系统
- 日期：`@zolplay/utils` 的 `parseDateTime` 等
- 图片：优先 `cdnImageSrc`，勿直链超大 Sanity 原图到前台列表
- 变更范围：**只改任务需要的文件**；不顺手大重构、不滥加 markdown 文档
- 提交：仅在用户要求时 commit；message 跟仓库简洁风格（历史上多为 `update`）
- 构建：`next.config.mjs` 中 `ignoreDuringBuilds` / `ignoreBuildErrors` 为 true
  （⚠️ **技术债**：Docker 构建友好但会吞掉类型错误，本地仍应用 `pnpm build` 自测；未来应逐步收紧）

### 6.3 Docker 构建（必读）

- `.dockerignore` **排除 `.env`**，防止密钥进镜像层
- 构建命令必须带 BuildKit secret：

```bash
docker buildx build --platform linux/amd64 \
  --secret id=env,src=.env \
  -t reidliao-blog-image --load .
```

- 无 secret 时 Dockerfile 会 `SKIP_ENV_VALIDATION=1` 警告构建（`NEXT_PUBLIC_*` 可能未正确内联，生产勿依赖此路径）
- 运行：Compose `env_file: .env` + 图片缓存 volume
- **Brotli**：主人选择方案 0（不折腾 NPM Brotli，保留 Next gzip）

---

## 7. 核心修改历史（按主题，非严格 git 年表）

### 7.1 身份与文案

- Leave fork network；关于页 / README 去 fork、去「独立项目」、去「脱 Vercel」话术
- 首页四词与「搭建与维护者」定稿；博客标题「近期写作」；机房文案偏实测与真实跑站
- 增加 Bilibili 空间短链与首页社交入口

### 7.2 上线前功能与体验

- 404 / error 页品牌化
- BackToTop、阅读进度、移动 TOC、段落留言提示
- 关于页 + 文末微信公众号卡片；二维码替换与暗色优化
- RSS 增强；确认页 confetti 位置优化
- 文章 JSON-LD；OG 图走 `cdnImageSrc` 定宽
- 文章可选「更新时间」全链路（Schema / 展示 / sitemap / JSON-LD / OG）

### 7.3 性能

- 中间件访客统计改为 fire-and-forget
- 自定义 Image loader + `/api/img` 磁盘缓存 + 启动预热（`lib/warm-images` / instrumentation）
- 代码高亮改为 `PrismLight` 按需注册（显著减小文章页 JS）
- Manrope 仅 latin；中文系统字体

### 7.4 UI 打磨与撤回

- **已做**：自定义滚动条；reduced-motion；博客列表 `loading` 骨架 + 空状态；移动导航 focus 改 lime；下载 select focus 圆角修复
- **已撤**：Footer 社交图标行；博客分类 Tab；移动反应条；**整套自动封面 / OG 动态图 / category-accent**
- **主人明确不要**：统计类外部服务、为统计而统计、自动生成封面

### 7.5 清理

- 删除分类相关死查询（`getBlogCategories*`、`getBlogPostsCount*`）
- 新增 `.dockerignore`

### 7.6 曾建议但未做 / 可后做（非紧急）

- 上一篇/下一篇、文章分享（复制链接）、站内搜索
- 系列文、首页置顶、归档页 `/uses`
- 其它路由 loading 骨架
- sitemap 静态页 `lastModified` 仍多为 `new Date()`（文章已用真实时间）
- 删除 `/blog/test` 测试文章（已进 sitemap，待在 Sanity Studio 中清理）

---

## 8. 环境变量要点（详见 `.env.example`）

**构建/运行常需**：`DATABASE_URL`、`RESEND_*`、`UPSTASH_*`、`NEXT_PUBLIC_SANITY_*`、`NEXT_PUBLIC_SITE_URL`、`NEXT_PUBLIC_SITE_EMAIL_FROM`、Clerk 密钥、`REVALIDATE_SECRET`、`IMAGE_CACHE_DIR`。

Clerk 变量不在 `env.mjs` Zod 里，由 Clerk SDK 直接读。

**构建时 vs 运行时**：`NEXT_PUBLIC_*` 等在 `docker buildx` 阶段通过 `--secret id=env,src=.env`
注入并烘焙进镜像；运行时变量走 Compose `env_file: .env`。两类不要混淆，缺一不可。

---

## 9. 给后续 AI 的硬性约束清单

1. **主图必填**；不要恢复自动封面或 `/api/og/post`。
2. **不要**重新加 Footer 社交行、分类 Tab、移动端反应条（除非主人再要求）。
3. **不要**引入新的分析/统计 SaaS「因为好用」。
4. UI 保持 zinc + **lime**；全局 focus **不要**强制 `border-radius`。
5. 新增代码高亮语言时：同时改 `PortableTextCodeBlock` 注册表 **和** Sanity `languageAlternatives`。
6. 改部署相关时：保留 `.dockerignore` + `--secret id=env,src=.env` 构建方式。
7. 文案与「自建者 / 开源深度定制」口径保持一致；勿提 cali.so fork。
8. 小步修改；不擅自写无关文档、不做范围外重构。
9. 仅在用户明确要求时 git commit / push。
10. 优先中文与用户沟通；代码注释保持克制。

---

## 10. 快速心智模型

```
Sanity(内容) ──webhook──► /api/revalidate ──► ISR tags
     │
     ▼
Next 页面渲染 ◄── Neon(互动/订阅) ◄── Clerk
     │
     ├── 图片 ──► /api/img + 磁盘缓存
     ├── 计数/反应/访客 ──► Upstash Redis（middleware 不阻塞）
     └── 邮件 ──► Resend

Docker 本机 build（secret 注入 .env）→ 镜像 → VPS Dockge + NPM
```

---

## 11. 关键文件索引

| 用途 | 路径 |
|------|------|
| 根布局 / SEO | `app/layout.tsx` |
| 主站布局 | `app/(main)/layout.tsx` |
| 文章页 + JSON-LD | `app/(main)/blog/[slug]/page.tsx` |
| 文章 UI | `app/(main)/blog/BlogPostPage.tsx` |
| 全局样式 | `app/globals.css` |
| 图片代理 | `app/api/img/route.ts`、`lib/cdn-image.ts`、`lib/img-cache.ts` |
| 日期辅助 | `lib/post-dates.ts` |
| 代码块 | `components/portable-text/PortableTextCodeBlock.tsx` |
| 下载块 | `components/portable-text/PortableTextDownload.tsx` |
| 文章 Schema | `sanity/schemas/post.ts` |
| 查询 | `sanity/queries.ts` |
| 中间件 | `middleware.ts` |
| Docker | `Dockerfile`、`.dockerignore`、`docker-compose.yml` |

---

## 12. 备份与恢复（建议补齐）

- **Neon**：利用分支 / 时间点恢复（PITR）能力；删库级操作前先建分支快照
- **Sanity**：定期 `sanity dataset export` 导出内容数据集，存到本地 / 网盘
- **VPS**：Dockge 的 compose 文件与 `.env` 纳入异地备份（当前在 `/opt/stacks/` 下）
- 图片磁盘缓存卷（`reidliao-img-cache`）可重建，无需备份

---

*文档生成自仓库现状与项目协作历史，用于 AI 无缝接手后续优化。若与主人最新口头约定冲突，以主人为准并更新本文。*

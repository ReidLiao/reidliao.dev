# reidliao.dev 设计语言

本文档是本站 UI 任务的视觉基线。新增或修改 UI 前先阅读本文，并优先复用现有组件和 Tailwind 类名；如果主人最新要求与本文冲突，以最新要求为准。

## 1. 色彩

本站的主语言是 `zinc` 中性灰 + `lime` 强调色，支持 `dark` class 主题。不要引入另一套品牌色来做主要界面。

### 页面基础

- 浅色页面背景：`bg-zinc-50`，全局变量 `--bg-color` 使用 `theme('colors.zinc.50')`。
- 深色页面背景：自定义 `primary.900`，值为 `#000212`，全局变量 `--bg-color` 使用 `theme('colors.primary.900')`。
- 主内容文字：浅色常用 `text-zinc-800` / `text-zinc-900`，深色使用 `dark:text-zinc-100` / `dark:text-zinc-200`。
- 正文与次要信息：浅色常用 `text-zinc-600`，深色使用 `dark:text-zinc-400`；更弱的信息可使用 `text-zinc-500` 与 `dark:text-zinc-400`，但不能再叠加低透明度造成难读。
- 边框与分隔线：浅色常用 `border-zinc-100`、`border-zinc-200`，深色常用 `dark:border-zinc-700`、`dark:border-zinc-700/40` 或 `dark:border-white/10`。
- 控件表面：浅色常用 `bg-white` / `bg-zinc-100`，深色常用 `dark:bg-zinc-800` / `dark:bg-zinc-900`。

### lime 使用

- 浅色强调：`lime-500` 用于状态点、选中、边框和 focus；文字强调常用 `text-lime-600` / `text-lime-700`。
- 深色强调：`dark:text-lime-400`，必要时使用 `dark:text-lime-300`；边框或 ring 使用 `dark:border-lime-400/40`、`dark:ring-lime-400/20`。
- 低强度背景：`bg-lime-500/10` 或 `dark:bg-lime-400/10`；hover 可提升到 `/20`。
- 选中文字：全局使用 `bg-lime-500` + `text-lime-950`。
- lime 是交互和状态信号，不用来铺满大面积背景，也不用制造促销感。

### 主题背景

主布局目前使用真实资源 `/grid-black.svg`（浅色）和 `/grid.svg`（深色），通过 `bg-top bg-repeat` 铺设；顶部另有低强度 radial overlay。修改背景时保持低对比度和内容优先。

## 2. 字体层级

Tailwind 的字号在 `tailwind.config.cjs` 中有项目级定义：

| 场景 | 类名与实际尺寸 | 常用字重 / 行高 |
| --- | --- | --- |
| 页面 H1 | `text-4xl`（32px/40px），桌面 `sm:text-5xl`（48px/56px） | `font-bold tracking-tight` |
| 页面副标题 | `text-lg`（18px/28px） | `font-medium tracking-tight` |
| 正文 | `text-base`（16px/28px） | 普通字重，长文使用 `leading-relaxed` |
| UI 正文 / 卡片描述 | `text-sm`（14px/24px） | `font-medium` 或普通字重 |
| 辅助信息 | `text-xs`（13px/24px） | `font-medium`，必要时 `leading-relaxed` |
| 更细的技术标注 | `text-[11px]` / `text-[10px]` | 只用于徽章、代码元信息、时间轴等，不承载重要说明 |
| 正文内容标题 | typography 的 `h1`/`h2`/`h3`/`h4`，分别以 `text-2xl`/`text-xl`/`text-base`/`text-sm` 为基准 | `font-semibold`，正文 H1 在渲染层映射为 H2 |

- 英文使用 `Manrope`（仅 latin 子集），由 `lib/font.ts` 提供 `--font-sans`。
- 中文使用系统字体，不引入巨型 CJK webfont。
- 中英文混排时保持自然空隙和正常字重；技术名词、路径、编号、状态标签可使用 `font-mono`，但不要让整段中文变成等宽字体。
- 标题优先短而明确，避免同时使用过多字号、粗细或装饰线。

## 3. 组件模式

### 卡片

- 基础卡片复用 `components/ui/Card.tsx`：`group relative flex flex-col items-start`。
- 链接卡片使用绝对定位的可点击区域，hover 仅改变底层表面：浅色 `bg-zinc-200/30`，深色 `dark:bg-zinc-700/20`，配合 `scale-95` → `scale-100` 和透明度过渡。
- 卡片正文使用 `relative z-10`，描述默认 `text-sm text-zinc-600 dark:text-zinc-400`。
- 机房卡片可以保留 spotlight、轻微上浮、lime 微光边框；hover 层不能重复渲染标题、描述或徽章。

### 徽章

- 状态徽章使用小尺寸、圆角胶囊和 ring，不做大面积彩色标签。
- 在用状态的实际模式：`bg-lime-500/10 text-lime-700 ring-lime-500/20 dark:bg-lime-400/10 dark:text-lime-300 dark:ring-lime-400/20`。
- 中性状态的实际模式：`bg-zinc-100 text-zinc-600 ring-zinc-900/5 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-white/10`。
- 常用尺寸：`px-2 py-0.5 text-[11px] font-medium`。

### 按钮与链接

- 基础按钮复用 `components/ui/Button.tsx`，共用 `inline-flex items-center gap-2 justify-center rounded-lg py-2 px-3 text-sm ... transition`。
- 主按钮：浅色 `bg-zinc-800 text-zinc-100 hover:bg-zinc-700`；深色 `dark:bg-zinc-200 dark:text-black dark:hover:bg-zinc-300`。
- 次按钮可使用现有的轻表面、`ring-1`、`backdrop-blur` 模式；不要为普通操作增加发光或渐变大色块。
- 文本链接默认保持中性，hover 使用 `text-lime-500` / `dark:hover:text-lime-400`。

### 输入框

- 输入框保持轻表面、细边框和清晰 focus：常用 `rounded-lg border border-zinc-900/10 bg-white px-3 ... focus:border-lime-500 focus:ring-4 focus:ring-lime-500/10 dark:border-zinc-700 dark:bg-zinc-700/[0.15] dark:focus:border-lime-400/50 dark:focus:ring-lime-400/5`。
- 留言和评论输入默认不自动聚焦，避免移动端打开键盘；只有明确的登录后评论流程可以保留自动聚焦。

### Lime focus ring

全局 `app/globals.css` 已统一处理 `a`、`button`、`[role='button']`、`input`、`textarea`、`select` 和 `[tabindex]` 的 `:focus-visible`：

```css
box-shadow:
  0 0 0 2px var(--bg-color),
  0 0 0 4px theme('colors.lime.500' / 55%);
```

深色主题使用 `theme('colors.lime.400' / 60%)`。不要在全局 focus 规则里写死 `border-radius`；控件自身的圆角必须保留。原生 `summary` 等不在全局选择器内的可聚焦元素，需要单独补 `focus-visible:ring-2 focus-visible:ring-lime-500/70 dark:focus-visible:ring-lime-400/70`。

### Tooltip

复用 `components/ui/Tooltip.tsx` 的 Radix Tooltip + `ElegantTooltip` 模式。当前内容样式为 `rounded-md px-3 py-1.5 text-xs font-medium`，浅色使用 `from-zinc-50/50 to-white/95 text-zinc-900`，深色使用 `dark:from-zinc-900/50 dark:to-zinc-800/95 dark:text-zinc-200`，配合 `shadow-lg`、`ring-1`、`backdrop-blur`。渐变只限于这种小型浮层，不能扩展成页面主视觉。

### 无障碍

- 图标按钮必须有可读的 `aria-label`；纯装饰图标使用 `aria-hidden="true"`。
- 键盘 focus 必须可见；不能只依赖 hover。
- 动画遵守 `prefers-reduced-motion: reduce` 和 `MotionProvider` 的用户设置。
- 重要信息不能只靠颜色表达，状态徽章应同时有文字。

## 4. 技术味主题元素

- 蓝图感来自现有低对比度细网格，而不是大面积插画或渐变。可在 Hero 附近强化网格层次，但只使用细线、留白和少量标记。
- 状态感可使用 `h-1.5 w-1.5` 或 `h-2 w-2` 的 lime 点、`animate-pulse` 和简短的等宽状态文字，例如机房页的「运行中」。状态点旁必须有文字，不用动画单独传达在线状态。
- 分组、时间轴、代码元信息可以使用 `font-mono text-xs`、两位编号和细分割线，例如机房页的 `01 — VPS / 服务器`。
- 十字标记、坐标线等蓝图装饰只能少量使用，并集中在 Hero 或区块标题周围；不能干扰正文、点击区域或移动端阅读。
- 所有装饰都要在浅色和深色主题中保持低对比度，并服从减少动效设置。

## 5. 禁忌清单

- 不要使用渐变大色块、紫色模板风、过度发光或明显营销视觉。
- 不要堆价格对比表、排行榜、促销标签或无业务意义的统计条；aff 相关页面尤其如此。
- 次要文字的浅色主题对比度底线从 `zinc-500` 起步，正文和重要辅助说明优先 `zinc-600`；深色主题使用对应的 `dark:text-zinc-400` / `dark:text-zinc-300`。不要让 12px 左右文字再叠加 `opacity-50` 等透明度。
- 不要把中文整页设为等宽字体，不要挂巨型 CJK webfont。
- 不要用 hover 重复渲染内容；视觉 hover 层只做高亮、边框或背景反馈。
- 不要给全局 focus ring 强制写死 `border-radius`。
- 不要为图标按钮省略 `aria-label`。
- 不要擅自增加 Footer 社交图标行、博客分类 Tab 或移动端悬浮反应条。

## 6. 文案语气

- 冷静、具体、第一人称，像维护者记录真实使用经验。
- 中文为主，技术名词保留准确英文；描述优先说明做了什么、为什么这样做、实际表现如何。
- 不写广告词、夸张承诺或泛泛的「顶级」「极致」「闭眼入」。
- aff 披露正常展示、直白透明：通过推广链接购买价格不变，站长获得少量佣金；不使用促销口吻。
- 延续「自建者 / 开源深度定制 / 持续维护」的产品口径，不写 fork 对比或贬低其他方案的话术。

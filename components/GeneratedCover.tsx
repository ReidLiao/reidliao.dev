import { clsxm } from '@zolplay/utils'

import { getCategoryAccent } from '~/lib/category-accent'

/**
 * 叠加在封面右上角的分类胶囊，用于「上传图片」的封面，
 * 与自动生成封面保持一致的视觉语言（分类色圆点 + 等宽大写分类）。
 * 采用深色玻璃底，保证在任意照片上都清晰可读。
 */
export function CoverCategoryTag({
  category,
  variant = 'card',
  className,
}: {
  category?: string
  variant?: 'card' | 'hero'
  className?: string
}) {
  if (!category) return null
  const isHero = variant === 'hero'
  const accent = getCategoryAccent(category)

  return (
    <span
      className={clsxm(
        'pointer-events-none absolute z-10 inline-flex max-w-[60%] items-center gap-1.5 rounded-full bg-black/40 ring-1 ring-inset ring-white/15 backdrop-blur-md',
        isHero
          ? 'right-3 top-3 px-3 py-1.5 md:right-4 md:top-4'
          : 'right-2.5 top-2.5 px-2 py-1',
        className
      )}
    >
      <span
        className={clsxm(
          'shrink-0 rounded-full',
          isHero ? 'h-2 w-2' : 'h-1.5 w-1.5'
        )}
        style={{ backgroundColor: accent.dot }}
      />
      <span
        className={clsxm(
          'truncate font-mono uppercase tracking-[0.14em]',
          isHero ? 'text-xs md:text-sm' : 'text-[10px]'
        )}
        style={{ color: accent.text }}
      >
        {category}
      </span>
    </span>
  )
}

/**
 * 无主图时自动生成的极简文字封面：站点深色底 + 点阵纹 + 分类色光晕 + 超大淡色首字。
 * 左侧色条与左对齐排版营造编辑设计感；左上角由 <PostAuthorBadge> 叠加头像。
 *
 * - hero（文章头）：展示大标题，杂志封面式排布。
 * - card（列表卡）：卡片下方已有标题，封面走装饰化，避免标题重复。
 *
 * 纯 DOM/CSS，无需外部图片。
 */
export function GeneratedCover({
  title,
  category,
  variant = 'card',
  className,
}: {
  title: string
  category?: string
  variant?: 'card' | 'hero'
  className?: string
}) {
  const isHero = variant === 'hero'
  const kicker = category || 'reidliao.dev'
  const accent = getCategoryAccent(category)
  const firstGlyph = Array.from(title.trim())[0] ?? '·'

  return (
    <div
      className={clsxm(
        'relative flex h-full w-full select-none overflow-hidden',
        className
      )}
      style={{
        backgroundColor: '#0a0a0f',
        backgroundImage: [
          `radial-gradient(circle at 82% 18%, rgba(${accent.rgb},0.22), transparent 46%)`,
          'linear-gradient(115deg, rgba(255,255,255,0.03), transparent 40%)',
          'linear-gradient(to bottom, transparent 38%, rgba(10,10,15,0.92) 100%)',
          'radial-gradient(rgba(255,255,255,0.065) 1px, transparent 1.4px)',
        ].join(', '),
        backgroundSize: '100% 100%, 100% 100%, 100% 100%, 22px 22px',
      }}
    >
      {/* 左侧分类色条 */}
      <span
        aria-hidden
        className="absolute left-0 top-0 h-full"
        style={{
          width: isHero ? 6 : 4,
          background: `linear-gradient(to bottom, ${accent.dot}, rgba(${accent.rgb},0.25))`,
        }}
      />

      {/* 超大淡色首字（drop-cap 式装饰） */}
      <span
        aria-hidden
        className={clsxm(
          'pointer-events-none absolute select-none font-bold leading-none',
          isHero
            ? '-bottom-6 right-3 text-[150px] md:right-8 md:text-[240px]'
            : '-bottom-4 right-1 text-[104px]'
        )}
        style={{ color: accent.dot, opacity: 0.12 }}
      >
        {firstGlyph}
      </span>

      {isHero ? (
        <div className="relative z-10 flex h-full w-full flex-col justify-center gap-3.5 pl-8 pr-8 md:gap-4 md:pl-11 md:pr-12">
          <div className="flex items-center gap-2">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: accent.dot }}
            />
            <span
              className="truncate font-mono text-xs uppercase tracking-[0.16em] md:text-sm"
              style={{ color: accent.text }}
            >
              {kicker}
            </span>
          </div>
          <h3 className="max-w-[80%] text-3xl font-bold leading-tight text-white md:text-[2.75rem]">
            {title}
          </h3>
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden
              className="h-1.5 w-9 rounded-full"
              style={{ backgroundColor: accent.dot }}
            />
            <span className="font-mono text-xs text-white/45 md:text-sm">
              reidliao.dev
            </span>
          </div>
        </div>
      ) : (
        <div className="relative z-10 flex h-full w-full flex-col justify-end gap-2 pb-4 pl-5 pr-4">
          <span
            className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em]"
            style={{ color: accent.text }}
          >
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: accent.dot }}
            />
            {kicker}
          </span>
          <span className="font-mono text-[10px] text-white/40">
            reidliao.dev
          </span>
        </div>
      )}
    </div>
  )
}

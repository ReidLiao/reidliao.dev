import { clsxm } from '@zolplay/utils'

/**
 * 无主图时自动生成的极简文字封面：站点深色底 + 细网格纹 + lime 点缀。
 * 左上角由 <PostAuthorBadge> 叠加头像，故分类标签靠右排布避免遮挡。
 *
 * - hero（文章头）：展示大标题，杂志封面式排布。
 * - card（列表卡）：卡片下方已有标题，封面走装饰化（分类 + 站名），避免标题重复。
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

  return (
    <div
      className={clsxm(
        'relative flex h-full w-full select-none flex-col justify-between overflow-hidden',
        className
      )}
      style={{
        backgroundColor: '#0a0a0f',
        backgroundImage: [
          'radial-gradient(760px circle at 8% -12%, rgba(163,230,53,0.18), transparent 55%)',
          'radial-gradient(560px circle at 108% 118%, rgba(163,230,53,0.10), transparent 58%)',
          'linear-gradient(to bottom, transparent 45%, rgba(10,10,15,0.85) 100%)',
          'linear-gradient(to right, rgba(255,255,255,0.045) 1px, transparent 1px)',
          'linear-gradient(to bottom, rgba(255,255,255,0.045) 1px, transparent 1px)',
        ].join(', '),
        backgroundSize: '100% 100%, 100% 100%, 100% 100%, 34px 34px, 34px 34px',
      }}
    >
      <div className={clsxm('flex justify-end', isHero ? 'p-5 md:p-7' : 'p-3.5')}>
        <span
          className={clsxm(
            'inline-flex max-w-[70%] items-center gap-1.5 rounded-full bg-white/[0.06] ring-1 ring-inset ring-white/10 backdrop-blur-sm',
            isHero ? 'px-3 py-1.5' : 'px-2 py-1'
          )}
        >
          <span
            className={clsxm(
              'shrink-0 rounded-full bg-lime-400',
              isHero ? 'h-2 w-2' : 'h-1.5 w-1.5'
            )}
          />
          <span
            className={clsxm(
              'truncate font-mono uppercase tracking-[0.14em] text-lime-300/90',
              isHero ? 'text-xs md:text-sm' : 'text-[10px]'
            )}
          >
            {kicker}
          </span>
        </span>
      </div>

      {isHero ? (
        <div className="p-6 md:p-8">
          <h3 className="text-2xl font-bold leading-tight text-white md:text-4xl">
            {title}
          </h3>
          <div className="mt-5 flex items-center gap-2.5">
            <span aria-hidden className="h-1.5 w-9 rounded-full bg-lime-400" />
            <span className="font-mono text-xs text-white/45 md:text-sm">
              reidliao.dev
            </span>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 p-4">
          <span aria-hidden className="h-1 w-6 rounded-full bg-lime-400" />
          <span className="font-mono text-[10px] text-white/45">
            reidliao.dev
          </span>
        </div>
      )}
    </div>
  )
}

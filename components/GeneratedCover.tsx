import { clsxm } from '@zolplay/utils'

/**
 * 无主图时自动生成的极简文字封面：深色底 + 细网格纹 + lime 点缀。
 * 用于文章头部（hero）与列表卡（card）。纯 DOM/CSS，无需外部图片。
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

  return (
    <div
      className={clsxm(
        'relative flex h-full w-full select-none flex-col justify-between overflow-hidden bg-zinc-900',
        className
      )}
      style={{
        backgroundImage: [
          'radial-gradient(720px circle at 12% -10%, rgba(163,230,53,0.16), transparent 55%)',
          'radial-gradient(520px circle at 100% 120%, rgba(163,230,53,0.08), transparent 60%)',
          'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px)',
          'linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)',
        ].join(', '),
        backgroundSize: '100% 100%, 100% 100%, 32px 32px, 32px 32px',
      }}
    >
      <div
        className={clsxm(
          'flex items-center gap-2',
          isHero ? 'p-6 md:p-8' : 'p-4'
        )}
      >
        <span className="h-2 w-2 shrink-0 rounded-full bg-lime-400" />
        <span
          className={clsxm(
            'truncate font-mono uppercase tracking-widest text-lime-300/90',
            isHero ? 'text-xs md:text-sm' : 'text-[10px]'
          )}
        >
          {category || 'reidliao.dev'}
        </span>
      </div>

      <div className={clsxm(isHero ? 'px-6 md:px-8' : 'px-4')}>
        <h3
          className={clsxm(
            'font-bold leading-tight text-white',
            isHero ? 'text-2xl md:text-4xl' : 'line-clamp-3 text-lg'
          )}
        >
          {title}
        </h3>
      </div>

      <div
        className={clsxm(
          'flex items-center justify-between',
          isHero ? 'p-6 md:p-8' : 'p-4'
        )}
      >
        <span
          className={clsxm(
            'font-mono text-white/40',
            isHero ? 'text-xs md:text-sm' : 'text-[10px]'
          )}
        >
          reidliao.dev
        </span>
        <span
          aria-hidden
          className={clsxm(
            'rounded-full bg-lime-400/90',
            isHero ? 'h-1.5 w-10' : 'h-1 w-6'
          )}
        />
      </div>
    </div>
  )
}

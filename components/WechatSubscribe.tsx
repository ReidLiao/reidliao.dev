import Image from 'next/image'

import { clsxm } from '@zolplay/utils'

import { WeChatIcon } from '~/assets'

const ACCOUNT_NAME = 'Reidliao.dev'
const ACCOUNT_BIO =
  '<开发者/>、架构师、软件迷。专注全栈开发、云端架构与系统运维。'

export function WechatSubscribe({
  variant = 'default',
  className,
}: {
  variant?: 'default' | 'compact'
  className?: string
}) {
  const isCompact = variant === 'compact'

  return (
    <aside
      className={clsxm(
        'rounded-2xl border border-zinc-100 dark:border-zinc-700/40',
        isCompact ? 'p-5' : 'p-6',
        className
      )}
    >
      <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-start sm:text-left">
        <div className="shrink-0 rounded-xl bg-white p-2 shadow-sm ring-1 ring-zinc-900/5 dark:bg-zinc-100 dark:ring-white/10">
          <Image
            src="/wechat-qrcode.jpg"
            alt={`${ACCOUNT_NAME} 微信公众号二维码`}
            width={isCompact ? 112 : 128}
            height={isCompact ? 112 : 128}
            className={clsxm('rounded-lg', isCompact ? 'size-28' : 'size-32')}
            priority={variant === 'default'}
          />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="flex items-center justify-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100 sm:justify-start">
            <WeChatIcon className="h-5 w-5 flex-none" />
            <span>微信公众号</span>
          </h2>
          <p className="mt-2 font-mono text-sm font-medium text-zinc-800 dark:text-zinc-200">
            {ACCOUNT_NAME}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {isCompact
              ? '扫码关注，获取技术折腾与运维笔记更新。'
              : ACCOUNT_BIO}
          </p>
          <p className="mt-3 text-xs leading-relaxed text-zinc-500 dark:text-zinc-500">
            {isCompact
              ? '微信扫一扫即可关注'
              : '微信扫一扫上方二维码即可关注；与博客同名，内容互补更新。'}
          </p>
        </div>
      </div>
    </aside>
  )
}

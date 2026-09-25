import { clsxm } from '@zolplay/utils'
import Image from 'next/image'

import { WeChatIcon } from '~/assets'

const ACCOUNT_NAME = 'Reidliao.dev'
const ACCOUNT_BIO =
  '开发者、架构师、软件迷、自建者。专注全栈开发、云端架构与系统运维。'

export function WechatSubscribe({
  className,
}: {
  className?: string
}) {
  return (
    <aside
      className={clsxm(
        'rounded-2xl border border-zinc-100 dark:border-zinc-700/40',
        'p-6',
        className
      )}
    >
      <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-start sm:text-left">
        <div className="shrink-0 rounded-xl bg-white p-1.5 shadow-sm ring-1 ring-zinc-900/5 dark:bg-white/95 dark:shadow-none dark:ring-1 dark:ring-white/15">
            <Image
              src="/wechat-qrcode.jpg"
              alt={`${ACCOUNT_NAME} 微信公众号二维码`}
              width={112}
              height={112}
              className="size-28 rounded-lg"
              priority
          />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="flex items-center justify-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100 sm:justify-start">
            <WeChatIcon className="h-5 w-5 flex-none" />
            <span>微信公众号</span>
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {ACCOUNT_BIO}
          </p>
          <p className="mt-3 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
            微信扫一扫二维码即可关注，获取技术折腾与运维笔记更新。
          </p>
        </div>
      </div>
    </aside>
  )
}

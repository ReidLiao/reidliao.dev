import { AppWindow } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { cdnImageSrc } from '~/lib/cdn-image'
import type { HomepageSoftware } from '~/sanity/queries'

export function LatestSoftware({ items }: { items: HomepageSoftware[] }) {
  return (
    <section className="rounded-2xl border border-zinc-100 p-4 dark:border-zinc-700/40 sm:p-6">
      <h2 className="flex min-h-11 items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        <AppWindow aria-hidden="true" className="h-5 w-5 flex-none" />
        最新软件
      </h2>
      {items.length ? (
        <ul className="mt-3 divide-y divide-zinc-100 dark:divide-zinc-700/40">
          {items.map(({ _key, icon, name, url }) => (
            <li key={_key}>
              <Link
                href={url}
                className="group flex min-h-11 items-center gap-3 rounded-md py-2 text-sm font-medium text-zinc-900 hover:text-emerald-700 dark:text-zinc-100 dark:hover:text-emerald-400"
              >
                {icon ? (
                  <Image
                    src={cdnImageSrc(icon, { width: 64, quality: 85 })}
                    alt=""
                    width={28}
                    height={28}
                    className="h-7 w-7 flex-none rounded-md object-contain"
                  />
                ) : null}
                <span className="min-w-0 grow break-words">{name}</span>
                <span
                  aria-hidden="true"
                  className="text-zinc-500 dark:text-zinc-400"
                >
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-xs text-zinc-600 dark:text-zinc-400">
          暂时没有软件条目。
        </p>
      )}
    </section>
  )
}

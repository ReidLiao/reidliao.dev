'use client'

import { type PortableTextComponentProps } from '@portabletext/react'
import React from 'react'

import {
  ClipboardCheckIcon,
  ClipboardDataIcon,
  CloudIcon,
  ExternalLinkIcon,
} from '~/assets'
import { ElegantTooltip } from '~/components/ui/Tooltip'

const platformLabel: Record<string, string> = {
  any: '通用',
  macos: 'macOS',
  windows: 'Windows',
  linux: 'Linux',
  android: 'Android',
  ios: 'iOS',
}

type DownloadValue = {
  _key: string
  title: string
  url: string
  version?: string
  platform?: string
  size?: string
  checksum?: string
  note?: string
}

export function PortableTextDownload({
  value,
}: PortableTextComponentProps<DownloadValue>) {
  const [copied, setCopied] = React.useState<'checksum' | 'note' | null>(null)

  const meta = React.useMemo(() => {
    const items: string[] = []
    if (value.version) items.push(`v${value.version.replace(/^v/i, '')}`)
    if (value.platform && value.platform !== 'any') {
      items.push(platformLabel[value.platform] ?? value.platform)
    }
    if (value.size) {
      items.push(value.size.replace(/^大小[：:]\s*/, ''))
    }
    return items
  }, [value.version, value.platform, value.size])

  const copyText = React.useCallback(
    async (text: string, kind: 'checksum' | 'note') => {
      try {
        await navigator.clipboard.writeText(text)
        setCopied(kind)
        window.setTimeout(() => setCopied(null), 2500)
      } catch {
        console.error('Failed to copy download meta')
      }
    },
    []
  )

  if (!value?.title || !value?.url) return null

  return (
    <aside
      data-blockid={value._key}
      className="not-prose group/download my-8 overflow-hidden rounded-2xl border border-zinc-200/80 bg-gradient-to-b from-zinc-50/90 to-white shadow-sm shadow-zinc-900/[0.03] ring-1 ring-zinc-900/[0.03] transition dark:border-zinc-700/50 dark:from-zinc-900/80 dark:to-zinc-900/40 dark:shadow-none dark:ring-white/[0.04] sm:rounded-3xl"
    >
      <div className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-5 sm:py-5">
        <div className="flex min-w-0 flex-1 items-start gap-3.5">
          <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-lime-500/10 text-lime-700 ring-1 ring-lime-500/15 transition group-hover/download:bg-lime-500/15 dark:bg-lime-400/10 dark:text-lime-300 dark:ring-lime-400/15">
            <CloudIcon className="h-5 w-5" />
          </span>

          <div className="min-w-0">
            <p className="font-mono text-[10px] font-medium tracking-[0.18em] text-zinc-400 dark:text-zinc-500">
              DOWNLOAD
            </p>
            <h4 className="mt-1 truncate text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-lg">
              {value.title}
            </h4>
            {meta.length > 0 ? (
              <p className="mt-1.5 font-mono text-[11px] tabular-nums text-zinc-500 dark:text-zinc-400">
                {meta.join(' · ')}
              </p>
            ) : null}
          </div>
        </div>

        <a
          href={value.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-zinc-900/10 transition hover:-translate-y-0.5 hover:bg-zinc-800 hover:shadow-xl hover:shadow-lime-900/10 dark:bg-zinc-100 dark:text-zinc-900 dark:shadow-none dark:hover:bg-white"
        >
          前往下载
          <ExternalLinkIcon className="h-3.5 w-3.5 opacity-80" />
        </a>
      </div>

      {(value.note || value.checksum) && (
        <div className="space-y-2.5 border-t border-dashed border-zinc-200/90 bg-zinc-50/50 px-4 py-3 dark:border-zinc-700/50 dark:bg-zinc-950/30 sm:px-5">
          {value.note ? (
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {value.note}
              <ElegantTooltip content={copied === 'note' ? '已复制' : '复制备注'}>
                <button
                  type="button"
                  className="ml-1.5 inline-flex translate-y-0.5 text-zinc-400 transition hover:text-lime-600 dark:hover:text-lime-400"
                  onClick={() => copyText(value.note!, 'note')}
                  aria-label="复制备注"
                >
                  {copied === 'note' ? (
                    <ClipboardCheckIcon className="h-3.5 w-3.5" />
                  ) : (
                    <ClipboardDataIcon className="h-3.5 w-3.5" />
                  )}
                </button>
              </ElegantTooltip>
            </p>
          ) : null}

          {value.checksum ? (
            <div className="flex items-start gap-2 rounded-xl bg-zinc-950 px-3 py-2 font-mono text-[11px] leading-relaxed text-lime-400/90">
              <span className="shrink-0 text-zinc-500">sha</span>
              <code className="min-w-0 flex-1 break-all">{value.checksum}</code>
              <ElegantTooltip
                content={copied === 'checksum' ? '已复制' : '复制校验和'}
              >
                <button
                  type="button"
                  className="shrink-0 text-zinc-500 transition hover:text-lime-300"
                  onClick={() => copyText(value.checksum!, 'checksum')}
                  aria-label="复制校验和"
                >
                  {copied === 'checksum' ? (
                    <ClipboardCheckIcon className="h-3.5 w-3.5" />
                  ) : (
                    <ClipboardDataIcon className="h-3.5 w-3.5" />
                  )}
                </button>
              </ElegantTooltip>
            </div>
          ) : null}
        </div>
      )}

      <p className="border-t border-zinc-100 px-4 py-2.5 text-[11px] leading-relaxed text-zinc-400 dark:border-zinc-800 dark:text-zinc-500 sm:px-5">
        资源由第三方网盘提供，本站不托管安装包。请自行核验来源与完整性。
      </p>
    </aside>
  )
}

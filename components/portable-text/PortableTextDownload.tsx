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
    if (value.size) items.push(value.size)
    return items
  }, [value.version, value.platform, value.size])

  const copyText = React.useCallback(async (text: string, kind: 'checksum' | 'note') => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(kind)
      window.setTimeout(() => setCopied(null), 2500)
    } catch {
      console.error('Failed to copy download meta')
    }
  }, [])

  if (!value?.title || !value?.url) return null

  return (
    <aside
      data-blockid={value._key}
      className="not-prose my-8 rounded-2xl border border-zinc-200 bg-zinc-50/80 px-4 py-4 dark:border-zinc-700/60 dark:bg-zinc-900/50 sm:px-5"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lime-500/10 text-lime-700 dark:bg-lime-400/10 dark:text-lime-300">
              <CloudIcon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="font-mono text-[11px] tracking-wide text-zinc-400 dark:text-zinc-500">
                DOWNLOAD
              </p>
              <h4 className="mt-0.5 truncate text-base font-semibold text-zinc-900 dark:text-zinc-100">
                {value.title}
              </h4>
              {meta.length > 0 ? (
                <p className="mt-1 font-mono text-xs text-zinc-500 dark:text-zinc-400">
                  {meta.join(' · ')}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <a
          href={value.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          前往下载
          <ExternalLinkIcon className="h-4 w-4" />
        </a>
      </div>

      {value.note ? (
        <p className="mt-4 border-t border-dashed border-zinc-200 pt-3 text-sm leading-relaxed text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
          {value.note}
          <ElegantTooltip content={copied === 'note' ? '已复制' : '复制备注'}>
            <button
              type="button"
              className="ml-2 inline-flex translate-y-0.5 text-zinc-400 transition hover:text-zinc-600 dark:hover:text-zinc-200"
              onClick={() => copyText(value.note!, 'note')}
              aria-label="复制备注"
            >
              {copied === 'note' ? (
                <ClipboardCheckIcon className="h-4 w-4" />
              ) : (
                <ClipboardDataIcon className="h-4 w-4" />
              )}
            </button>
          </ElegantTooltip>
        </p>
      ) : null}

      {value.checksum ? (
        <div className="mt-3 flex items-start gap-2 rounded-lg bg-zinc-100/80 px-3 py-2 font-mono text-[11px] leading-relaxed text-zinc-600 dark:bg-zinc-800/80 dark:text-zinc-300">
          <span className="shrink-0 text-zinc-400">SHA</span>
          <code className="min-w-0 flex-1 break-all">{value.checksum}</code>
          <ElegantTooltip
            content={copied === 'checksum' ? '已复制' : '复制校验和'}
          >
            <button
              type="button"
              className="shrink-0 text-zinc-400 transition hover:text-zinc-600 dark:hover:text-zinc-200"
              onClick={() => copyText(value.checksum!, 'checksum')}
              aria-label="复制校验和"
            >
              {copied === 'checksum' ? (
                <ClipboardCheckIcon className="h-4 w-4" />
              ) : (
                <ClipboardDataIcon className="h-4 w-4" />
              )}
            </button>
          </ElegantTooltip>
        </div>
      ) : null}

      <p className="mt-3 text-[11px] text-zinc-400 dark:text-zinc-500">
        资源由第三方网盘提供，本站不托管安装包。请自行核验来源与完整性。
      </p>
    </aside>
  )
}

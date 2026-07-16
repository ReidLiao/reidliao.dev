'use client'

import { type PortableTextComponentProps } from '@portabletext/react'
import React from 'react'

import {
  ClipboardCheckIcon,
  ClipboardDataIcon,
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

  const pills = React.useMemo(() => {
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
      className="not-prose my-10 border-l-2 border-lime-500/50 pl-4 dark:border-lime-400/40 sm:pl-5"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[11px] tracking-widest text-lime-600 dark:text-lime-400">
            $ download
          </p>
          <h4 className="mt-1.5 text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            {value.title}
          </h4>

          {pills.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {pills.map((pill) => (
                <span
                  key={pill}
                  className="rounded-md border border-zinc-200 px-2 py-0.5 font-mono text-[11px] tracking-wide text-zinc-600 dark:border-zinc-700 dark:text-zinc-300"
                >
                  {pill}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <a
          href={value.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full border border-zinc-200 bg-transparent px-4 py-2 text-xs font-medium text-zinc-700 transition hover:border-lime-500/40 hover:text-lime-600 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-lime-400/40 dark:hover:text-lime-400"
        >
          前往下载
          <ExternalLinkIcon className="h-3.5 w-3.5" />
        </a>
      </div>

      {value.note ? (
        <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
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
        <pre className="mt-4 overflow-x-auto rounded-lg bg-zinc-950 px-3 py-2.5 font-mono text-[11px] leading-relaxed text-lime-400">
          <div className="flex items-start gap-2">
            <span className="shrink-0 text-zinc-500"># checksum</span>
            <code className="min-w-0 flex-1 break-all text-lime-400/90">
              {value.checksum}
            </code>
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
        </pre>
      ) : null}

      <p className="mt-3 font-mono text-[10px] text-zinc-400 dark:text-zinc-500">
        // 第三方网盘 · 本站不托管 · 请自行核验
      </p>
    </aside>
  )
}

'use client'

import { clsxm } from '@zolplay/utils'
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

type DownloadFile = {
  _key?: string
  label?: string
  url: string
  version?: string
  platform?: string
  size?: string
  checksum?: string
}

type DownloadValue = {
  _key: string
  title: string
  note?: string
  updatedAt?: string
  files?: DownloadFile[]
  /** legacy single-file fields */
  url?: string
  version?: string
  platform?: string
  size?: string
  checksum?: string
}

function normalizeFiles(value: DownloadValue): DownloadFile[] {
  if (Array.isArray(value.files) && value.files.length > 0) {
    return value.files.filter((f) => Boolean(f?.url))
  }
  if (value.url) {
    return [
      {
        url: value.url,
        version: value.version,
        platform: value.platform,
        size: value.size,
        checksum: value.checksum,
      },
    ]
  }
  return []
}

function detectClientPlatform(): keyof typeof platformLabel | null {
  if (typeof navigator === 'undefined') return null
  const ua = navigator.userAgent
  const touchPad =
    navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1

  if (/iPhone|iPod/i.test(ua) || /iPad/i.test(ua) || touchPad) return 'ios'
  if (/Android/i.test(ua)) return 'android'
  if (/Mac|Macintosh/i.test(ua)) return 'macos'
  if (/Win/i.test(ua)) return 'windows'
  if (/Linux/i.test(ua)) return 'linux'
  return null
}

/** Prefer exact platform match, then「通用」, else first item. */
function pickInitialIndex(files: DownloadFile[]): number {
  if (files.length <= 1) return 0
  const platform = detectClientPlatform()
  if (!platform) return 0
  const exact = files.findIndex((f) => f.platform === platform)
  if (exact >= 0) return exact
  const fallback = files.findIndex(
    (f) => !f.platform || f.platform === 'any'
  )
  return fallback >= 0 ? fallback : 0
}

function fileLabel(file: DownloadFile, idx: number, total: number) {
  if (file.label) return file.label
  if (file.platform && file.platform !== 'any') {
    return platformLabel[file.platform] ?? file.platform
  }
  if (file.version) return `v${file.version.replace(/^v/i, '')}`
  return total > 1 ? `版本 ${idx + 1}` : '默认'
}

function fileMeta(file: DownloadFile) {
  const items: string[] = []
  if (file.version) items.push(`v${file.version.replace(/^v/i, '')}`)
  if (file.platform && file.platform !== 'any') {
    items.push(platformLabel[file.platform] ?? file.platform)
  }
  if (file.size) items.push(file.size.replace(/^大小[：:]\s*/, ''))
  return items
}

function formatUpdatedAt(iso: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso)
  if (!m) return iso
  return `${m[1]}-${m[2]}-${m[3]}`
}

export function PortableTextDownload({
  value,
}: PortableTextComponentProps<DownloadValue>) {
  const [copied, setCopied] = React.useState<string | null>(null)
  const files = React.useMemo(() => normalizeFiles(value), [value])
  const [selected, setSelected] = React.useState(0)

  // Auto-pick once per block (after mount) to avoid SSR mismatch & wiping manual picks.
  React.useEffect(() => {
    setSelected(pickInitialIndex(files))
    // Intentionally only when the block identity changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value._key])

  const safeIndex = Math.min(selected, Math.max(files.length - 1, 0))
  const active = files[safeIndex]
  const meta = active ? fileMeta(active) : []
  const multi = files.length > 1
  const useChips = multi && files.length <= 4
  const updatedLabel = value.updatedAt
    ? formatUpdatedAt(value.updatedAt)
    : null

  const copyText = React.useCallback(async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(key)
      window.setTimeout(() => setCopied(null), 2500)
    } catch {
      console.error('Failed to copy download meta')
    }
  }, [])

  if (!value?.title || !active) return null

  return (
    <aside
      data-blockid={value._key}
      className="not-prose group/download my-8 overflow-hidden rounded-2xl border border-zinc-200/80 bg-gradient-to-b from-zinc-50/50 to-white/90 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:border-zinc-700/50 dark:from-zinc-900/50 dark:to-zinc-800/90 dark:ring-white/10 sm:rounded-3xl"
    >
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-5 sm:p-5">
        <div className="flex min-w-0 flex-1 items-start gap-3.5">
          <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lime-500/10 text-lime-700 ring-1 ring-lime-500/15 dark:bg-lime-400/10 dark:text-lime-300 dark:ring-lime-400/15">
            <CloudIcon className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[10px] font-medium tracking-[0.18em] text-zinc-400 dark:text-zinc-500">
              DOWNLOAD
            </p>
            <h4 className="mt-0.5 text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-lg">
              {value.title}
            </h4>
            {meta.length > 0 || updatedLabel ? (
              <p className="mt-1 font-mono text-[11px] tabular-nums text-zinc-500 dark:text-zinc-400">
                {[
                  ...meta,
                  updatedLabel ? `更新 ${updatedLabel}` : null,
                ]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
            ) : null}
            {value.note ? (
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {value.note}
                <ElegantTooltip
                  content={copied === 'note' ? '已复制' : '复制备注'}
                >
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
            {active.checksum ? (
              <div className="mt-2.5 flex max-w-md items-start gap-2 overflow-hidden rounded-lg bg-zinc-950/95 px-2.5 py-1.5 font-mono text-[10px] leading-relaxed text-lime-400/90">
                <span className="shrink-0 text-zinc-500">sha</span>
                <code className="min-w-0 flex-1 break-all">
                  {active.checksum}
                </code>
                <ElegantTooltip
                  content={copied === 'sha' ? '已复制' : '复制校验和'}
                >
                  <button
                    type="button"
                    className="shrink-0 text-zinc-500 transition hover:text-lime-300"
                    onClick={() => copyText(active.checksum!, 'sha')}
                    aria-label="复制校验和"
                  >
                    {copied === 'sha' ? (
                      <ClipboardCheckIcon className="h-3.5 w-3.5" />
                    ) : (
                      <ClipboardDataIcon className="h-3.5 w-3.5" />
                    )}
                  </button>
                </ElegantTooltip>
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-stretch gap-2.5 sm:items-end">
          {useChips ? (
            <div
              role="listbox"
              aria-label="选择版本"
              className="inline-flex max-w-full flex-wrap justify-start gap-1 rounded-full bg-zinc-100/80 p-1 ring-1 ring-zinc-900/5 dark:bg-zinc-950/60 dark:ring-white/10 sm:justify-end"
            >
              {files.map((file, idx) => {
                const activeChip = idx === safeIndex
                return (
                  <button
                    key={file._key || `${file.url}-${idx}`}
                    type="button"
                    role="option"
                    aria-selected={activeChip}
                    onClick={() => setSelected(idx)}
                    className={clsxm(
                      'rounded-full px-3 py-1 text-xs font-medium transition',
                      activeChip
                        ? 'bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-900/5 dark:bg-zinc-200 dark:text-zinc-900 dark:ring-0'
                        : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
                    )}
                  >
                    {fileLabel(file, idx, files.length)}
                  </button>
                )
              })}
            </div>
          ) : multi ? (
            <label className="relative inline-flex w-full max-w-[13.5rem] sm:w-auto">
              <span className="sr-only">选择版本</span>
              <select
                value={safeIndex}
                onChange={(e) => setSelected(Number(e.target.value))}
                className="w-full cursor-pointer appearance-none rounded-full border-0 bg-zinc-100/80 py-2 pl-3.5 pr-8 text-xs font-medium text-zinc-800 outline-none ring-1 ring-zinc-900/5 transition focus:ring-2 focus:ring-lime-500/25 dark:bg-zinc-950/60 dark:text-zinc-100 dark:ring-white/10 dark:focus:ring-lime-400/20"
              >
                {files.map((file, idx) => (
                  <option key={file._key || `${file.url}-${idx}`} value={idx}>
                    {fileLabel(file, idx, files.length)}
                  </option>
                ))}
              </select>
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-zinc-400"
              >
                <svg
                  viewBox="0 0 12 12"
                  className="h-3 w-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M2.5 4.5 6 8l3.5-3.5" strokeLinecap="round" />
                </svg>
              </span>
            </label>
          ) : null}

          <a
            href={active.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-100 outline-offset-2 transition hover:bg-zinc-700 active:bg-zinc-800 active:text-zinc-100/70 dark:bg-zinc-200 dark:text-black dark:hover:bg-zinc-300 dark:active:bg-zinc-300/70"
          >
            前往下载
            <ExternalLinkIcon className="h-3.5 w-3.5 opacity-80" />
          </a>
        </div>
      </div>

      <p className="border-t border-zinc-100/80 px-4 py-2 text-[11px] leading-relaxed text-zinc-400 dark:border-zinc-700/50 dark:text-zinc-500 sm:px-5">
        资源由第三方网盘提供，本站不托管安装包。请自行核验来源与完整性。
      </p>
    </aside>
  )
}

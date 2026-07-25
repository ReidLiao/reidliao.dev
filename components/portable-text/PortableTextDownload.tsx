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

type DownloadFile = {
  _key?: string
  label?: string
  url: string
  version?: string
  platform?: string
  size?: string
  checksum?: string
  releasedAt?: string
  deprecated?: boolean
}

type DownloadValue = {
  _key: string
  title: string
  extractCode?: string
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

/** Prefer exact platform (non-deprecated) match, then「通用」, else first non-deprecated, else first. */
function pickInitialIndex(files: DownloadFile[]): number {
  if (files.length <= 1) return 0
  const platform = detectClientPlatform()
  const exactFresh = platform
    ? files.findIndex((f) => f.platform === platform && !f.deprecated)
    : -1
  if (exactFresh >= 0) return exactFresh
  const exactAny = platform
    ? files.findIndex((f) => f.platform === platform)
    : -1
  if (exactAny >= 0) return exactAny
  const anyFresh = files.findIndex(
    (f) => (!f.platform || f.platform === 'any') && !f.deprecated
  )
  if (anyFresh >= 0) return anyFresh
  const firstFresh = files.findIndex((f) => !f.deprecated)
  return firstFresh >= 0 ? firstFresh : 0
}

function formatVersion(version?: string) {
  if (!version) return null
  return `v${version.replace(/^v/i, '')}`
}

/**
 * Select labels stay short:
 * - multi-platform → macOS / Windows（同平台多项时带版本）
 * - same platform → v2.0 / v1.1
 */
function fileLabel(file: DownloadFile, files: DownloadFile[], idx: number) {
  const ver = formatVersion(file.version)
  const platKey = file.platform || 'any'
  const plat =
    platKey !== 'any' ? platformLabel[platKey] ?? file.platform : null

  const uniquePlatforms = new Set(files.map((f) => f.platform || 'any'))
  const multiPlatform = uniquePlatforms.size > 1
  const samePlatformCount = files.filter(
    (f) => (f.platform || 'any') === platKey
  ).length

  let base: string
  if (multiPlatform && plat) {
    base = samePlatformCount > 1 && ver ? `${plat} ${ver}` : plat
  } else if (ver) {
    base = ver
  } else if (plat) {
    base = plat
  } else {
    base = `版本 ${idx + 1}`
  }

  return file.deprecated ? `${base} · 旧版` : base
}

function fileMeta(
  file: DownloadFile,
  files: DownloadFile[],
  opts?: { hidePlatform?: boolean }
) {
  const items: string[] = []
  const ver = formatVersion(file.version)
  const platKey = file.platform || 'any'
  const plat =
    platKey !== 'any' ? platformLabel[platKey] ?? file.platform : null
  const uniquePlatforms = new Set(files.map((f) => f.platform || 'any'))
  const multiPlatform = uniquePlatforms.size > 1

  if (multiPlatform) {
    if (ver) items.push(ver)
  } else if (plat && !opts?.hidePlatform) {
    items.push(plat)
  } else if (ver) {
    items.push(ver)
  }
  if (file.size) items.push(file.size.replace(/^大小[：:]\s*/, ''))
  return items
}

function formatUpdatedAt(iso: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso)
  if (!m) return iso
  return `${m[1]}-${m[2]}-${m[3]}`
}

/** Short label used inside an <optgroup>; platform is implicit from the group heading. */
function fileShortLabel(file: DownloadFile) {
  const ver = formatVersion(file.version)
  const base = ver ?? '下载'
  return file.deprecated ? `${base} · 旧版` : base
}

type FileGroup = {
  key: string
  label: string
  items: { idx: number; file: DownloadFile }[]
}

function groupFilesByPlatform(files: DownloadFile[]): FileGroup[] {
  const order: string[] = []
  const map = new Map<string, { idx: number; file: DownloadFile }[]>()
  files.forEach((file, idx) => {
    const key = file.platform || 'any'
    if (!map.has(key)) {
      map.set(key, [])
      order.push(key)
    }
    map.get(key)!.push({ idx, file })
  })
  return order.map((key) => ({
    key,
    label: platformLabel[key] ?? key,
    items: map.get(key)!,
  }))
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
  const multi = files.length > 1
  const meta = active
    ? fileMeta(active, files, { hidePlatform: !multi })
    : []
  const dateInfo: { label: string; prefix: string } | null = active?.releasedAt
    ? { label: formatUpdatedAt(active.releasedAt), prefix: '发布' }
    : value.updatedAt
      ? { label: formatUpdatedAt(value.updatedAt), prefix: '更新' }
      : null
  const singleBadge = active ? fileLabel(active, files, 0) : null
  const groups = React.useMemo(() => groupFilesByPlatform(files), [files])
  const useOptgroups = groups.length > 1

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
            <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1">
              <h4 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-lg">
                {value.title}
              </h4>
              {active.deprecated ? (
                <span className="inline-flex items-center rounded-full bg-amber-500/10 px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-amber-700 ring-1 ring-amber-500/20 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/20">
                  旧版
                </span>
              ) : null}
            </div>
            {meta.length > 0 || dateInfo ? (
              <p className="mt-1 font-mono text-[11px] tabular-nums text-zinc-500 dark:text-zinc-400">
                {[
                  ...meta,
                  dateInfo ? `${dateInfo.prefix} ${dateInfo.label}` : null,
                ]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
            ) : null}
            {value.extractCode ? (
              <div className="mt-2.5 inline-flex max-w-full items-center gap-2 rounded-full bg-zinc-100/90 py-1 pl-3 pr-1.5 ring-1 ring-zinc-900/5 dark:bg-zinc-950/70 dark:ring-white/10">
                <span className="font-mono text-[10px] tracking-wider text-zinc-400 dark:text-zinc-500">
                  提取码
                </span>
                <code className="font-mono text-sm font-semibold tracking-wide text-zinc-900 dark:text-zinc-100">
                  {value.extractCode}
                </code>
                <ElegantTooltip
                  content={copied === 'code' ? '已复制' : '复制提取码'}
                >
                  <button
                    type="button"
                    className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-zinc-500 transition hover:bg-white hover:text-lime-600 dark:hover:bg-zinc-800 dark:hover:text-lime-400"
                    onClick={() => copyText(value.extractCode!, 'code')}
                    aria-label="复制提取码"
                  >
                    {copied === 'code' ? (
                      <ClipboardCheckIcon className="h-3.5 w-3.5" />
                    ) : (
                      <ClipboardDataIcon className="h-3.5 w-3.5" />
                    )}
                  </button>
                </ElegantTooltip>
              </div>
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

        <div className="flex w-full shrink-0 flex-row items-center gap-2.5 sm:w-auto sm:flex-col sm:items-end">
          {multi ? (
            <label className="relative min-w-0 flex-1 sm:w-auto sm:max-w-[11rem] sm:flex-none">
              <span className="sr-only">选择平台</span>
              <select
                value={safeIndex}
                onChange={(e) => setSelected(Number(e.target.value))}
                className="h-10 w-full min-w-0 cursor-pointer appearance-none rounded-full border-0 bg-zinc-100/90 py-0 pl-3.5 pr-8 text-xs font-medium text-zinc-800 outline-none ring-1 ring-zinc-900/5 transition focus:ring-2 focus:ring-lime-500/25 dark:bg-zinc-950/70 dark:text-zinc-100 dark:ring-white/10 dark:focus:ring-lime-400/20 sm:min-w-[7.5rem]"
              >
                {useOptgroups
                  ? groups.map((group) => (
                      <optgroup key={group.key} label={group.label}>
                        {group.items.map(({ idx, file }) => (
                          <option
                            key={file._key || `${file.url}-${idx}`}
                            value={idx}
                          >
                            {fileShortLabel(file)}
                          </option>
                        ))}
                      </optgroup>
                    ))
                  : files.map((file, idx) => (
                      <option
                        key={file._key || `${file.url}-${idx}`}
                        value={idx}
                      >
                        {fileLabel(file, files, idx)}
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
          ) : singleBadge ? (
            <span className="inline-flex h-10 shrink-0 items-center rounded-full bg-zinc-100/90 px-3.5 text-xs font-medium text-zinc-600 ring-1 ring-zinc-900/5 dark:bg-zinc-950/70 dark:text-zinc-300 dark:ring-white/10">
              {singleBadge}
            </span>
          ) : null}

          <a
            href={active.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-zinc-800 px-4 text-sm font-semibold text-zinc-100 outline-offset-2 transition hover:bg-zinc-700 active:bg-zinc-800 active:text-zinc-100/70 dark:bg-zinc-200 dark:text-black dark:hover:bg-zinc-300 dark:active:bg-zinc-300/70 sm:px-5"
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

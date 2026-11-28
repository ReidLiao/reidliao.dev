'use client'

import React from 'react'

import {
  ClipboardCheckIcon,
  ClipboardDataIcon,
  ExternalLinkIcon,
} from '~/assets'
import { Badge } from '~/components/shadcn/badge'
import { Button } from '~/components/shadcn/button'
import { Card } from '~/components/shadcn/card'
import { Select } from '~/components/shadcn/select'
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
  arch?: string
  language?: string
  size?: string
  checksum?: string
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
  arch?: string
  language?: string
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
        arch: value.arch,
        language: value.language,
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

function formatVersion(version?: string) {
  if (!version) return null
  const text = version.trim()
  if (!text) return null
  // Only numeric versions get a `v` prefix, e.g. 2.0 -> v2.0, v2.0 stays v2.0.
  // Names/editions stay as-is, otherwise "Windows XP | Professional"
  // would wrongly render as "vWindows XP | Professional".
  if (/^v\d/i.test(text)) return text
  if (/^\d+(\.\d+)*([-.+][0-9A-Za-z.-]+)?$/.test(text)) return `v${text}`
  return text
}

function checksumLabel(checksum: string) {
  const hex = checksum.trim()
  if (/^[0-9a-fA-F]{64}$/.test(hex)) return 'SHA-256'
  if (/^[0-9a-fA-F]{40}$/.test(hex)) return 'SHA-1'
  if (/^[0-9a-fA-F]{32}$/.test(hex)) return 'MD5'
  return '校验和'
}

/**
 * Select labels stay short:
 * - multi-platform → macOS / Windows（同平台多项时带版本）
 * - same platform → v2.0 / v1.1（平台只在来源行里，不在下拉里重复）
 * - single file → v2.0 / version label (used as the badge)
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

  if (multiPlatform && plat) {
    if (samePlatformCount > 1 && ver) return `${plat} ${ver}`
    return plat
  }
  // Same platform: platform is already in the source line, so the
  // dropdown shows only the version — repeating it here (e.g.
  // "macOS v27.0.3-586" next to a source line that already says macOS)
  // is redundant.
  if (ver) return ver
  if (plat) return plat
  return `版本 ${idx + 1}`
}

function fileMeta(
  file: DownloadFile,
  files: DownloadFile[],
  opts?: { hidePlatform?: boolean; hideVersion?: boolean }
) {
  const items: string[] = []
  const ver = formatVersion(file.version)
  const platKey = file.platform || 'any'
  const plat =
    platKey !== 'any' ? platformLabel[platKey] ?? file.platform : null
  const uniquePlatforms = new Set(files.map((f) => f.platform || 'any'))
  const multiPlatform = uniquePlatforms.size > 1

  if (multiPlatform) {
    if (ver && !opts?.hideVersion) items.push(ver)
  } else if (plat && !opts?.hidePlatform) {
    items.push(plat)
  } else if (ver && !opts?.hideVersion) {
    items.push(ver)
  }
  if (file.arch) items.push(file.arch)
  if (file.language) items.push(file.language)
  if (file.size) items.push(file.size.replace(/^大小[：:]\s*/, ''))
  return items
}

function formatUpdatedAt(iso: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso)
  if (!m) return iso
  return `${m[1]}-${m[2]}-${m[3]}`
}

function sourceLabel(url: string) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '')
    if (host.includes('pan.baidu.com') || host === 'baidu.com') return '百度网盘'
    if (host.includes('aliyundrive.com') || host.includes('alipan.com')) return '阿里云盘'
    if (host.includes('pan.quark.cn')) return '夸克网盘'
    if (host.includes('123pan')) return '123 云盘'
    if (host.includes('cloud.189.cn')) return '天翼云盘'
    return host
  } catch {
    return ''
  }
}

export function PortableTextDownload({
  value,
}: { value: DownloadValue }) {
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
  // Single file on desktop: the version/edition is already shown as the
  // right-side badge, so don't repeat it in the source line.
  const meta = active
    ? fileMeta(active, files, { hidePlatform: !multi, hideVersion: !multi })
    : []
  // Mobile has no badge (see below), so the mobile source line keeps
  // the version instead of dropping it.
  const metaMobile = active
    ? fileMeta(active, files, { hidePlatform: !multi, hideVersion: false })
    : []
  const updatedLabel = value.updatedAt
    ? formatUpdatedAt(value.updatedAt)
    : null
  const singleBadge = active ? fileLabel(active, files, 0) : null
  const source = active ? sourceLabel(active.url) : ''

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
    <Card
      as="aside"
      data-blockid={value._key}
      className="not-prose group/download my-8 overflow-hidden rounded-2xl border-zinc-200/80 bg-gradient-to-b from-zinc-50/50 to-white/90 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:border-zinc-700/50 dark:from-zinc-900/50 dark:to-zinc-800/90 dark:ring-white/10 sm:rounded-3xl"
    >
      <div className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:gap-4 sm:p-4">
        <div className="min-w-0 flex-1">
            <p className="font-mono text-[10px] font-medium tracking-[0.18em] text-zinc-600 dark:text-zinc-400">
              下载
            </p>
            <h4 className="mt-0.5 text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-lg">
              {value.title}
            </h4>
            {metaMobile.length > 0 || updatedLabel || source ? (
              <p className="mt-1 block font-mono text-[11px] tabular-nums text-zinc-500 dark:text-zinc-400 sm:hidden">
                {[
                  source ? `来源 ${source}` : null,
                  ...metaMobile,
                  updatedLabel ? `更新 ${updatedLabel}` : null,
                ]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
            ) : null}
            {meta.length > 0 || updatedLabel || source ? (
              <p className="mt-1 hidden font-mono text-[11px] tabular-nums text-zinc-500 dark:text-zinc-400 sm:block">
                {[
                  source ? `来源 ${source}` : null,
                  ...meta,
                  updatedLabel ? `更新 ${updatedLabel}` : null,
                ]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
            ) : null}
            {value.extractCode ? (
              <div className="mt-2.5 inline-flex max-w-full items-center gap-2 rounded-full bg-zinc-100/90 py-1 pl-3 pr-1.5 ring-1 ring-zinc-900/5 dark:bg-zinc-950/70 dark:ring-white/10">
                <span className="font-mono text-[10px] tracking-wider text-zinc-600 dark:text-zinc-400">
                  提取码
                </span>
                <code className="font-mono text-sm font-semibold tracking-wide text-zinc-900 dark:text-zinc-100">
                  {value.extractCode}
                </code>
                <ElegantTooltip
                  content={copied === 'code' ? '已复制' : '复制提取码'}
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="-my-1 -mr-1 h-10 w-10 shrink-0 rounded-full text-zinc-500 hover:bg-white hover:text-emerald-700 dark:hover:bg-zinc-800 dark:hover:text-emerald-400"
                    onClick={() => copyText(value.extractCode, 'code')}
                    aria-label="复制提取码"
                  >
                    {copied === 'code' ? (
                      <ClipboardCheckIcon className="h-3.5 w-3.5" />
                    ) : (
                      <ClipboardDataIcon className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </ElegantTooltip>
              </div>
            ) : null}
            {value.note ? (
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {value.note}
                <ElegantTooltip
                  content={copied === 'note' ? '已复制' : '复制备注'}
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="-my-1 ml-0 h-8 w-8 translate-y-0.5 text-zinc-600 hover:text-emerald-700 dark:text-zinc-400 dark:hover:text-emerald-400"
                    onClick={() => copyText(value.note, 'note')}
                    aria-label="复制备注"
                  >
                    {copied === 'note' ? (
                      <ClipboardCheckIcon className="h-3.5 w-3.5" />
                    ) : (
                      <ClipboardDataIcon className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </ElegantTooltip>
              </p>
            ) : null}
            {active.checksum ? (
              <div className="mt-2.5 max-w-md overflow-hidden rounded-lg bg-zinc-950/95 px-2.5 py-1.5 font-mono text-[10px] leading-relaxed text-emerald-400/90">
                <div className="flex items-center justify-between gap-2">
                  <span className="shrink-0 text-zinc-500">
                    {checksumLabel(active.checksum)}
                  </span>
                  <ElegantTooltip
                    content={copied === 'sha' ? '已复制' : '复制校验和'}
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="-my-1 -mr-1 h-10 w-10 shrink-0 text-zinc-500 hover:text-emerald-700 dark:hover:text-emerald-400"
                      onClick={() => copyText(active.checksum, 'sha')}
                      aria-label="复制校验和"
                    >
                      {copied === 'sha' ? (
                        <ClipboardCheckIcon className="h-3.5 w-3.5" />
                      ) : (
                        <ClipboardDataIcon className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </ElegantTooltip>
                </div>
                <code className="mt-1 block break-all">
                  {active.checksum}
                </code>
              </div>
            ) : null}
        </div>

        <div className="flex w-full shrink-0 flex-col items-stretch gap-2.5 sm:w-auto sm:items-end">
          {multi ? (
            <label className="relative min-w-0 w-full flex-none sm:w-auto sm:max-w-[18rem]">
              <span className="sr-only">选择下载文件</span>
              <Select
                value={safeIndex}
                onChange={(e) => setSelected(Number(e.target.value))}
                className="min-w-0 cursor-pointer truncate border-emerald-700/60 bg-emerald-700/10 text-emerald-700 dark:border-emerald-400/50 dark:bg-emerald-400/10 dark:text-emerald-400 sm:min-w-[7.5rem]"
              >
                {files.map((file, idx) => (
                  <option key={file._key || `${file.url}-${idx}`} value={idx}>
                    {fileLabel(file, files, idx)}
                  </option>
                ))}
              </Select>
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-emerald-700 dark:text-emerald-400"
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
            <Badge variant="outline" className="hidden h-10 max-w-full shrink-0 self-end truncate border-emerald-700/60 px-3.5 text-xs text-emerald-700 dark:border-emerald-400/50 dark:text-emerald-400 sm:inline-flex">
              {singleBadge}
            </Badge>
          ) : null}

          <a
            href={active.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 w-full shrink-0 items-center justify-center gap-2 rounded-full bg-emerald-700 px-4 text-sm font-semibold text-white outline-offset-2 transition hover:bg-emerald-800 active:bg-emerald-900 active:text-white/80 dark:bg-emerald-400 dark:text-zinc-950 dark:hover:bg-emerald-300 dark:active:bg-emerald-400 sm:w-auto sm:px-5"
          >
            前往下载
            <ExternalLinkIcon className="h-3.5 w-3.5 opacity-80" />
          </a>
        </div>
      </div>

      <p className="border-t border-zinc-100/80 px-4 py-2 text-[11px] leading-relaxed text-zinc-600 dark:border-zinc-700/50 dark:text-zinc-400 sm:px-5">
        资源由第三方网盘提供，本站不托管安装包。请自行核验来源与完整性。
      </p>
    </Card>
  )
}

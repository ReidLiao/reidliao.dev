'use client'

import React from 'react'

import { AtomIcon } from '~/assets'

const RSS_URL = 'https://reidliao.dev/rss.xml'

export function RssCopyLink() {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(RSS_URL)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      type="button"
      aria-label={copied ? 'RSS 链接已复制' : '复制 RSS 订阅链接'}
      className="group inline-flex items-center gap-1.5 text-sm font-medium text-zinc-600 transition hover:text-lime-600 dark:text-zinc-400 dark:hover:text-lime-400"
      onClick={handleCopy}
    >
      <AtomIcon
        aria-hidden="true"
        className="h-5 w-5 text-zinc-500 transition group-hover:text-lime-600 dark:text-zinc-400 dark:group-hover:text-lime-400"
      />
      <span>RSS 订阅</span>
      {copied && (
        <span
          aria-live="polite"
          className="text-xs font-normal text-lime-600 dark:text-lime-400"
        >
          链接已复制
        </span>
      )}
    </button>
  )
}

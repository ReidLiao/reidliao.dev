'use client'

import React from 'react'

const fieldClass = 'mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-lime-600 focus:ring-2 focus:ring-lime-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-lime-400'

export function FriendLinkApplicationForm() {
  const [message, setMessage] = React.useState('')
  const [status, setStatus] = React.useState<'idle' | 'success' | 'error'>('idle')
  const [pending, setPending] = React.useState(false)

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())
    setPending(true)
    setMessage('')
    try {
      const response = await fetch('/api/friend-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = (await response.json()) as { message?: string }
      if (!response.ok) throw new Error(result.message ?? '暂时无法提交，请稍后重试。')
      setStatus('success')
      setMessage(result.message ?? '申请已送达，审核通过后会显示在这里。')
      form.reset()
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : '网络暂时不可用，请稍后重试。')
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={submit} className="mt-5 space-y-4">
      <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">站名
        <input name="siteName" required maxLength={80} autoComplete="organization" className={fieldClass} />
      </label>
      <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">网站链接
        <input name="url" type="url" required maxLength={2048} placeholder="https://" className={fieldClass} />
      </label>
      <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">简介
        <textarea name="description" required maxLength={240} rows={3} className={fieldClass} />
      </label>
      <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">联系邮箱
        <input name="email" type="email" required maxLength={254} autoComplete="email" className={fieldClass} />
      </label>
      <label aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
        请留空此项
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <button type="submit" disabled={pending} className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-lime-400 px-5 text-sm font-semibold text-zinc-950 transition hover:bg-lime-300 disabled:cursor-wait disabled:opacity-60">
        {pending ? '正在提交…' : '提交申请'}
      </button>
      <p role="status" aria-live="polite" className={`min-h-5 text-sm ${status === 'success' ? 'text-lime-700 dark:text-lime-300' : status === 'error' ? 'text-rose-700 dark:text-rose-300' : 'text-zinc-500 dark:text-zinc-400'}`}>
        {message}
      </p>
    </form>
  )
}

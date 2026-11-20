'use client'

import React from 'react'

const fieldClass = 'mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-lime-600 focus:ring-2 focus:ring-lime-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-lime-400 dark:focus:ring-lime-400/20'

export function SubmitRecommendationForm() {
  const [status, setStatus] = React.useState<{
    kind: 'success' | 'error' | 'limited' | 'idle'
    message: string
  }>({ kind: 'idle', message: '' })
  const [pending, setPending] = React.useState(false)

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formElement = event.currentTarget
    setPending(true)
    setStatus({ kind: 'idle', message: '' })
    const form = new FormData(formElement)
    const payload = Object.fromEntries(form.entries())
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = (await response.json()) as { status?: string; message?: string }
      if (response.ok && result.status === 'success') {
        setStatus({ kind: 'success', message: result.message ?? '投稿已送达，感谢推荐！' })
        formElement.reset()
      } else if (response.status === 429) {
        setStatus({ kind: 'limited', message: result.message ?? '每小时最多提交 3 次，请稍后再试。' })
      } else {
        setStatus({ kind: 'error', message: result.message ?? '提交失败，请检查内容后重试。' })
      }
    } catch {
      setStatus({ kind: 'error', message: '网络暂时不可用，请稍后再试。' })
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={submit} className="mt-0 w-full max-w-none rounded-3xl border border-zinc-200 bg-white/70 p-5 shadow-sm shadow-zinc-900/5 dark:border-zinc-800 dark:bg-zinc-900/60 sm:p-8">
      <fieldset className="grid gap-6" disabled={pending}>
        <legend className="sr-only">投稿内容</legend>
        <fieldset>
          <legend className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
            类型 <span className="text-rose-600" aria-hidden="true">*</span>
            <span className="sr-only">必填</span>
          </legend>
          <div className="mt-2 flex flex-wrap gap-3">
            {['软件', '资源'].map((type, index) => (
              <label key={type} className="relative inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-zinc-300 bg-white px-5 text-sm text-zinc-700 transition after:absolute after:inset-x-0 after:-inset-y-0.5 after:content-[''] has-[:checked]:border-lime-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:has-[:checked]:border-lime-400">
                <input type="radio" name="type" value={type} defaultChecked={index === 0} required className="accent-lime-600" />
                {type}
              </label>
            ))}
          </div>
        </fieldset>
        <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
          名称 <span className="text-rose-600" aria-label="必填">*</span>
          <input name="name" required maxLength={100} className={fieldClass} placeholder="软件或资源名称" />
        </label>
        <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
          一句话介绍 <span className="text-rose-600" aria-label="必填">*</span>
          <textarea name="introduction" required maxLength={300} rows={3} className={fieldClass} placeholder="它解决什么问题，或有什么值得推荐的地方？" />
        </label>
        <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
          官网或下载链接 <span className="text-rose-600" aria-label="必填">*</span>
          <input name="url" required type="url" maxLength={2048} className={fieldClass} placeholder="https://" />
        </label>
        <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
          投稿人昵称 <span className="text-rose-600" aria-label="必填">*</span>
          <input name="nickname" required maxLength={80} className={fieldClass} placeholder="怎么称呼你？" />
        </label>
        <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
          邮箱（选填）
          <input name="email" type="email" maxLength={254} autoComplete="email" className={fieldClass} placeholder="仅用于核实或通知，不会公开" />
        </label>
        <label aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
          留空此项
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
        <div className="flex flex-col gap-3">
          <button type="submit" className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-black px-6 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-wait disabled:opacity-60 dark:bg-black dark:hover:bg-zinc-800">
            {pending ? '正在提交…' : '提交推荐'}
          </button>
          <p role="status" aria-live="polite" className={`text-sm ${status.kind === 'success' ? 'text-lime-700 dark:text-lime-300' : status.kind === 'idle' ? 'text-zinc-500 dark:text-zinc-400' : 'text-rose-700 dark:text-rose-300'}`}>
            {status.message}
          </p>
        </div>
      </fieldset>
    </form>
  )
}

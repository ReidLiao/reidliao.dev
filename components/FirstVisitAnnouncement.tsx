'use client'

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Announcement = {
  enabled?: boolean
  version?: string
  title?: string
  body?: string
  buttonText?: string
  buttonLink?: string
  imageUrl?: string
}

export function FirstVisitAnnouncement({ announcement }: { announcement?: Announcement | null }) {
  const [open, setOpen] = React.useState(false)
  const dialogRef = React.useRef<HTMLElement>(null)
  const closeButtonRef = React.useRef<HTMLButtonElement>(null)
  const previousFocusRef = React.useRef<HTMLElement | null>(null)
  const hasCapturedFocusRef = React.useRef(false)

  const close = React.useCallback(() => {
    setOpen(false)
    if (announcement?.version) {
      try { window.localStorage.setItem('site-announcement-version', announcement.version) } catch { /* ignore */ }
    }
  }, [announcement?.version])

  React.useEffect(() => {
    if (!announcement?.enabled || !announcement.version || !announcement.title) return
    try {
      if (window.localStorage.getItem('site-announcement-version') !== announcement.version) {
        setOpen(true)
      }
    } catch {
      // Storage may be disabled; the notice still remains dismissible for this visit.
      setOpen(true)
    }
  }, [announcement?.enabled, announcement?.version, announcement?.title])

  React.useEffect(() => {
    if (!open) return
    if (!hasCapturedFocusRef.current) {
      previousFocusRef.current = document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
      hasCapturedFocusRef.current = true
    }
    closeButtonRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
        return
      }
      if (event.key !== 'Tab' || !dialogRef.current) return

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => element.getClientRects().length > 0)
      if (focusable.length === 0) {
        event.preventDefault()
        dialogRef.current.focus()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const focusIsOutsideDialog = !dialogRef.current.contains(document.activeElement)
      if (focusIsOutsideDialog) {
        event.preventDefault()
        const edgeTarget = event.shiftKey ? last : first
        edgeTarget.focus()
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, close])

  React.useEffect(() => {
    if (open || !hasCapturedFocusRef.current) return
    if (previousFocusRef.current?.isConnected) previousFocusRef.current.focus()
    previousFocusRef.current = null
    hasCapturedFocusRef.current = false
  }, [open])

  if (!open || !announcement?.title) return null
  const buttonLink = announcement.buttonLink || ''
  const external = /^https?:\/\//i.test(buttonLink)

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/65 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) close() }}>
      <section ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="site-announcement-title" className="relative max-h-[calc(100dvh-2rem)] w-full max-w-xl overflow-y-auto rounded-3xl border border-zinc-700 bg-zinc-900 text-zinc-100 shadow-2xl shadow-black/40">
        <button ref={closeButtonRef} type="button" onClick={close} aria-label="关闭公告" className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-zinc-950/70 text-zinc-300 transition hover:border-lime-400/60 hover:text-lime-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" /></svg>
        </button>
        {announcement.imageUrl ? <div className="relative aspect-video w-full"><Image src={announcement.imageUrl} alt="" fill sizes="(max-width: 640px) 100vw, 560px" className="object-cover" /></div> : null}
        <div className="p-6 sm:p-8">
          <span className="mb-3 inline-flex items-center gap-2 font-mono text-xs text-zinc-400"><span className="size-1.5 rounded-full bg-lime-400" />站点公告</span>
          <h2 id="site-announcement-title" className="text-xl font-semibold tracking-tight sm:text-2xl">{announcement.title}</h2>
          {announcement.body ? <p className="mt-4 whitespace-pre-line text-sm leading-7 text-zinc-300">{announcement.body}</p> : null}
          {buttonLink && announcement.buttonText ? (external ? <a href={buttonLink} target="_blank" rel="noreferrer noopener" onClick={close} className="mt-6 inline-flex h-10 items-center justify-center rounded-full bg-lime-400 px-5 text-sm font-semibold text-zinc-950 transition hover:bg-lime-300">{announcement.buttonText}</a> : <Link href={buttonLink} onClick={close} className="mt-6 inline-flex h-10 items-center justify-center rounded-full bg-lime-400 px-5 text-sm font-semibold text-zinc-950 transition hover:bg-lime-300">{announcement.buttonText}</Link>) : null}
        </div>
      </section>
    </div>
  )
}

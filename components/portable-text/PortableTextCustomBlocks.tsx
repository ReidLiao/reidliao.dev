'use client'

import type { PortableTextComponentProps } from '@portabletext/react'
import React from 'react'

type AccordionItem = { _key?: string; title?: string; body?: string; date?: string; description?: string }
type Value = { _key: string; title?: string; body?: string; icon?: string; tone?: string; items?: AccordionItem[]; headers?: string[]; rows?: { cells?: string[] }[]; caption?: string; text?: string; href?: string; style?: string; isPromotion?: boolean }
const toneStyles: Record<string, string> = {
  lime: 'border-lime-500/40 bg-lime-500/10 text-lime-950 dark:text-lime-100',
  amber: 'border-amber-500/40 bg-amber-500/10 text-amber-950 dark:text-amber-100',
  rose: 'border-rose-500/40 bg-rose-500/10 text-rose-950 dark:text-rose-100',
  sky: 'border-sky-500/40 bg-sky-500/10 text-sky-950 dark:text-sky-100',
  zinc: 'border-zinc-300 bg-zinc-100 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100',
}

export function PortableTextAccordion({ value }: PortableTextComponentProps<Value>) {
  const [open, setOpen] = React.useState<number | null>(null)
  return <div className="not-prose my-8 space-y-2">{value.items?.map((item, index) => <section key={item._key ?? index} className="overflow-hidden rounded-xl border border-zinc-300 bg-zinc-100 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100">
    <h3><button type="button" aria-expanded={open === index} onClick={() => setOpen(open === index ? null : index)} className="flex min-h-12 w-full items-center justify-between gap-4 px-4 py-3 text-left font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime-500"><span>{item.title}</span><span aria-hidden="true" className="text-lime-700 dark:text-lime-400">{open === index ? '−' : '+'}</span></button></h3>
    {open === index ? <div className="border-t border-zinc-300 px-4 py-4 text-sm leading-relaxed text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">{item.body}</div> : null}
  </section>)}</div>
}

export function PortableTextCallout({ value }: PortableTextComponentProps<Value>) {
  const icon = value.icon === 'stop' ? '×' : value.icon === 'alert' ? '!' : value.icon === 'note' ? 'N' : 'i'
  return <aside className={`not-prose my-8 rounded-xl border p-4 sm:p-5 ${toneStyles[value.tone ?? 'lime'] ?? toneStyles.lime}`}><h3 className="flex items-center gap-2 font-semibold"><span aria-hidden="true" className="text-lg">{icon}</span>{value.title}</h3><p className="mt-2 whitespace-pre-line text-sm leading-relaxed">{value.body}</p></aside>
}

export function PortableTextTable({ value }: PortableTextComponentProps<Value>) {
  return <div className="not-prose my-8 overflow-x-auto rounded-xl border border-zinc-300 dark:border-zinc-700"><table className="w-full min-w-max border-collapse text-left text-sm"><caption className="px-4 py-2 text-left text-xs text-zinc-500">{value.caption}</caption><thead className="bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"><tr>{value.headers?.map((header, i) => <th key={i} scope="col" className="border-b border-zinc-300 px-4 py-3 font-semibold dark:border-zinc-700">{header}</th>)}</tr></thead><tbody>{value.rows?.map((row, i) => <tr key={i} className="odd:bg-white/60 even:bg-zinc-50 dark:odd:bg-zinc-900/60 dark:even:bg-zinc-800/40">{value.headers?.map((_, j) => <td key={j} className="border-b border-zinc-200 px-4 py-3 text-zinc-700 dark:border-zinc-800 dark:text-zinc-300">{row.cells?.[j] ?? ''}</td>)}</tr>)}</tbody></table></div>
}

export function PortableTextTimeline({ value }: PortableTextComponentProps<Value>) {
  return <ol className="not-prose my-8 space-y-0">{value.items?.map((item, i) => <li key={item._key ?? i} className="relative border-l border-lime-500/50 pb-6 pl-6 last:border-transparent last:pb-0"><span aria-hidden="true" className="absolute -left-1.5 top-1 h-3 w-3 rounded-full border-2 border-lime-600 bg-white dark:border-lime-400 dark:bg-zinc-900"/><time className="font-mono text-xs text-zinc-500 dark:text-zinc-400">{item.date}</time><h3 className="mt-1 font-semibold text-zinc-900 dark:text-zinc-100">{item.title}</h3><p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{item.description}</p></li>)}</ol>
}

export function PortableTextLinkButton({ value }: PortableTextComponentProps<Value>) {
  const external = /^https?:\/\//i.test(value.href ?? '')
  return <div className="not-prose my-8 text-center"><a href={value.href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} className={`inline-flex min-h-12 w-full items-center justify-center rounded-xl px-6 py-3 text-center text-sm font-semibold transition sm:w-auto ${value.style === 'secondary' ? 'border border-zinc-400 bg-white text-zinc-900 hover:bg-zinc-100 dark:border-zinc-500 dark:bg-zinc-100 dark:hover:bg-white' : 'bg-lime-400 text-zinc-950 hover:bg-lime-300'}`}>{value.text}</a>{value.isPromotion ? <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">推广链接：通过此链接购买价格不变，我会获得少量佣金。</p> : null}</div>
}

'use client'

import Image from 'next/image'
import QRCode from 'qrcode'
import React from 'react'

import { ClipboardCheckIcon } from '~/assets'

type DonationAddressProps = {
  currency: string
  network: string
  address: string
  note?: string
}

export function DonationAddress({
  currency,
  network,
  address,
  note,
}: DonationAddressProps) {
  const [qrCode, setQrCode] = React.useState('')
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    let active = true

    QRCode.toDataURL(address, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 192,
      color: {
        dark: '#000212',
        light: '#ffffff',
      },
    })
      .then((dataUrl) => {
        if (active) setQrCode(dataUrl)
      })
      .catch(() => undefined)

    return () => {
      active = false
    }
  }, [address])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <article className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              {currency}
            </h2>
            <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
              {network}
            </span>
            {note ? (
              <span className="rounded-full bg-lime-500/10 px-2 py-0.5 text-[11px] font-medium text-lime-700 ring-1 ring-lime-500/20 dark:bg-lime-400/10 dark:text-lime-300 dark:ring-lime-400/20">
                {note}
              </span>
            ) : null}
          </div>
          <p className="mt-4 break-all font-mono text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
            {address}
          </p>
          <button
            type="button"
            onClick={handleCopy}
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-2.5 py-1.5 text-xs font-medium text-zinc-600 transition hover:border-lime-500/40 hover:text-lime-600 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-lime-400/40 dark:hover:text-lime-400"
            aria-label={`复制 ${currency} 捐赠地址`}
          >
            <ClipboardCheckIcon className="h-3.5 w-3.5" />
            {copied ? '地址已复制' : '复制地址'}
          </button>
          {currency === 'USDT' ? (
            <p className="mt-4 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
              请按 TRON（TRC20）网络转账，选错网络资产将丢失。
            </p>
          ) : null}
        </div>

        <div className="flex h-48 w-48 shrink-0 items-center justify-center rounded-xl bg-white p-3 ring-1 ring-zinc-900/5 dark:ring-white/10">
          {qrCode ? (
            <Image
              src={qrCode}
              alt={`${currency} ${network} 捐赠地址二维码`}
              width={192}
              height={192}
              className="h-full w-full"
              unoptimized
            />
          ) : null}
        </div>
      </div>
    </article>
  )
}

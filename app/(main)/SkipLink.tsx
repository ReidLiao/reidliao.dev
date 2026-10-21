'use client'

import React from 'react'

const visibleClasses =
  'focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-[110] focus-visible:rounded-full focus-visible:bg-lime-400 focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-offset-zinc-900'

export function SkipLink() {
  const [tabNavigation, setTabNavigation] = React.useState(false)

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') setTabNavigation(true)
    }
    const resetVisibility = () => setTabNavigation(false)

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('pointerdown', resetVisibility)
    window.addEventListener('pageshow', resetVisibility)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('pointerdown', resetVisibility)
      window.removeEventListener('pageshow', resetVisibility)
    }
  }, [])

  return (
    <a
      href="#main-content"
      onBlur={() => setTabNavigation(false)}
      className={`sr-only ${tabNavigation ? visibleClasses : 'focus-visible:outline-none focus-visible:shadow-none'}`}
    >
      跳到主内容
    </a>
  )
}

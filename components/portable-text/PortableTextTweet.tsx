'use client'

import dynamic from 'next/dynamic'
import React from 'react'

const Tweet = dynamic(() => import('react-tweet').then((module) => module.Tweet), {
  ssr: false,
})

export function PortableTextTweet({
  value,
}: { value: { id: string | undefined } }) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [shouldLoad, setShouldLoad] = React.useState(false)

  React.useEffect(() => {
    const container = containerRef.current
    if (!container) return

    if (!('IntersectionObserver' in window)) {
      setShouldLoad(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setShouldLoad(true)
        observer.disconnect()
      },
      { rootMargin: '300px 0px' }
    )
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="flex min-h-[320px] justify-center">
      {shouldLoad && typeof value.id === 'string' ? <Tweet id={value.id} /> : null}
    </div>
  )
}

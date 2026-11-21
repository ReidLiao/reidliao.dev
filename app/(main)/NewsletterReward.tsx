'use client'

import React from 'react'
import { emoji, useReward } from 'react-rewards'

export default function NewsletterReward() {
  const rewardsRef = React.useRef<HTMLSpanElement>(null)
  const { reward } = useReward(rewardsRef, emoji, {
    emojis: ['📬', '✉️', '🎉', '🥳', '😊', '🤓'],
    count: 32,
  })

  React.useEffect(() => {
    reward()
  }, [reward])

  return <span ref={rewardsRef} className="relative h-0 w-0" aria-hidden />
}

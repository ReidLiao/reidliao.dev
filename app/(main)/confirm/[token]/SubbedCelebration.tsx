'use client'

import React from 'react'
import { confetti, useReward } from 'react-rewards'

export function SubbedCelebration() {
  const rewardsRef = React.useRef<HTMLDivElement>(null)
  const { reward } = useReward(rewardsRef, confetti, {
    angle: 90,
    velocity: 32,
    count: 120,
    spread: 90,
    size: 8,
    lifetime: 320,
  })

  React.useEffect(() => {
    const timer = setTimeout(() => reward(), 400)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div ref={rewardsRef} className="pb-16" aria-hidden />

}

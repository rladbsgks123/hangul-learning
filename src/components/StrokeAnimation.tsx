import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import type { StrokePath } from '@/data/types'

type StrokeAnimationProps = {
  strokes: StrokePath[]
  playToken: number
  className?: string
}

export function StrokeAnimation({ strokes, playToken, className }: StrokeAnimationProps) {
  const [visibleCount, setVisibleCount] = useState(strokes.length)

  useEffect(() => {
    setVisibleCount(0)
    const timers = strokes.map((_, i) =>
      setTimeout(() => setVisibleCount((c) => Math.max(c, i + 1)), i * 650)
    )
    return () => timers.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playToken, strokes.length])

  return (
    <svg viewBox="0 0 100 100" className={className}>
      {strokes.map((stroke, i) => (
        <motion.path
          key={i}
          d={stroke.d}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth={7}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={i < visibleCount ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 0.55, ease: 'easeInOut' }}
        />
      ))}
    </svg>
  )
}

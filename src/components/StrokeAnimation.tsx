import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import type { StrokePath } from '@/data/types'

type StrokeAnimationProps = {
  strokes: StrokePath[]
  playToken: number
  className?: string
}

// 시작 전 잠깐의 정지(0획 상태를 눈으로 확인) → 한 획씩 그려짐 → 다음 획 전 잠깐 멈춤
export const STROKE_START_DELAY = 400
export const STROKE_INTERVAL = 850
export const STROKE_DRAW_DURATION = 0.65

export function getStrokeAnimationDuration(strokeCount: number) {
  return STROKE_START_DELAY + Math.max(strokeCount - 1, 0) * STROKE_INTERVAL + STROKE_DRAW_DURATION * 1000
}

export function StrokeAnimation({ strokes, playToken, className }: StrokeAnimationProps) {
  const [visibleCount, setVisibleCount] = useState(0)
  const [resetKey, setResetKey] = useState(0)

  useEffect(() => {
    // resetKey를 바꿔 <path>를 새로 마운트시켜, 이전 재생분이 거꾸로 지워지는
    // 애니메이션 없이 즉시 0획(빈 상태)에서 다시 시작하도록 한다.
    setVisibleCount(0)
    setResetKey((k) => k + 1)

    const timers = strokes.map((_, i) =>
      setTimeout(
        () => setVisibleCount((c) => Math.max(c, i + 1)),
        STROKE_START_DELAY + i * STROKE_INTERVAL
      )
    )
    return () => timers.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playToken, strokes])

  return (
    <svg viewBox="0 0 100 100" className={className}>
      {strokes.slice(0, visibleCount).map((stroke, i) => (
        <motion.path
          key={`${resetKey}-${i}`}
          d={stroke.d}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth={7}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: STROKE_DRAW_DURATION, ease: 'easeInOut' }}
        />
      ))}
    </svg>
  )
}

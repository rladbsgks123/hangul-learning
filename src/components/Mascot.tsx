import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

type MascotProps = {
  level: number
  size?: 'sm' | 'md' | 'lg'
  message?: string
  bounce?: boolean
}

function faceForLevel(level: number) {
  if (level >= 5) return '🐯'
  if (level >= 4) return '🦁'
  if (level >= 3) return '🐶'
  if (level >= 2) return '🐣'
  return '🐥'
}

function accessoryForLevel(level: number) {
  if (level >= 5) return '👑'
  if (level >= 3) return '🎀'
  return null
}

const sizeMap = {
  sm: 'text-4xl',
  md: 'text-6xl',
  lg: 'text-8xl',
}

export function Mascot({ level, size = 'md', message, bounce = true }: MascotProps) {
  const accessory = accessoryForLevel(level)
  return (
    <div className="flex flex-col items-center gap-2">
      <motion.div
        className="relative inline-block"
        animate={bounce ? { y: [0, -10, 0] } : undefined}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className={cn(sizeMap[size])}>{faceForLevel(level)}</span>
        {accessory && (
          <span className="absolute -top-3 -right-1 text-2xl">{accessory}</span>
        )}
      </motion.div>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-white px-4 py-2 text-sm font-bold text-foreground shadow-md border"
        >
          {message}
        </motion.div>
      )}
    </div>
  )
}

import { motion } from 'motion/react'
import type { Letter } from '@/data/types'
import { cn } from '@/lib/utils'

const PALETTE = [
  'from-rose-400 to-pink-500',
  'from-orange-400 to-amber-500',
  'from-yellow-400 to-lime-500',
  'from-emerald-400 to-teal-500',
  'from-cyan-400 to-sky-500',
  'from-blue-400 to-indigo-500',
  'from-violet-400 to-purple-500',
  'from-fuchsia-400 to-pink-500',
]

type LetterCardProps = {
  letter: Letter
  index: number
  learned?: boolean
  onClick: () => void
}

export function LetterCard({ letter, index, learned, onClick }: LetterCardProps) {
  const gradient = PALETTE[index % PALETTE.length]

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.08, rotate: -2 }}
      whileTap={{ scale: 0.92, rotate: 2 }}
      className={cn(
        'relative flex aspect-square flex-col items-center justify-center rounded-2xl bg-gradient-to-br p-2 text-white shadow-lg',
        gradient
      )}
    >
      {learned && (
        <span className="absolute -top-2 -right-2 rounded-full bg-white text-lg shadow">
          ⭐
        </span>
      )}
      <span className="text-4xl font-black drop-shadow-sm sm:text-5xl">{letter.char}</span>
      <span className="text-xs font-semibold opacity-90 sm:text-sm">{letter.romanization}</span>
    </motion.button>
  )
}

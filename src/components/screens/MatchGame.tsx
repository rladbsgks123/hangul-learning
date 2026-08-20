import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Button } from '@/components/ui/button'
import { playCorrect, playWrong } from '@/lib/sound'
import { speak } from '@/lib/tts'
import type { Letter } from '@/data/types'

type MatchGameProps = {
  pool: Letter[]
  onAnswer: (correct: boolean) => void
}

type Card = {
  key: string
  char: string
  display: string
  pairId: string
  matched: boolean
}

const PAIR_COUNT = 6

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function buildBoard(pool: Letter[]): Card[] {
  const chosen = shuffle(pool).slice(0, Math.min(PAIR_COUNT, pool.length))
  const cards: Card[] = []
  chosen.forEach((letter) => {
    cards.push({ key: `${letter.char}-letter`, char: letter.char, display: letter.char, pairId: letter.char, matched: false })
    cards.push({ key: `${letter.char}-emoji`, char: letter.char, display: letter.emoji, pairId: letter.char, matched: false })
  })
  return shuffle(cards)
}

export function MatchGame({ pool, onAnswer }: MatchGameProps) {
  const [boardSeed, setBoardSeed] = useState(0)
  const cards = useMemo(() => buildBoard(pool), [pool, boardSeed])
  const [flipped, setFlipped] = useState<string[]>([])
  const [matched, setMatched] = useState<Set<string>>(new Set())
  const [wrongPair, setWrongPair] = useState<string[]>([])
  const [busy, setBusy] = useState(false)

  const allMatched = matched.size === cards.length && cards.length > 0

  function handleFlip(card: Card) {
    if (busy || flipped.includes(card.key) || matched.has(card.key)) return
    if (card.display === card.char) speak(card.char)

    const nextFlipped = [...flipped, card.key]
    setFlipped(nextFlipped)

    if (nextFlipped.length === 2) {
      setBusy(true)
      const [firstKey, secondKey] = nextFlipped
      const first = cards.find((c) => c.key === firstKey)!
      const second = cards.find((c) => c.key === secondKey)!

      setTimeout(() => {
        if (first.pairId === second.pairId) {
          setMatched((prev) => new Set(prev).add(first.key).add(second.key))
          playCorrect()
          onAnswer(true)
        } else {
          setWrongPair([first.key, second.key])
          playWrong()
          onAnswer(false)
          setTimeout(() => setWrongPair([]), 500)
        }
        setFlipped([])
        setBusy(false)
      }, 600)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-center text-sm font-semibold text-muted-foreground">
        같은 글자와 그림 카드를 찾아 짝을 맞춰보세요!
      </p>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-4">
        {cards.map((card) => {
          const isFlipped = flipped.includes(card.key) || matched.has(card.key)
          const isWrong = wrongPair.includes(card.key)
          return (
            <motion.button
              key={card.key}
              onClick={() => handleFlip(card)}
              animate={isWrong ? { x: [0, -6, 6, -6, 0] } : {}}
              className="relative h-16 w-16 [perspective:600px] sm:h-20 sm:w-20"
            >
              <motion.div
                className="relative h-full w-full rounded-xl shadow-md [transform-style:preserve-3d]"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 to-fuchsia-500 text-2xl text-white [backface-visibility:hidden]">
                  ❓
                </div>
                <div
                  className="absolute inset-0 flex items-center justify-center rounded-xl bg-white text-3xl [backface-visibility:hidden]"
                  style={{ transform: 'rotateY(180deg)' }}
                >
                  {card.display}
                </div>
              </motion.div>
              {matched.has(card.key) && (
                <span className="absolute -top-2 -right-2 text-lg">✅</span>
              )}
            </motion.button>
          )
        })}
      </div>

      <AnimatePresence>
        {allMatched && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-3 rounded-xl bg-accent p-4"
          >
            <p className="font-black text-accent-foreground">🎉 모두 맞췄어요! 최고!</p>
            <Button onClick={() => setBoardSeed((s) => s + 1)}>다시 하기</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

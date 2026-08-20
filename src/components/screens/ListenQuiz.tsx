import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Button } from '@/components/ui/button'
import { speak } from '@/lib/tts'
import { playCorrect, playWrong } from '@/lib/sound'
import type { Letter } from '@/data/types'

type ListenQuizProps = {
  pool: Letter[]
  onAnswer: (correct: boolean) => void
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function buildQuestion(pool: Letter[]) {
  const shuffled = shuffle(pool)
  const answer = shuffled[0]
  const options = shuffle(shuffled.slice(0, 4))
  return { answer, options }
}

export function ListenQuiz({ pool, onAnswer }: ListenQuizProps) {
  const [question, setQuestion] = useState(() => buildQuestion(pool))
  const [selected, setSelected] = useState<string | null>(null)
  const [score, setScore] = useState({ correct: 0, total: 0 })

  useEffect(() => {
    const timer = setTimeout(() => speak(question.answer.char), 300)
    return () => clearTimeout(timer)
  }, [question])

  function handleSelect(char: string) {
    if (selected) return
    setSelected(char)
    const isCorrect = char === question.answer.char
    setScore((s) => ({ correct: s.correct + (isCorrect ? 1 : 0), total: s.total + 1 }))
    if (isCorrect) playCorrect()
    else playWrong()
    onAnswer(isCorrect)

    setTimeout(() => {
      setSelected(null)
      setQuestion(buildQuestion(pool))
    }, 1100)
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <p className="text-sm font-semibold text-muted-foreground">
        점수: {score.correct} / {score.total}
      </p>

      <Button size="lg" onClick={() => speak(question.answer.char)} className="text-lg">
        🔊 소리 다시 듣기
      </Button>

      <div className="grid w-full max-w-sm grid-cols-2 gap-3">
        <AnimatePresence mode="wait">
          {question.options.map((opt) => {
            const isSelected = selected === opt.char
            const isAnswer = opt.char === question.answer.char
            const showFeedback = selected !== null && (isSelected || isAnswer)
            return (
              <motion.button
                key={`${question.answer.char}-${opt.char}`}
                onClick={() => handleSelect(opt.char)}
                whileHover={{ scale: selected ? 1 : 1.05 }}
                whileTap={{ scale: selected ? 1 : 0.95 }}
                animate={
                  showFeedback && isSelected && !isAnswer
                    ? { x: [0, -6, 6, -6, 0] }
                    : showFeedback && isAnswer
                      ? { scale: [1, 1.15, 1] }
                      : {}
                }
                className={`flex aspect-square flex-col items-center justify-center rounded-2xl border-4 text-5xl font-black shadow-md transition-colors ${
                  showFeedback && isAnswer
                    ? 'border-emerald-400 bg-emerald-50 text-emerald-600'
                    : showFeedback && isSelected
                      ? 'border-rose-400 bg-rose-50 text-rose-500'
                      : 'border-transparent bg-white text-primary'
                }`}
              >
                {opt.char}
              </motion.button>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}

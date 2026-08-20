import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { consonants } from '@/data/consonants'
import { vowels } from '@/data/vowels'
import { StrokeAnimation, getStrokeAnimationDuration } from '@/components/StrokeAnimation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { speak } from '@/lib/tts'
import { playCorrect } from '@/lib/sound'
import type { Letter } from '@/data/types'

type LearnScreenProps = {
  initialLetter: Letter | null
  isLearned: (char: string) => boolean
  onLearn: (char: string) => void
}

const ALL_LETTERS = [...consonants, ...vowels]

export function LearnScreen({ initialLetter, isLearned, onLearn }: LearnScreenProps) {
  const [index, setIndex] = useState(() => {
    if (!initialLetter) return 0
    return ALL_LETTERS.findIndex((l) => l.char === initialLetter.char)
  })
  const [playToken, setPlayToken] = useState(0)

  const letter = ALL_LETTERS[index]
  const learned = isLearned(letter.char)

  const totalStrokeDelay = useMemo(
    () => getStrokeAnimationDuration(letter.strokes.length),
    [letter]
  )

  function goTo(newIndex: number) {
    const clamped = (newIndex + ALL_LETTERS.length) % ALL_LETTERS.length
    setIndex(clamped)
    setPlayToken((t) => t + 1)
  }

  function handleLearnClick() {
    onLearn(letter.char)
    playCorrect()
  }

  return (
    <div className="flex flex-col items-center gap-5 px-4 pt-6 pb-4">
      <div className="flex w-full items-center justify-between">
        <Button variant="outline" size="icon" onClick={() => goTo(index - 1)}>
          ◀
        </Button>
        <span className="text-sm font-bold text-muted-foreground">
          {index + 1} / {ALL_LETTERS.length}
        </span>
        <Button variant="outline" size="icon" onClick={() => goTo(index + 1)}>
          ▶
        </Button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={letter.char}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-sm"
        >
          <Card className="border-2">
            <CardContent className="flex flex-col items-center gap-4">
              <div className="flex w-full items-center justify-center gap-6">
                <span className="text-8xl font-black text-primary">{letter.char}</span>
                <StrokeAnimation
                  strokes={letter.strokes}
                  playToken={playToken}
                  className="h-28 w-28"
                />
              </div>

              <Button
                variant="secondary"
                onClick={() => setPlayToken((t) => t + 1)}
              >
                ✍️ 획순 다시보기
              </Button>

              <div className="flex items-center gap-3 rounded-xl bg-muted px-4 py-3">
                <span className="text-4xl">{letter.emoji}</span>
                <div className="text-left">
                  <p className="font-bold text-foreground">{letter.word}</p>
                  <p className="text-xs text-muted-foreground">{letter.wordRomanization}</p>
                </div>
              </div>

              <div className="flex w-full gap-2">
                <Button
                  className="flex-1"
                  onClick={() => speak(letter.char)}
                >
                  🔊 글자 소리
                </Button>
                <Button
                  className="flex-1"
                  variant="outline"
                  onClick={() => speak(letter.word)}
                >
                  🔊 단어 소리
                </Button>
              </div>

              <Button
                size="lg"
                className="w-full"
                disabled={learned}
                onClick={handleLearnClick}
              >
                {learned ? '⭐ 다 배웠어요!' : '이 글자 다 배웠어요!'}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
      <p className="text-xs text-muted-foreground">
        획순 애니메이션 시간: 약 {(totalStrokeDelay / 1000).toFixed(1)}초
      </p>
    </div>
  )
}

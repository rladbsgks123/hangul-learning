import { useState } from 'react'
import { motion } from 'motion/react'
import { consonants } from '@/data/consonants'
import { vowels } from '@/data/vowels'
import { Button } from '@/components/ui/button'
import { MatchGame } from '@/components/screens/MatchGame'
import { ListenQuiz } from '@/components/screens/ListenQuiz'

type GameScreenProps = {
  onAnswer: (correct: boolean) => void
}

type GameMode = 'menu' | 'match' | 'listen'

const ALL_LETTERS = [...consonants, ...vowels]

export function GameScreen({ onAnswer }: GameScreenProps) {
  const [mode, setMode] = useState<GameMode>('menu')

  if (mode === 'menu') {
    return (
      <div className="flex flex-col items-center gap-6 px-4 pt-10">
        <h1 className="text-2xl font-black text-foreground">🎮 게임을 골라봐요!</h1>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setMode('match')}
          className="flex w-full max-w-sm flex-col items-center gap-2 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-500 p-6 text-white shadow-lg"
        >
          <span className="text-5xl">🖼️</span>
          <span className="text-lg font-black">그림-글자 짝맞추기</span>
          <span className="text-sm opacity-90">카드를 뒤집어 짝을 찾아요</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setMode('listen')}
          className="flex w-full max-w-sm flex-col items-center gap-2 rounded-2xl bg-gradient-to-br from-orange-400 to-rose-500 p-6 text-white shadow-lg"
        >
          <span className="text-5xl">👂</span>
          <span className="text-lg font-black">소리 듣고 글자 고르기</span>
          <span className="text-sm opacity-90">소리를 듣고 알맞은 글자를 찾아요</span>
        </motion.button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 px-4 pt-6 pb-4">
      <Button variant="ghost" className="self-start" onClick={() => setMode('menu')}>
        ← 게임 목록으로
      </Button>
      {mode === 'match' && <MatchGame pool={ALL_LETTERS} onAnswer={onAnswer} />}
      {mode === 'listen' && <ListenQuiz pool={ALL_LETTERS} onAnswer={onAnswer} />}
    </div>
  )
}

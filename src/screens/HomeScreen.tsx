import { useEffect, useRef } from 'react'
import { consonants } from '@/data/consonants'
import { vowels } from '@/data/vowels'
import { LetterCard } from '@/components/LetterCard'
import { Mascot } from '@/components/Mascot'
import { Separator } from '@/components/ui/separator'
import { speak } from '@/lib/tts'
import type { Letter } from '@/data/types'

type HomeScreenProps = {
  level: number
  learnedLetters: string[]
  onSelectLetter: (letter: Letter) => void
}

export function HomeScreen({ level, learnedLetters, onSelectLetter }: HomeScreenProps) {
  const greeted = useRef(false)

  useEffect(() => {
    if (greeted.current) return
    greeted.current = true
    const timer = setTimeout(() => speak('안녕! 나랑 같이 한글을 배워보자!'), 400)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex flex-col gap-6 px-4 pt-6 pb-4">
      <div className="flex flex-col items-center gap-2">
        <Mascot level={level} size="lg" message="안녕! 같이 한글 배우자! 🎉" />
        <h1 className="text-2xl font-black text-foreground">한글 놀이터</h1>
        <p className="text-sm text-muted-foreground">글자를 눌러서 배워봐요!</p>
      </div>

      <section>
        <h2 className="mb-3 text-lg font-extrabold text-foreground">🔤 자음 (14자)</h2>
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
          {consonants.map((letter, i) => (
            <LetterCard
              key={letter.char}
              letter={letter}
              index={i}
              learned={learnedLetters.includes(letter.char)}
              onClick={() => onSelectLetter(letter)}
            />
          ))}
        </div>
      </section>

      <Separator />

      <section>
        <h2 className="mb-3 text-lg font-extrabold text-foreground">🔡 모음 (10자)</h2>
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
          {vowels.map((letter, i) => (
            <LetterCard
              key={letter.char}
              letter={letter}
              index={i + 3}
              learned={learnedLetters.includes(letter.char)}
              onClick={() => onSelectLetter(letter)}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

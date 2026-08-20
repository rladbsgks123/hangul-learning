import { useState } from 'react'
import { HomeScreen } from '@/screens/HomeScreen'
import { LearnScreen } from '@/screens/LearnScreen'
import { GameScreen } from '@/screens/GameScreen'
import { ProgressScreen } from '@/screens/ProgressScreen'
import { NavBar } from '@/components/NavBar'
import { useProgress } from '@/hooks/useProgress'
import type { Letter } from '@/data/types'

export type Screen = 'home' | 'learn' | 'game' | 'progress'

function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null)
  const { state, stats, learnLetter, answerQuiz, isLearned } = useProgress()

  function handleSelectLetter(letter: Letter) {
    setSelectedLetter(letter)
    setScreen('learn')
  }

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-2xl flex-col bg-background">
      <main className="flex-1 overflow-y-auto">
        {screen === 'home' && (
          <HomeScreen
            level={stats.level}
            learnedLetters={state.learnedLetters}
            onSelectLetter={handleSelectLetter}
          />
        )}
        {screen === 'learn' && (
          <LearnScreen
            initialLetter={selectedLetter}
            isLearned={isLearned}
            onLearn={learnLetter}
          />
        )}
        {screen === 'game' && <GameScreen onAnswer={answerQuiz} />}
        {screen === 'progress' && <ProgressScreen state={state} stats={stats} />}
      </main>
      <NavBar active={screen} onNavigate={setScreen} />
    </div>
  )
}

export default App

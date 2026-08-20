import { useCallback, useEffect, useState } from 'react'
import {
  loadProgress,
  saveProgress,
  markLetterLearned,
  recordQuizAnswer,
  getStats,
  levelFromXp,
  type ProgressState,
} from '@/lib/progress'
import { playLevelUp } from '@/lib/sound'

export function useProgress() {
  const [state, setState] = useState<ProgressState>(() => loadProgress())

  useEffect(() => {
    saveProgress(state)
  }, [state])

  const learnLetter = useCallback((char: string) => {
    setState((prev) => {
      const prevLevel = levelFromXp(prev.xp)
      const next = markLetterLearned(prev, char)
      if (levelFromXp(next.xp) > prevLevel) playLevelUp()
      return next
    })
  }, [])

  const answerQuiz = useCallback((correct: boolean) => {
    setState((prev) => {
      const prevLevel = levelFromXp(prev.xp)
      const next = recordQuizAnswer(prev, correct)
      if (levelFromXp(next.xp) > prevLevel) playLevelUp()
      return next
    })
  }, [])

  const isLearned = useCallback((char: string) => state.learnedLetters.includes(char), [state])

  return {
    state,
    stats: getStats(state),
    learnLetter,
    answerQuiz,
    isLearned,
  }
}

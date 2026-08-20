import { consonants } from '@/data/consonants'
import { vowels } from '@/data/vowels'
import { stickerDefs } from '@/data/stickers'

const STORAGE_KEY = 'hangul-progress'
const XP_PER_LETTER = 10
const XP_PER_CORRECT_ANSWER = 5
const XP_PER_LEVEL = 100

export type ProgressState = {
  learnedLetters: string[]
  quizCorrect: number
  quizTotal: number
  currentStreak: number
  bestStreak: number
  xp: number
  stickers: string[]
}

function defaultState(): ProgressState {
  return {
    learnedLetters: [],
    quizCorrect: 0,
    quizTotal: 0,
    currentStreak: 0,
    bestStreak: 0,
    xp: 0,
    stickers: [],
  }
}

export function loadProgress(): ProgressState {
  if (typeof window === 'undefined') return defaultState()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    const parsed = JSON.parse(raw)
    return { ...defaultState(), ...parsed }
  } catch {
    return defaultState()
  }
}

export function saveProgress(state: ProgressState) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function levelFromXp(xp: number) {
  return Math.floor(xp / XP_PER_LEVEL) + 1
}

export function xpIntoLevel(xp: number) {
  return xp % XP_PER_LEVEL
}

export function getStats(state: ProgressState) {
  const consonantChars = new Set(consonants.map((c) => c.char))
  const vowelChars = new Set(vowels.map((v) => v.char))
  const consonantsLearned = state.learnedLetters.filter((l) => consonantChars.has(l)).length
  const vowelsLearned = state.learnedLetters.filter((l) => vowelChars.has(l)).length
  const level = levelFromXp(state.xp)
  return {
    learnedCount: state.learnedLetters.length,
    consonantsLearned,
    vowelsLearned,
    quizCorrect: state.quizCorrect,
    quizTotal: state.quizTotal,
    bestStreak: state.bestStreak,
    level,
    xpIntoLevel: xpIntoLevel(state.xp),
    xpForNextLevel: XP_PER_LEVEL,
  }
}

export function computeNewStickers(state: ProgressState): string[] {
  const stats = getStats(state)
  const earned = stickerDefs.filter((s) => s.isEarned(stats)).map((s) => s.id)
  return earned.filter((id) => !state.stickers.includes(id))
}

export function markLetterLearned(state: ProgressState, char: string): ProgressState {
  if (state.learnedLetters.includes(char)) return state
  const next: ProgressState = {
    ...state,
    learnedLetters: [...state.learnedLetters, char],
    xp: state.xp + XP_PER_LETTER,
  }
  const newStickers = computeNewStickers(next)
  return { ...next, stickers: [...next.stickers, ...newStickers] }
}

export function recordQuizAnswer(state: ProgressState, correct: boolean): ProgressState {
  const currentStreak = correct ? state.currentStreak + 1 : 0
  const next: ProgressState = {
    ...state,
    quizTotal: state.quizTotal + 1,
    quizCorrect: state.quizCorrect + (correct ? 1 : 0),
    currentStreak,
    bestStreak: Math.max(state.bestStreak, currentStreak),
    xp: state.xp + (correct ? XP_PER_CORRECT_ANSWER : 0),
  }
  const newStickers = computeNewStickers(next)
  return { ...next, stickers: [...next.stickers, ...newStickers] }
}

export { XP_PER_LEVEL }

export type StickerDef = {
  id: string
  name: string
  emoji: string
  description: string
  isEarned: (stats: {
    learnedCount: number
    consonantsLearned: number
    vowelsLearned: number
    quizCorrect: number
    bestStreak: number
    level: number
  }) => boolean
}

export const stickerDefs: StickerDef[] = [
  {
    id: 'first-letter',
    name: '첫 걸음',
    emoji: '🌟',
    description: '첫 글자를 배웠어요',
    isEarned: (s) => s.learnedCount >= 1,
  },
  {
    id: 'five-letters',
    name: '노력왕',
    emoji: '🔥',
    description: '글자를 5개 배웠어요',
    isEarned: (s) => s.learnedCount >= 5,
  },
  {
    id: 'all-consonants',
    name: '자음 마스터',
    emoji: '🏅',
    description: '자음 14개를 모두 배웠어요',
    isEarned: (s) => s.consonantsLearned >= 14,
  },
  {
    id: 'all-vowels',
    name: '모음 마스터',
    emoji: '🎖️',
    description: '모음 10개를 모두 배웠어요',
    isEarned: (s) => s.vowelsLearned >= 10,
  },
  {
    id: 'hangul-master',
    name: '한글 박사',
    emoji: '👑',
    description: '자음 모음 24개를 모두 배웠어요',
    isEarned: (s) => s.consonantsLearned >= 14 && s.vowelsLearned >= 10,
  },
  {
    id: 'quiz-ten',
    name: '퀴즈왕',
    emoji: '🎯',
    description: '퀴즈를 10문제 맞혔어요',
    isEarned: (s) => s.quizCorrect >= 10,
  },
  {
    id: 'streak-five',
    name: '연속 정답!',
    emoji: '⚡',
    description: '5문제 연속으로 맞혔어요',
    isEarned: (s) => s.bestStreak >= 5,
  },
  {
    id: 'level-three',
    name: '레벨 업!',
    emoji: '🚀',
    description: '레벨 3을 달성했어요',
    isEarned: (s) => s.level >= 3,
  },
  {
    id: 'level-five',
    name: '한글 챔피언',
    emoji: '🏆',
    description: '레벨 5를 달성했어요',
    isEarned: (s) => s.level >= 5,
  },
]

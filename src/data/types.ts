export type StrokePath = {
  // SVG path 'd' attribute for a single stroke, drawn in a 100x100 viewBox
  d: string
}

export type Letter = {
  char: string
  romanization: string
  category: 'consonant' | 'vowel'
  strokes: StrokePath[]
  word: string
  wordRomanization: string
  emoji: string
}

let voices: SpeechSynthesisVoice[] = []

function loadVoices() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  voices = window.speechSynthesis.getVoices()
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  loadVoices()
  window.speechSynthesis.onvoiceschanged = loadVoices
}

export function speak(text: string, rate = 0.85) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'ko-KR'
  utterance.rate = rate
  utterance.pitch = 1.15

  const koreanVoice = voices.find((v) => v.lang?.startsWith('ko'))
  if (koreanVoice) utterance.voice = koreanVoice

  window.speechSynthesis.speak(utterance)
}

export function isTtsSupported() {
  return typeof window !== 'undefined' && !!window.speechSynthesis
}

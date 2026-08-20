let audioCtx: AudioContext | null = null

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    const Ctor = window.AudioContext || (window as any).webkitAudioContext
    if (!Ctor) return null
    audioCtx = new Ctor()
  }
  return audioCtx
}

function tone(freq: number, startTime: number, duration: number, ctx: AudioContext, gainPeak = 0.2) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(freq, startTime)
  gain.gain.setValueAtTime(0, startTime)
  gain.gain.linearRampToValueAtTime(gainPeak, startTime + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(startTime)
  osc.stop(startTime + duration)
}

export function playCorrect() {
  const ctx = getCtx()
  if (!ctx) return
  const now = ctx.currentTime
  tone(523.25, now, 0.15, ctx)
  tone(659.25, now + 0.12, 0.15, ctx)
  tone(783.99, now + 0.24, 0.25, ctx)
}

export function playWrong() {
  const ctx = getCtx()
  if (!ctx) return
  const now = ctx.currentTime
  tone(220, now, 0.2, ctx, 0.15)
  tone(196, now + 0.15, 0.25, ctx, 0.15)
}

export function playClick() {
  const ctx = getCtx()
  if (!ctx) return
  tone(440, ctx.currentTime, 0.08, ctx, 0.12)
}

export function playLevelUp() {
  const ctx = getCtx()
  if (!ctx) return
  const now = ctx.currentTime
  ;[523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, now + i * 0.12, 0.2, ctx, 0.18))
}

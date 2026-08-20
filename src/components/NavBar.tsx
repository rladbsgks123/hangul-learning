import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { playClick } from '@/lib/sound'
import type { Screen } from '@/App'

const NAV_ITEMS: { id: Screen; label: string; emoji: string }[] = [
  { id: 'home', label: '홈', emoji: '🏠' },
  { id: 'learn', label: '학습', emoji: '📖' },
  { id: 'game', label: '게임', emoji: '🎮' },
  { id: 'progress', label: '진행현황', emoji: '📊' },
]

type NavBarProps = {
  active: Screen
  onNavigate: (screen: Screen) => void
}

export function NavBar({ active, onNavigate }: NavBarProps) {
  return (
    <nav className="sticky bottom-0 z-20 flex justify-around border-t bg-white/90 px-2 py-2 backdrop-blur">
      {NAV_ITEMS.map((item) => {
        const isActive = active === item.id
        return (
          <button
            key={item.id}
            onClick={() => {
              playClick()
              onNavigate(item.id)
            }}
            className="relative flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 text-xs font-bold"
          >
            {isActive && (
              <motion.div
                layoutId="nav-pill"
                className="absolute inset-0 rounded-xl bg-primary/15"
                transition={{ type: 'spring', duration: 0.4 }}
              />
            )}
            <span className={cn('relative text-2xl', isActive && 'scale-110')}>{item.emoji}</span>
            <span className={cn('relative', isActive ? 'text-primary' : 'text-muted-foreground')}>
              {item.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}

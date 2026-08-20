import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts'
import { Mascot } from '@/components/Mascot'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { stickerDefs } from '@/data/stickers'
import { cn } from '@/lib/utils'
import type { ProgressState } from '@/lib/progress'

type ProgressScreenProps = {
  state: ProgressState
  stats: {
    learnedCount: number
    consonantsLearned: number
    vowelsLearned: number
    quizCorrect: number
    quizTotal: number
    bestStreak: number
    level: number
    xpIntoLevel: number
    xpForNextLevel: number
  }
}

const BAR_COLORS = ['#38bdf8', '#fb923c']
const PIE_COLORS = ['#34d399', '#f87171']

export function ProgressScreen({ state, stats }: ProgressScreenProps) {
  const letterData = [
    { name: '자음', 배운글자: stats.consonantsLearned, 전체: 14 },
    { name: '모음', 배운글자: stats.vowelsLearned, 전체: 10 },
  ]

  const quizWrong = Math.max(stats.quizTotal - stats.quizCorrect, 0)
  const pieData =
    stats.quizTotal > 0
      ? [
          { name: '정답', value: stats.quizCorrect },
          { name: '오답', value: quizWrong },
        ]
      : [{ name: '아직 퀴즈 안 함', value: 1 }]

  return (
    <div className="flex flex-col gap-5 px-4 pt-6 pb-4">
      <div className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow border">
        <Mascot level={stats.level} size="md" bounce={false} />
        <div className="flex-1">
          <p className="text-lg font-black">레벨 {stats.level}</p>
          <Progress value={(stats.xpIntoLevel / stats.xpForNextLevel) * 100} className="h-3 mt-1" />
          <p className="mt-1 text-xs text-muted-foreground">
            {stats.xpIntoLevel} / {stats.xpForNextLevel} XP
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>글자 학습 진도</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={letterData}>
                <XAxis dataKey="name" tick={{ fontSize: 13, fontWeight: 700 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="배운글자" radius={[8, 8, 0, 0]}>
                  {letterData.map((_, i) => (
                    <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            자음 {stats.consonantsLearned}/14 · 모음 {stats.vowelsLearned}/10
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>퀴즈 정답률</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={4}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={stats.quizTotal > 0 ? PIE_COLORS[i % PIE_COLORS.length] : '#e5e7eb'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            총 {stats.quizTotal}문제 중 {stats.quizCorrect}개 정답 · 최고 연속 {stats.bestStreak}회
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>🏅 스티커 보상</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {stickerDefs.map((sticker) => {
              const earned = state.stickers.includes(sticker.id)
              return (
                <div
                  key={sticker.id}
                  className={cn(
                    'flex flex-col items-center gap-1 rounded-xl border p-3 text-center',
                    earned ? 'bg-accent/60 border-accent' : 'bg-muted/50 opacity-40 grayscale'
                  )}
                >
                  <span className="text-3xl">{sticker.emoji}</span>
                  <span className="text-xs font-bold">{sticker.name}</span>
                  <span className="text-[10px] text-muted-foreground">{sticker.description}</span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

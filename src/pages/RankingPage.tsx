import { motion } from 'framer-motion'
import { Card } from '../components/ui/Card'
import { Trophy } from 'lucide-react'
import { usePointsStore } from '../store/usePointsStore'

const DEMO_RANKING = [
  { name: 'Família Silva', child: 'Luísa', points: 420, level: 'Chef Ouro' },
  { name: 'Família Costa', child: 'Pedro', points: 310, level: 'Chef Prata' },
  { name: 'Família Souza', child: 'Ana', points: 280, level: 'Chef Prata' },
  { name: 'Família Lima', child: 'João', points: 195, level: 'Chef Bronze' },
  { name: 'Família Rocha', child: 'Bia', points: 140, level: 'Chef Bronze' },
]

const MEDALS = ['🥇', '🥈', '🥉']
const MEDAL_COLORS = ['bg-yellow-100 border-yellow-300', 'bg-gray-100 border-gray-300', 'bg-orange-50 border-orange-200']

export function RankingPage() {
  const { weekly_points, level } = usePointsStore()

  // Insert local user into ranking
  const myEntry = { name: 'Você', child: 'Chefinho', points: weekly_points, level }
  const allEntries = [...DEMO_RANKING, myEntry].sort((a, b) => b.points - a.points)
  const myRank = allEntries.findIndex(e => e.name === 'Você') + 1

  return (
    <div className="px-4 py-4 flex flex-col gap-4">
      <div>
        <h2 className="font-title font-bold text-xl text-gray-800">Ranking Familiar 🏆</h2>
        <p className="font-body text-sm text-gray-500">Pontuação semanal das famílias</p>
      </div>

      {/* My position */}
      <Card className="bg-gradient-to-r from-turquesa to-teal-400 border-0 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-body text-sm opacity-80">Sua posição esta semana</p>
            <p className="font-title font-bold text-3xl">#{myRank}</p>
            <p className="font-body text-sm opacity-90 mt-0.5">{weekly_points} pontos • {level}</p>
          </div>
          <Trophy size={48} className="opacity-30" />
        </div>
      </Card>

      {/* Top 3 podium */}
      <div className="flex items-end justify-center gap-3 py-2">
        {[1, 0, 2].map(pos => {
          const entry = allEntries[pos]
          if (!entry) return null
          const heights = [20, 28, 16]
          return (
            <motion.div key={pos} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: pos * 0.1 }}
              className="flex flex-col items-center gap-1">
              <span className="text-3xl">{MEDALS[pos]}</span>
              <p className="font-title font-bold text-xs text-gray-800 text-center">{entry.child}</p>
              <div className={`w-16 flex items-end justify-center rounded-t-xl border-2 ${MEDAL_COLORS[pos]}`}
                style={{ height: `${heights[pos] * 3}px` }}>
                <p className="font-title font-bold text-xs text-gray-600 pb-1">{entry.points}</p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Full ranking */}
      <div className="flex flex-col gap-2">
        {allEntries.map((entry, i) => {
          const isMe = entry.name === 'Você'
          return (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
              <Card padding="sm" className={isMe ? 'border-2 border-turquesa bg-turquesa/5' : ''}>
                <div className="flex items-center gap-3">
                  <span className="font-title font-bold text-lg w-6 text-center text-gray-400">
                    {i < 3 ? MEDALS[i] : `#${i + 1}`}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-verde flex items-center justify-center text-sm">
                    {entry.child[0]}
                  </div>
                  <div className="flex-1">
                    <p className="font-title font-semibold text-sm text-gray-800">{isMe ? 'Você' : entry.name}</p>
                    <p className="font-body text-xs text-gray-500">{entry.level}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-title font-bold text-gray-800">{entry.points}</p>
                    <p className="text-xs text-gray-400">pts</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <Card className="bg-amarelo border-0 text-center">
        <p className="font-title font-bold text-gray-800">Família Super Saudável da Semana</p>
        <p className="text-3xl mt-1">{allEntries[0]?.child} 🏆</p>
        <p className="font-body text-sm text-gray-600 mt-1">{allEntries[0]?.points} pontos • {allEntries[0]?.level}</p>
      </Card>
    </div>
  )
}

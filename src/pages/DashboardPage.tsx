import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { UtensilsCrossed, Map, Trophy, Lightbulb } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { ProgressBar } from '../components/ui/ProgressBar'
import { usePointsStore } from '../store/usePointsStore'
import { LEVEL_THRESHOLDS, type PlayerLevel } from '../types'

const TIPS = [
  'Ofereça frutas de cores diferentes hoje 🍓🥭🥝',
  'Inclua uma cor nova no prato do almoço 🌈',
  'Beba mais um copo de água agora! 💧',
  'Que tal um legume diferente no jantar hoje? 🥕',
  'Lanche saudável: fruta + proteína = combo perfeito! 🍎🥚',
]

const LEVEL_ORDER: PlayerLevel[] = ['Aprendiz', 'Chef Bronze', 'Chef Prata', 'Chef Ouro', 'Guardião do Reino Vita']

function getNextLevelPoints(current: PlayerLevel, total: number): { next: PlayerLevel | null; threshold: number; progress: number } {
  const idx = LEVEL_ORDER.indexOf(current)
  if (idx === LEVEL_ORDER.length - 1) return { next: null, threshold: total, progress: 100 }
  const next = LEVEL_ORDER[idx + 1]
  const threshold = LEVEL_THRESHOLDS[next]
  const prev = LEVEL_THRESHOLDS[current]
  return { next, threshold, progress: ((total - prev) / (threshold - prev)) * 100 }
}

export function DashboardPage() {
  const navigate = useNavigate()
  const { total_points, weekly_points, level } = usePointsStore()
  const tip = TIPS[Math.floor(Date.now() / 86400000) % TIPS.length]
  const { next, threshold, progress } = getNextLevelPoints(level, total_points)

  return (
    <div className="px-4 py-4 flex flex-col gap-4">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-title font-bold text-2xl text-gray-800">Olá, Chefinha! 🌟</h2>
        <p className="text-gray-500 text-sm mt-0.5">Escolha como quer começar hoje</p>
      </motion.div>

      {/* Level Card */}
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05 }}>
        <Card className="bg-gradient-to-br from-turquesa to-teal-400 text-white border-0">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm opacity-80 font-body">Nível atual</p>
              <h3 className="font-title font-bold text-lg">{level}</h3>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-80 font-body">Esta semana</p>
              <p className="font-title font-bold text-lg">{weekly_points} pts</p>
            </div>
          </div>
          {next && (
            <>
              <ProgressBar value={total_points - LEVEL_THRESHOLDS[level]} max={threshold - LEVEL_THRESHOLDS[level]} color="verde" />
              <p className="text-xs mt-1.5 opacity-80">Próximo: {next} (faltam {threshold - total_points} pts)</p>
            </>
          )}
          {!next && <p className="text-sm opacity-80">Nível máximo atingido! 👑</p>}
        </Card>
      </motion.div>

      {/* Mode Cards */}
      <div className="grid grid-cols-2 gap-3">
        <motion.button
          className="bg-white rounded-card shadow-sm border border-gray-100 p-4 flex flex-col items-center gap-2 text-center hover:shadow-md transition-shadow active:scale-95"
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/familia')}
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
        >
          <div className="w-12 h-12 bg-verde rounded-full flex items-center justify-center">
            <UtensilsCrossed size={24} className="text-gray-800" />
          </div>
          <div>
            <p className="font-title font-bold text-gray-800 text-sm">Modo Família</p>
            <p className="text-xs text-gray-500">Receitas e rotina</p>
          </div>
        </motion.button>

        <motion.button
          className="bg-white rounded-card shadow-sm border border-gray-100 p-4 flex flex-col items-center gap-2 text-center hover:shadow-md transition-shadow active:scale-95"
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/aventura/mapa')}
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
        >
          <div className="w-12 h-12 bg-coral rounded-full flex items-center justify-center">
            <Map size={24} className="text-white" />
          </div>
          <div>
            <p className="font-title font-bold text-gray-800 text-sm">Modo Aventura</p>
            <p className="text-xs text-gray-500">Chefinho GO!</p>
          </div>
        </motion.button>
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => navigate('/aventura/batalha')} className="bg-amarelo rounded-card p-3 flex items-center gap-2 active:scale-95 transition">
          <span className="text-xl">🃏</span>
          <span className="font-title font-semibold text-sm text-gray-800">Batalha de Pratos</span>
        </button>
        <button onClick={() => navigate('/ranking')} className="bg-white rounded-card border border-gray-100 p-3 flex items-center gap-2 active:scale-95 transition shadow-sm">
          <Trophy size={18} className="text-coral" />
          <span className="font-title font-semibold text-sm text-gray-800">Ranking</span>
        </button>
      </div>

      {/* Tip of the day */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <Card className="bg-amarelo border-0">
          <div className="flex gap-3 items-start">
            <Lightbulb size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-title font-semibold text-sm text-gray-800">Dica do dia</p>
              <p className="font-body text-sm text-gray-700 mt-0.5">{tip}</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: '🌟', label: 'Total', value: total_points },
          { icon: '📅', label: 'Semana', value: weekly_points },
          { icon: '🏆', label: 'Meta', value: `${Math.min(100, Math.round(progress))}%` },
        ].map(s => (
          <Card key={s.label} padding="sm" className="text-center">
            <p className="text-xl">{s.icon}</p>
            <p className="font-title font-bold text-gray-800 text-base">{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}

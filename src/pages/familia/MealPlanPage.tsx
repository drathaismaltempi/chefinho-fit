import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { ProgressBar } from '../../components/ui/ProgressBar'
import type { MealPlan, WeeklyGoal } from '../../types'
import { MEAL_TYPE_LABELS } from '../../types'
import { CheckCircle, ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react'
import { usePointsStore } from '../../store/usePointsStore'

const DAY_NAMES = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']

export function MealPlanPage() {
  const navigate = useNavigate()
  const [plan, setPlan] = useState<MealPlan | null>(null)
  const [dayIndex, setDayIndex] = useState(0)
  const [completedGoals, setCompletedGoals] = useState<string[]>([])
  const { addPoints } = usePointsStore()

  useEffect(() => {
    const raw = localStorage.getItem('chefinho-meal-plan')
    if (raw) setPlan(JSON.parse(raw))
    else navigate('/familia')
  }, [navigate])

  if (!plan) return <div className="flex items-center justify-center h-full"><p className="text-gray-400">Carregando...</p></div>

  const day = plan.days[dayIndex]
  const childRaw = localStorage.getItem('chefinho-child')
  const child = childRaw ? JSON.parse(childRaw) : null

  const toggleGoal = (goal: WeeklyGoal) => {
    if (completedGoals.includes(goal.id)) return
    setCompletedGoals(p => [...p, goal.id])
    addPoints(20)
  }

  return (
    <div className="px-4 py-4 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <h2 className="font-title font-bold text-xl text-gray-800">
          Cardápio da Semana {child ? `— ${child.name} 🍎` : ''}
        </h2>
      </div>

      {/* Day selector */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {plan.days.map((d, i) => (
          <button key={i} onClick={() => setDayIndex(i)}
            className={`flex-shrink-0 flex flex-col items-center px-3 py-2 rounded-xl border-2 transition ${dayIndex === i ? 'border-coral bg-coral text-white' : 'border-gray-200 bg-white text-gray-600'}`}>
            <span className="font-title font-bold text-sm">{DAY_NAMES[i]}</span>
            <span className="text-xs opacity-70">{d.date.slice(8)}/{d.date.slice(5, 7)}</span>
          </button>
        ))}
      </div>

      {/* Day Navigation */}
      <div className="flex items-center justify-between">
        <button onClick={() => setDayIndex(Math.max(0, dayIndex - 1))} disabled={dayIndex === 0} className="p-2 rounded-full bg-gray-100 disabled:opacity-40">
          <ChevronLeft size={16} />
        </button>
        <span className="font-title font-semibold text-gray-700">{DAY_NAMES[dayIndex]}, {day.date.slice(8)}/{day.date.slice(5, 7)}</span>
        <button onClick={() => setDayIndex(Math.min(6, dayIndex + 1))} disabled={dayIndex === 6} className="p-2 rounded-full bg-gray-100 disabled:opacity-40">
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Meals */}
      <div className="flex flex-col gap-3">
        {day.meals.map((meal, i) => (
          <motion.div key={meal.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Card padding="sm">
              <div className="flex items-center gap-2 mb-2">
                <Badge color="turquesa">{MEAL_TYPE_LABELS[meal.type]}</Badge>
              </div>
              <h3 className="font-title font-bold text-gray-800">{meal.name}</h3>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {meal.ingredients.map(ing => (
                  <span key={ing} className="bg-verde/30 text-gray-700 px-2 py-0.5 rounded-full text-xs font-body">{ing}</span>
                ))}
              </div>
              <div className="mt-3 flex flex-col gap-1">
                {meal.preparation.map((step, si) => (
                  <p key={si} className="text-xs font-body text-gray-600">
                    <span className="font-semibold text-coral">{si + 1}.</span> {step}
                  </p>
                ))}
              </div>
                      {meal.tip && meal.tip.includes('|') ? (
                <div className="mt-2 flex flex-col gap-1">
                  <p className="text-xs font-body text-turquesa italic">🍴 {meal.tip.split('|')[0].trim()}</p>
                  <p className="text-xs font-body text-verde italic">🌟 {meal.tip.split('|')[1]?.trim()}</p>
                </div>
              ) : meal.tip ? (
                <p className="mt-2 text-xs font-body text-turquesa italic">💡 {meal.tip}</p>
              ) : null}
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Weekly Goals */}
      <div className="flex flex-col gap-2">
        <h3 className="font-title font-bold text-gray-800">Metas da Semana 🎯</h3>
        {plan.goals.map(goal => {
          const done = completedGoals.includes(goal.id)
          return (
            <Card key={goal.id} padding="sm" className={done ? 'bg-verde/20 border-verde' : ''}>
              <div className="flex items-start gap-2">
                <button onClick={() => toggleGoal(goal)} className="mt-0.5 flex-shrink-0">
                  <CheckCircle size={20} className={done ? 'text-verde fill-verde' : 'text-gray-300'} />
                </button>
                <div className="flex-1">
                  <p className="font-body text-sm text-gray-700">{goal.description}</p>
                  <ProgressBar value={done ? goal.target_value : 0} max={goal.target_value} color="verde" className="mt-1.5" />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Shopping List */}
      {plan.shopping_list && plan.shopping_list.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <ShoppingCart size={20} className="text-coral" />
            <h3 className="font-title font-bold text-gray-800">Lista de Compras Sugerida 🛒</h3>
          </div>
          <Card className="bg-coral/5 border-coral/20">
            <p className="text-xs font-body text-gray-500 mb-3">Itens que melhorariam muito o cardápio do {child?.name ?? 'seu Chefinho'}:</p>
            <div className="flex flex-col gap-2.5">
              {plan.shopping_list.map((item, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <span className="text-lg flex-shrink-0">🛍️</span>
                  <div>
                    <p className="font-title font-semibold text-sm text-gray-800">{item.name}
                      <Badge color="gray" className="ml-2 text-[9px]">{item.category}</Badge>
                    </p>
                    <p className="font-body text-xs text-gray-500 mt-0.5">{item.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      <Button variant="ghost" onClick={() => navigate('/familia')} className="mt-2">
        Refazer Cardápio
      </Button>
    </div>
  )
}

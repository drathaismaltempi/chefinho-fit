import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PlayerLevel } from '../types'
import { LEVEL_THRESHOLDS } from '../types'

interface PointsState {
  total_points: number
  weekly_points: number
  level: PlayerLevel
  pending_award: number
  addPoints: (amount: number) => void
  resetWeekly: () => void
}

function computeLevel(points: number): PlayerLevel {
  const levels = Object.entries(LEVEL_THRESHOLDS) as [PlayerLevel, number][]
  let current: PlayerLevel = 'Aprendiz'
  for (const [lvl, threshold] of levels) {
    if (points >= threshold) current = lvl
  }
  return current
}

export const usePointsStore = create<PointsState>()(
  persist(
    (set, get) => ({
      total_points: 0,
      weekly_points: 0,
      level: 'Aprendiz',
      pending_award: 0,
      addPoints: (amount) => {
        const total = get().total_points + amount
        const weekly = get().weekly_points + amount
        set({ total_points: Math.max(0, total), weekly_points: Math.max(0, weekly), level: computeLevel(Math.max(0, total)) })
      },
      resetWeekly: () => set({ weekly_points: 0 }),
    }),
    { name: 'chefinho-points' }
  )
)

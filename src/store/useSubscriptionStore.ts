import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Plan = 'free' | 'plus'

interface SubscriptionState {
  plan: Plan
  aiMealsUsed: number   // usos da IA no mês atual
  aiMealsLimit: number  // 1 no free, 999 no plus
  lastChecked: number   // timestamp da última verificação
  setPlan: (plan: Plan) => void
  setUsage: (used: number, limit: number) => void
  markChecked: () => void
  reset: () => void
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set) => ({
      plan: 'free',
      aiMealsUsed: 0,
      aiMealsLimit: 1,
      lastChecked: 0,
      setPlan: (plan) => set({ plan, aiMealsLimit: plan === 'plus' ? 999 : 1 }),
      setUsage: (aiMealsUsed, aiMealsLimit) => set({ aiMealsUsed, aiMealsLimit }),
      markChecked: () => set({ lastChecked: Date.now() }),
      reset: () => set({ plan: 'free', aiMealsUsed: 0, aiMealsLimit: 1, lastChecked: 0 }),
    }),
    { name: 'chefinho-subscription' }
  )
)

// Plano gratuito pode gerar 1 cardápio por IA por mês
export const AI_MEAL_FREE_LIMIT = 1

import { useSubscriptionStore } from '../store/useSubscriptionStore'
import { useAuthStore } from '../store/useAuthStore'

type GateKey = 'ai_meals'

interface GateResult {
  allowed: boolean
  used: number
  limit: number
  isPlus: boolean
  needsLogin: boolean
}

export function useGate(key: GateKey): GateResult {
  const { plan, aiMealsUsed, aiMealsLimit } = useSubscriptionStore()
  const { profile } = useAuthStore()

  const needsLogin = !profile

  if (key === 'ai_meals') {
    const isPlus = plan === 'plus'
    const allowed = !needsLogin && aiMealsUsed < aiMealsLimit
    return { allowed, used: aiMealsUsed, limit: aiMealsLimit, isPlus, needsLogin }
  }

  return { allowed: false, used: 0, limit: 0, isPlus: false, needsLogin }
}

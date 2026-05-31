import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Profile } from '../types'

interface AuthState {
  profile: Profile | null
  token: string | null
  isLoading: boolean
  setProfile: (profile: Profile | null) => void
  setToken: (token: string | null) => void
  setLoading: (v: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      profile: null,
      token: null,
      isLoading: false,
      setProfile: (profile) => set({ profile }),
      setToken: (token) => set({ token }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ profile: null, token: null }),
    }),
    { name: 'chefinho-auth' }
  )
)

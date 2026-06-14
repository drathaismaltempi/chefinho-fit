import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  // compat: alguns lugares usam profile
  profile: { email?: string } | null
  setUser: (user: User | null, token?: string | null) => void
  setLoading: (v: boolean) => void
  logout: () => Promise<void>
  refreshSession: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: true,
      profile: null,

      setUser: (user, token) => set({
        user,
        token: token ?? get().token,
        profile: user ? { email: user.email } : null,
      }),

      setLoading: (isLoading) => set({ isLoading }),

      logout: async () => {
        await supabase.auth.signOut()
        localStorage.removeItem('chefinho-auth')
        set({ user: null, token: null, profile: null })
      },

      refreshSession: async () => {
        set({ isLoading: true })
        const { data } = await supabase.auth.getSession()
        const session = data.session
        set({
          user: session?.user ?? null,
          token: session?.access_token ?? null,
          profile: session?.user ? { email: session.user.email } : null,
          isLoading: false,
        })
      },
    }),
    {
      name: 'chefinho-auth',
      partialize: (s) => ({ user: s.user, token: s.token, profile: s.profile }),
    }
  )
)

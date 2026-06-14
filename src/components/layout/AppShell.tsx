import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { TopBar } from './TopBar'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../store/useAuthStore'
import { useSubscriptionStore } from '../../store/useSubscriptionStore'

export function AppShell() {
  const { setUser, setLoading } = useAuthStore()
  const { setPlan, setUsage, markChecked, lastChecked } = useSubscriptionStore()

  useEffect(() => {
    // Carregar sessão atual ao iniciar
    supabase.auth.getSession().then(({ data }) => {
      const session = data.session
      setUser(session?.user ?? null, session?.access_token ?? null)
      setLoading(false)

      // Buscar assinatura se logado e cache vencido (>5min)
      if (session && Date.now() - lastChecked > 5 * 60 * 1000) {
        fetch('/api/check-subscription', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        })
          .then(r => r.ok ? r.json() : null)
          .then(data => {
            if (data) {
              setPlan(data.plan)
              setUsage(data.aiMealsUsed, data.aiMealsLimit)
              markChecked()
            }
          })
          .catch(() => {}) // falha silenciosa, usa cache local
      }
    })

    // Escutar mudanças de sessão (magic link, logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null, session?.access_token ?? null)
      setLoading(false)

      if (session?.access_token) {
        fetch('/api/check-subscription', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        })
          .then(r => r.ok ? r.json() : null)
          .then(data => {
            if (data) { setPlan(data.plan); setUsage(data.aiMealsUsed, data.aiMealsLimit); markChecked() }
          })
          .catch(() => {})
      }
    })

    return () => subscription.unsubscribe()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 max-w-lg mx-auto relative">
      <TopBar />
      <main className="flex-1 overflow-y-auto pb-24 pt-16">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}

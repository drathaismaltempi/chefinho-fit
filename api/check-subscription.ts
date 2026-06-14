import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).end()

  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: 'Não autenticado' })

  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) return res.status(401).json({ error: 'Token inválido' })

  const month = new Date().toISOString().slice(0, 7) // '2026-06'

  // Buscar assinatura ativa
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('plan, status, valid_until')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  const plan = sub?.plan === 'plus' ? 'plus' : 'free'
  const limit = plan === 'plus' ? 999 : 1

  // Buscar uso deste mês
  const { data: usage } = await supabase
    .from('ai_usage')
    .select('count')
    .eq('user_id', user.id)
    .eq('month', month)
    .single()

  const count = usage?.count ?? 0

  return res.status(200).json({ plan, aiMealsUsed: count, aiMealsLimit: limit })
}

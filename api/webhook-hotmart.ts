import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

// VITE_ vars are not available in serverless — use SUPABASE_URL or hardcode
const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? 'https://pdzdbhgxrsdmtvdwewkq.supabase.co'
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

// Eventos Hotmart que ativam ou cancelam assinatura
const ACTIVATION_EVENTS = ['PURCHASE_APPROVED', 'PURCHASE_COMPLETE', 'SUBSCRIPTION_REACTIVATED']
const CANCELLATION_EVENTS = ['PURCHASE_CANCELED', 'SUBSCRIPTION_CANCELLATION', 'PURCHASE_REFUNDED', 'PURCHASE_EXPIRED']

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  try {
    const body = req.body
    const event: string = body?.event ?? ''
    const buyer = body?.data?.buyer
    const purchase = body?.data?.purchase

    console.log('Webhook Hotmart recebido:', event, buyer?.email)

    if (!buyer?.email) {
      return res.status(200).json({ ok: true, note: 'sem email no payload' })
    }

    const email: string = buyer.email.toLowerCase()
    const transactionId: string = purchase?.transaction ?? ''

    // Encontrar usuário pelo email
    const { data: users, error: listErr } = await supabase.auth.admin.listUsers()
    if (listErr) {
      console.error('Erro ao listar usuários:', listErr.message)
      return res.status(200).json({ ok: true, note: 'erro ao buscar usuário' })
    }

    const user = users?.users?.find(u => u.email?.toLowerCase() === email)

    if (!user) {
      console.log(`Webhook Hotmart: usuário ${email} ainda não tem conta`)
      return res.status(200).json({ ok: true, note: 'usuário não encontrado' })
    }

    if (ACTIVATION_EVENTS.includes(event)) {
      const validUntil = new Date()
      validUntil.setDate(validUntil.getDate() + 30)

      await supabase.from('subscriptions').upsert({
        user_id: user.id,
        plan: 'plus',
        status: 'active',
        hotmart_transaction_id: transactionId,
        valid_until: validUntil.toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' })

      console.log(`Hotmart: assinatura Plus ativada para ${email}`)
    }

    if (CANCELLATION_EVENTS.includes(event)) {
      await supabase
        .from('subscriptions')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('user_id', user.id)

      console.log(`Hotmart: assinatura cancelada para ${email}`)
    }

    return res.status(200).json({ ok: true })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('Webhook Hotmart erro:', msg)
    return res.status(200).json({ ok: true, note: 'erro interno tratado' })
  }
}

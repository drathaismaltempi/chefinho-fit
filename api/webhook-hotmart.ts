import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Eventos Hotmart que ativam ou cancelam assinatura
const ACTIVATION_EVENTS = ['PURCHASE_APPROVED', 'PURCHASE_COMPLETE', 'SUBSCRIPTION_REACTIVATED']
const CANCELLATION_EVENTS = ['PURCHASE_CANCELED', 'SUBSCRIPTION_CANCELLATION', 'PURCHASE_REFUNDED', 'PURCHASE_EXPIRED']

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  // Verificar token do Hotmart (hottok na query string)
  const { hottok } = req.query
  if (hottok !== process.env.HOTMART_WEBHOOK_SECRET) {
    console.error('Webhook Hotmart: token inválido')
    return res.status(401).json({ error: 'Não autorizado' })
  }

  const body = req.body
  const event: string = body?.event ?? ''
  const buyer = body?.data?.buyer
  const purchase = body?.data?.purchase

  if (!buyer?.email) {
    return res.status(400).json({ error: 'Email do comprador não encontrado' })
  }

  const email: string = buyer.email.toLowerCase()
  const transactionId: string = purchase?.transaction ?? ''

  // Encontrar usuário pelo email
  const { data: users } = await supabase.auth.admin.listUsers()
  const user = users?.users?.find(u => u.email?.toLowerCase() === email)

  if (!user) {
    // Usuário ainda não tem conta — registrar pendência para quando criar
    console.log(`Webhook Hotmart: usuário ${email} ainda não tem conta, ignorando`)
    return res.status(200).json({ ok: true, note: 'usuário não encontrado' })
  }

  if (ACTIVATION_EVENTS.includes(event)) {
    // Calcular validade (30 dias a partir de hoje)
    const validUntil = new Date()
    validUntil.setDate(validUntil.getDate() + 30)

    await supabase.from('subscriptions').upsert({
      user_id: user.id,
      plan: 'plus',
      status: 'active',
      hotmart_transaction_id: transactionId,
      valid_until: validUntil.toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'hotmart_transaction_id' })

    console.log(`Hotmart: assinatura Plus ativada para ${email}`)
  }

  if (CANCELLATION_EVENTS.includes(event)) {
    await supabase
      .from('subscriptions')
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .eq('hotmart_transaction_id', transactionId)

    console.log(`Hotmart: assinatura cancelada para ${email}`)
  }

  return res.status(200).json({ ok: true })
}

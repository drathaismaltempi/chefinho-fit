import type { VercelRequest, VercelResponse } from '@vercel/node'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Fallback in-memory rate limit for unauthenticated calls (should not reach here)
const ipCalls = new Map<string, { count: number; resetAt: number }>()
const IP_LIMIT = 3
const WINDOW_MS = 60 * 60 * 1000

function checkIpLimit(ip: string): boolean {
  const now = Date.now()
  const entry = ipCalls.get(ip)
  if (!entry || now > entry.resetAt) { ipCalls.set(ip, { count: 1, resetAt: now + WINDOW_MS }); return true }
  if (entry.count >= IP_LIMIT) return false
  entry.count++
  return true
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  // --- Autenticação obrigatória ---
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    return res.status(401).json({ error: 'login_required', message: 'Faça login para gerar cardápios.' })
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  if (authError || !user) {
    return res.status(401).json({ error: 'login_required', message: 'Sessão expirada. Faça login novamente.' })
  }

  // --- Verificar plano e limite de uso ---
  const month = new Date().toISOString().slice(0, 7) // '2026-06'

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('plan, status')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  const isPlus = sub?.plan === 'plus'
  const monthlyLimit = isPlus ? 999 : 1

  const { data: usage } = await supabase
    .from('ai_usage')
    .select('count')
    .eq('user_id', user.id)
    .eq('month', month)
    .single()

  const currentCount = usage?.count ?? 0

  if (currentCount >= monthlyLimit) {
    return res.status(402).json({
      error: 'limit_reached',
      message: isPlus
        ? 'Limite inesperado atingido. Entre em contato com o suporte.'
        : 'Você já usou seu cardápio gratuito deste mês. Assine o Chefinho Plus para gerar cardápios ilimitados!',
      plan: isPlus ? 'plus' : 'free',
      used: currentCount,
      limit: monthlyLimit,
    })
  }

  // --- Validação do body ---
  const { child, mealTypes } = req.body ?? {}
  if (!child || !mealTypes) return res.status(400).json({ error: 'Dados insuficientes' })
  if (typeof child.name !== 'string' || child.name.length > 100) return res.status(400).json({ error: 'Dados inválidos' })

  res.setHeader('X-Plan', isPlus ? 'plus' : 'free')
  res.setHeader('X-Usage', `${currentCount + 1}/${monthlyLimit}`)

  try {
    const prompt = `Você é um nutricionista infantil brasileiro especialista em alimentação saudável e gostosa para crianças.

PERFIL DA CRIANÇA:
- Nome: ${child.name}, ${child.age} anos, sexo: ${child.sex === 'M' ? 'menino' : 'menina'}
- Peso: ${child.weight_kg}kg, Altura: ${child.height_cm}cm
- Atividade física: ${child.activity_level}
- Intestino: ${child.gut_health}
- Alergias: ${(child.allergies ?? []).join(', ') || 'nenhuma'}
- Não gosta de: ${(child.food_dislikes ?? []).join(', ') || 'nenhum'}
- Adora comer: ${(child.food_preferences ?? []).join(', ') || 'variado'}
- Utensílios: ${(child.cookware ?? []).join(', ') || 'fogão e frigideira'}
- INGREDIENTES DA DESPENSA: ${child.pantry_raw}

REGRA FUNDAMENTAL: Use SOMENTE os ingredientes listados acima na despensa.

Crie um cardápio para estas refeições: ${(mealTypes ?? []).join(', ')}

Para CADA refeição:
1. Nome criativo e divertido (ex: "Frango Turbinado da Mamãe", "Vitamina da Força")
2. Ingredientes com medidas caseiras usando SOMENTE a despensa
3. Modo de preparo em 3-4 passos simples
4. Dica para deixar mais gostoso
5. Curiosidade nutricional divertida para a criança

Depois:
- 2 metas semanais motivadoras para ${child.age} anos
- Lista de 5 itens para comprar que NÃO estão na despensa mas melhorariam o cardápio

Responda SOMENTE com JSON válido:
{
  "meals": [
    {
      "name": "Nome criativo",
      "ingredients": ["1 ovo", "1 xicara de arroz"],
      "preparation": ["Passo 1", "Passo 2", "Passo 3"],
      "taste_tip": "Dica para ficar mais gostoso",
      "nutrition_tip": "Curiosidade nutricional divertida"
    }
  ],
  "goals": [
    { "description": "Meta 1", "target_value": 5, "unit": "dias" },
    { "description": "Meta 2", "target_value": 3, "unit": "vezes" }
  ],
  "shopping_list": [
    { "name": "item", "reason": "por que comprar", "category": "categoria" }
  ]
}`

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2500,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = (message.content[0] as { text: string }).text
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('JSON não encontrado na resposta')
    const data = JSON.parse(jsonMatch[0])

    // Incrementar contador de uso
    await supabase.from('ai_usage').upsert(
      { user_id: user.id, month, count: currentCount + 1 },
      { onConflict: 'user_id,month' }
    )

    return res.status(200).json(data)
  } catch (err: any) {
    console.error('Erro Claude API:', err?.message ?? err)
    return res.status(500).json({ error: err?.message ?? 'Erro desconhecido na IA' })
  }
}

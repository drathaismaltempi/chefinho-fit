import type { VercelRequest, VercelResponse } from '@vercel/node'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// In-memory rate limiting: 5 calls per hour per IP
// Works as burst protection within a warm serverless instance.
// For distributed rate limiting, add Upstash Redis (UPSTASH_REDIS_REST_URL + TOKEN).
const ipCalls = new Map<string, { count: number; resetAt: number }>()
const LIMIT = 5
const WINDOW_MS = 60 * 60 * 1000 // 1 hour

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const entry = ipCalls.get(ip)

  if (!entry || now > entry.resetAt) {
    ipCalls.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return { allowed: true, remaining: LIMIT - 1 }
  }

  if (entry.count >= LIMIT) {
    return { allowed: false, remaining: 0 }
  }

  entry.count++
  return { allowed: true, remaining: LIMIT - entry.count }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Rate limiting by IP
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || 'unknown'
  const { allowed, remaining } = checkRateLimit(ip)
  res.setHeader('X-RateLimit-Limit', LIMIT)
  res.setHeader('X-RateLimit-Remaining', remaining)

  if (!allowed) {
    return res.status(429).json({
      error: 'Limite de requisições atingido. Tente novamente em 1 hora.',
    })
  }

  const { child, mealTypes } = req.body ?? {}

  if (!child || !mealTypes) {
    return res.status(400).json({ error: 'Dados insuficientes', received: JSON.stringify(req.body).slice(0, 200) })
  }

  // Basic input validation
  if (typeof child.name !== 'string' || child.name.length > 100) {
    return res.status(400).json({ error: 'Dados inválidos' })
  }

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
    return res.status(200).json(data)
  } catch (err: any) {
    console.error('Erro Claude API:', err?.message ?? err)
    return res.status(500).json({ error: err?.message ?? 'Erro desconhecido na IA' })
  }
}

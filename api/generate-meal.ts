import Anthropic from '@anthropic-ai/sdk'
import type { IncomingMessage, ServerResponse } from 'http'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

async function readBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', chunk => { data += chunk.toString() })
    req.on('end', () => {
      try { resolve(data ? JSON.parse(data) : {}) }
      catch (e) { reject(new Error('JSON inválido: ' + data.slice(0, 100))) }
    })
    req.on('error', reject)
  })
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return }
  if (req.method !== 'POST') { res.writeHead(405); res.end(JSON.stringify({ error: 'Method not allowed' })); return }

  let body: any
  try {
    body = await readBody(req)
  } catch (e: any) {
    res.writeHead(400, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Erro ao ler dados: ' + e.message }))
    return
  }

  const { child, mealTypes } = body

  if (!child || !mealTypes) {
    res.writeHead(400, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Dados insuficientes. child e mealTypes são obrigatórios.' }))
    return
  }

  try {
    const prompt = `Você é um nutricionista infantil brasileiro especialista em alimentação saudável e gostosa para crianças.

PERFIL DA CRIANÇA:
- Nome: ${child.name}, ${child.age} anos, sexo: ${child.sex === 'M' ? 'menino' : 'menina'}
- Peso: ${child.weight_kg}kg, Altura: ${child.height_cm}cm
- Atividade física: ${child.activity_level}
- Intestino: ${child.gut_health}
- Alergias: ${child.allergies?.join(', ') || 'nenhuma'}
- Não gosta de: ${child.food_dislikes?.join(', ') || 'nenhum'}
- Adora comer: ${child.food_preferences?.join(', ') || 'variado'}
- Utensílios: ${child.cookware?.join(', ') || 'fogão e frigideira'}
- INGREDIENTES DA DESPENSA: ${child.pantry_raw}

REGRA FUNDAMENTAL: Use SOMENTE os ingredientes listados acima na despensa. Não invente ingredientes ausentes.

Crie um cardápio para estas refeições: ${mealTypes.join(', ')}

Para CADA refeição:
1. Nome criativo e divertido (ex: "Frango Turbo da Mamãe", "Vitamina da Força do Gabriel")
2. Ingredientes com medidas caseiras usando SÓ o que tem na despensa
3. Modo de preparo em 3-4 passos simples e detalhados
4. Dica para deixar mais gostoso (formato divertido, decoração, etc)
5. Curiosidade nutricional divertida para a criança

Depois crie:
- 2 metas semanais motivadoras adequadas para ${child.age} anos
- Lista de 6 itens para comprar que NÃO estão na despensa mas melhorariam muito o cardápio

Responda SOMENTE com JSON válido:
{
  "meals": [
    {
      "name": "Nome criativo",
      "ingredients": ["1 ovo", "2 col de farinha de trigo"],
      "preparation": ["Passo 1 detalhado", "Passo 2", "Passo 3"],
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
      max_tokens: 3000,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = (message.content[0] as { text: string }).text
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('JSON não encontrado na resposta da IA')

    const data = JSON.parse(jsonMatch[0])
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(data))
  } catch (err: any) {
    console.error('Erro Claude API:', err?.message ?? err)
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: err?.message ?? 'Erro desconhecido' }))
  }
}

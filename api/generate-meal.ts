import Anthropic from '@anthropic-ai/sdk'
import type { IncomingMessage, ServerResponse } from 'http'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export default async function handler(req: IncomingMessage & { body?: any }, res: ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.writeHead(200)
    res.end()
    return
  }

  if (req.method !== 'POST') {
    res.writeHead(405)
    res.end(JSON.stringify({ error: 'Method not allowed' }))
    return
  }

  try {
    const body = req.body ?? await new Promise<any>((resolve) => {
      let data = ''
      req.on('data', chunk => { data += chunk })
      req.on('end', () => resolve(JSON.parse(data)))
    })

    const { child, rawMeals } = body

    const prompt = `Você é um nutricionista infantil brasileiro especialista em alimentação saudável para crianças.

Perfil da criança:
- Nome: ${child.name}, ${child.age} anos, sexo: ${child.sex === 'M' ? 'menino' : 'menina'}
- Peso: ${child.weight_kg}kg, Altura: ${child.height_cm}cm
- Nível de atividade: ${child.activity_level}
- Intestino: ${child.gut_health}
- Alergias: ${child.allergies?.join(', ') || 'nenhuma'}
- Não gosta de: ${child.food_dislikes?.join(', ') || 'nenhum'}
- Adora: ${child.food_preferences?.join(', ') || 'variado'}
- Despensa: ${child.pantry_raw}

Para cada refeição abaixo, crie:
1. Um nome DIVERTIDO e apetitoso para a criança (máx 5 palavras)
2. Instruções de preparo em 2-3 passos SIMPLES
3. Uma dica divertida e motivadora

Refeições:
${rawMeals.map((m: { type: string; ingredients: string[] }, i: number) => `${i + 1}. ${m.type}: ingredientes ${m.ingredients.join(', ')}`).join('\n')}

Crie também 2 metas semanais simples e motivadoras para a criança.

Responda SOMENTE com JSON válido:
{
  "meals": [
    { "name": "Nome divertido", "preparation": ["Passo 1", "Passo 2"], "tip": "Dica!" }
  ],
  "goals": [
    { "description": "Meta 1", "target_value": 5, "unit": "dias" },
    { "description": "Meta 2", "target_value": 3, "unit": "vezes" }
  ]
}`

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = (message.content[0] as { text: string }).text
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('JSON não encontrado')

    const data = JSON.parse(jsonMatch[0])
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(data))
  } catch (err) {
    console.error('Erro Claude API:', err)
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Erro ao gerar cardápio com IA' }))
  }
}

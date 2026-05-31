import Anthropic from '@anthropic-ai/sdk'
import type { IncomingMessage, ServerResponse } from 'http'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export default async function handler(req: IncomingMessage & { body?: any }, res: ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return }
  if (req.method !== 'POST') { res.writeHead(405); res.end(JSON.stringify({ error: 'Method not allowed' })); return }

  try {
    const body = req.body ?? await new Promise<any>((resolve) => {
      let data = ''
      req.on('data', chunk => { data += chunk })
      req.on('end', () => resolve(JSON.parse(data)))
    })

    const { child, mealTypes } = body

    const prompt = `Você é um nutricionista infantil brasileiro especialista em alimentação saudável e gostosa para crianças.

PERFIL DA CRIANÇA:
- Nome: ${child.name}, ${child.age} anos, sexo: ${child.sex === 'M' ? 'menino' : 'menina'}
- Peso: ${child.weight_kg}kg, Altura: ${child.height_cm}cm
- Atividade física: ${child.activity_level}
- Intestino: ${child.gut_health}
- Alergias/intolerâncias: ${child.allergies?.join(', ') || 'nenhuma'}
- Não gosta de: ${child.food_dislikes?.join(', ') || 'nenhum'}
- Adora comer: ${child.food_preferences?.join(', ') || 'variado'}
- Utensílios disponíveis: ${child.cookware?.join(', ') || 'fogão e frigideira'}
- INGREDIENTES DISPONÍVEIS NA DESPENSA: ${child.pantry_raw}

IMPORTANTE: Use APENAS os ingredientes da despensa listados acima. Não invente ingredientes que não estão na lista.

Crie um cardápio completo para as seguintes refeições do dia: ${mealTypes.join(', ')}

Para CADA refeição, crie:
1. Nome criativo e divertido para a criança (ex: "Super Panqueca da Força", "Vitamina Turbo do Gabriel")
2. Lista de ingredientes com medidas caseiras (ex: "2 ovos", "1 banana", "1 punhado de aveia")
3. Modo de preparo detalhado em 3-4 passos simples que a mãe consiga fazer fácil
4. 1 dica de como deixar o prato MAIS GOSTOSO e atrativo para a criança (ex: formato divertido, coberturas, apresentação)
5. 1 dica nutricional divertida para contar para a criança (ex: "A banana tem potássio que deixa seus músculos fortes!")

Depois do cardápio, crie:
- 2 metas semanais motivadoras e simples para a criança
- Uma lista de compras com 5 a 8 itens que NÃO estão na despensa mas que melhorariam muito o cardápio, com explicação do porquê cada item é importante

Responda SOMENTE com JSON válido neste formato exato:
{
  "meals": [
    {
      "name": "Nome criativo do prato",
      "ingredients": ["2 ovos", "1 banana amassada", "1 col. de aveia"],
      "preparation": ["Passo 1 detalhado", "Passo 2 detalhado", "Passo 3 detalhado"],
      "taste_tip": "Dica de como deixar mais gostoso (ex: coloque granola por cima!)",
      "nutrition_tip": "Dica nutricional divertida para a criança"
    }
  ],
  "goals": [
    { "description": "Meta motivadora 1", "target_value": 5, "unit": "dias" },
    { "description": "Meta motivadora 2", "target_value": 3, "unit": "vezes" }
  ],
  "shopping_list": [
    { "name": "nome do item", "reason": "Por que comprar e como vai melhorar a alimentação", "category": "fruta/legume/proteína/etc" }
  ]
}`

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 3000,
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

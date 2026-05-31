import type { VercelRequest, VercelResponse } from '@vercel/node'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { child, rawMeals } = req.body

    const prompt = `Você é um nutricionista infantil brasileiro especialista em alimentação saudável para crianças.

Perfil da criança:
- Nome: ${child.name}, ${child.age} anos, sexo: ${child.sex === 'M' ? 'menino' : 'menina'}
- Peso: ${child.weight_kg}kg, Altura: ${child.height_cm}cm
- Nível de atividade: ${child.activity_level}
- Intestino: ${child.gut_health}
- Alergias: ${child.allergies?.join(', ') || 'nenhuma'}
- Não gosta de: ${child.food_dislikes?.join(', ') || 'nenhum'}
- Adora: ${child.food_preferences?.join(', ') || 'variado'}
- Utensílios: ${child.cookware?.join(', ') || 'fogão'}
- Despensa: ${child.pantry_raw}

Para cada refeição abaixo, crie:
1. Um nome DIVERTIDO e apetitoso para a criança (máx 5 palavras)
2. Instruções de preparo em 2-3 passos SIMPLES
3. Uma dica divertida e motivadora para a criança querer comer

Refeições:
${rawMeals.map((m: { type: string; ingredients: string[] }, i: number) => `${i + 1}. ${m.type}: ingredientes ${m.ingredients.join(', ')}`).join('\n')}

Também crie 2 metas semanais simples e motivadoras adequadas para a idade da criança.

Responda SOMENTE com JSON válido neste formato:
{
  "meals": [
    {
      "name": "Nome divertido do prato",
      "preparation": ["Passo 1", "Passo 2", "Passo 3"],
      "tip": "Dica divertida!"
    }
  ],
  "goals": [
    { "description": "Meta semanal 1", "target_value": 5, "unit": "dias" },
    { "description": "Meta semanal 2", "target_value": 3, "unit": "vezes" }
  ]
}`

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = (message.content[0] as { text: string }).text
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('JSON não encontrado na resposta')

    const data = JSON.parse(jsonMatch[0])
    res.status(200).json(data)
  } catch (err) {
    console.error('Erro Claude API:', err)
    res.status(500).json({ error: 'Erro ao gerar cardápio com IA' })
  }
}

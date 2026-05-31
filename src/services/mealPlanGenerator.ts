import type { Child, MealPlan, DayPlan, Meal, WeeklyGoal, MealType } from '../types'

// ─── Caloric Math ─────────────────────────────────────────────────────────────
const ACTIVITY_MULTIPLIER: Record<string, number> = {
  sedentario: 1.2, leve: 1.375, moderado: 1.55, ativo: 1.725,
}

export function dailyKcal(child: Child): number {
  // Mifflin-St Jeor adapted for children
  const bmr = child.sex === 'F'
    ? 10 * child.weight_kg + 6.25 * child.height_cm - 5 * child.age - 161
    : 10 * child.weight_kg + 6.25 * child.height_cm - 5 * child.age + 5
  return Math.round(bmr * (ACTIVITY_MULTIPLIER[child.activity_level] ?? 1.4))
}

const MEAL_DISTRIBUTION: Record<number, Record<MealType, number>> = {
  3: { cafe: 0.30, lanche1: 0, almoco: 0.40, lanche2: 0, jantar: 0.30, ceia: 0 },
  4: { cafe: 0.25, lanche1: 0, almoco: 0.35, lanche2: 0.15, jantar: 0.25, ceia: 0 },
  5: { cafe: 0.25, lanche1: 0.10, almoco: 0.30, lanche2: 0.10, jantar: 0.25, ceia: 0 },
  6: { cafe: 0.20, lanche1: 0.10, almoco: 0.30, lanche2: 0.10, jantar: 0.20, ceia: 0.10 },
}

// ─── Fallback Recipe Templates ────────────────────────────────────────────────
const FALLBACK_MEALS: Record<MealType, { name: string; ingredients: string[]; preparation: string[]; tip: string }[]> = {
  cafe: [
    { name: 'Mingau de Aveia com Banana', ingredients: ['aveia', 'banana', 'leite', 'mel'], preparation: ['Misture aveia com leite quente', 'Amasse a banana por cima', 'Adicione mel a gosto'], tip: 'A aveia dá energia por horas!' },
    { name: 'Tapioca com Queijo', ingredients: ['tapioca', 'queijo mussarela'], preparation: ['Aqueça a frigideira', 'Espalhe a tapioca', 'Adicione queijo e dobre'], tip: 'Rica em proteína e sem glúten!' },
  ],
  lanche1: [
    { name: 'Fruta com Iogurte', ingredients: ['iogurte', 'fruta da estação'], preparation: ['Corte a fruta', 'Misture com iogurte'], tip: 'Super fácil e nutritivo!' },
    { name: 'Castanhas Mix', ingredients: ['castanha', 'amendoim'], preparation: ['Separe um punhado pequeno'], tip: 'Gorduras boas para o cérebro!' },
  ],
  almoco: [
    { name: 'Arroz com Frango Grelhado e Legumes', ingredients: ['arroz', 'frango', 'cenoura', 'azeite'], preparation: ['Cozinhe o arroz', 'Grelhe o frango temperado', 'Refogue os legumes no azeite'], tip: 'Prato completo com todos os grupos alimentares!' },
    { name: 'Macarrão com Atum e Tomate', ingredients: ['macarrao', 'atum', 'tomate', 'azeite'], preparation: ['Cozinhe o macarrão', 'Misture atum com tomate picado', 'Regue com azeite'], tip: 'Ômega-3 na brincadeira!' },
  ],
  lanche2: [
    { name: 'Vitamina de Fruta', ingredients: ['banana', 'leite', 'aveia'], preparation: ['Bata tudo no liquidificador'], tip: 'Lanche poderoso antes da brincadeira!' },
    { name: 'Pão Integral com Pasta de Amendoim', ingredients: ['pao integral', 'pasta de amendoim'], preparation: ['Torre o pão', 'Passe a pasta de amendoim'], tip: 'Proteína e energia juntas!' },
  ],
  jantar: [
    { name: 'Sopa de Legumes com Frango', ingredients: ['frango', 'cenoura', 'batata', 'abobrinha'], preparation: ['Cozinhe todos os ingredientes em água', 'Tempere com sal e ervas'], tip: 'Sopinha quentinha e aconchegante!' },
    { name: 'Omelete de Legumes', ingredients: ['ovo', 'tomate', 'espinafre', 'queijo'], preparation: ['Bata os ovos', 'Adicione legumes picados', 'Frite na frigideira antiaderente'], tip: 'Proteína completa no jantar!' },
  ],
  ceia: [
    { name: 'Iogurte com Mel', ingredients: ['iogurte', 'mel'], preparation: ['Sirva o iogurte com mel a gosto'], tip: 'Proteína antes de dormir!' },
    { name: 'Banana Amassada com Canela', ingredients: ['banana', 'canela'], preparation: ['Amasse a banana', 'Polvilhe canela'], tip: 'Ajuda a dormir melhor!' },
  ],
}

function getActiveMealTypes(mealsPerDay: number): MealType[] {
  const dist = MEAL_DISTRIBUTION[Math.min(Math.max(mealsPerDay, 3), 6)]
  return (Object.entries(dist) as [MealType, number][]).filter(([, v]) => v > 0).map(([k]) => k)
}

function pickMeal(type: MealType, dayIndex: number): Omit<Meal, 'id'> {
  const options = FALLBACK_MEALS[type]
  const meal = options[dayIndex % options.length]
  return {
    type,
    name: meal.name,
    ingredients: meal.ingredients,
    preparation: meal.preparation,
    tip: meal.tip,
    kcal: 0, protein_g: 0, carb_g: 0, fat_g: 0,
  }
}

const WEEKLY_GOALS_POOL: Omit<WeeklyGoal, 'id'>[] = [
  { description: 'Comer uma fruta diferente por dia durante 5 dias', target_value: 5, current_value: 0, unit: 'dias', completed: false },
  { description: 'Tomar pelo menos 6 copos de água por dia', target_value: 6, current_value: 0, unit: 'copos/dia', completed: false },
  { description: 'Experimentar um legume novo 3 vezes na semana', target_value: 3, current_value: 0, unit: 'vezes', completed: false },
  { description: 'Comer brócolis ou espinafre 2 vezes esta semana', target_value: 2, current_value: 0, unit: 'vezes', completed: false },
  { description: 'Fazer o lanche da tarde sem ultraprocessados por 4 dias', target_value: 4, current_value: 0, unit: 'dias', completed: false },
  { description: 'Ajudar a preparar uma receita saudável em casa', target_value: 1, current_value: 0, unit: 'receita', completed: false },
]

export function generateMealPlan(child: Child): MealPlan {
  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1)

  const activeTypes = getActiveMealTypes(child.meals_per_day)

  const days: DayPlan[] = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart)
    date.setDate(weekStart.getDate() + i)
    return {
      date: date.toISOString().split('T')[0],
      meals: activeTypes.map((type, ti) => ({
        id: `${i}-${type}`,
        ...pickMeal(type, i + ti),
      })),
    }
  })

  // Pick 2 random goals
  const shuffled = [...WEEKLY_GOALS_POOL].sort(() => Math.random() - 0.5)
  const goals: WeeklyGoal[] = shuffled.slice(0, 2).map((g, i) => ({ ...g, id: `goal-${i}` }))

  return {
    id: `plan-${Date.now()}`,
    child_id: child.id,
    week_start: weekStart.toISOString().split('T')[0],
    days,
    goals,
    generated_at: new Date().toISOString(),
  }
}

// ─── Claude API Enhancement ──────────────────────────────────────────────────
export async function enhanceMealPlanWithAI(child: Child, plan: MealPlan): Promise<MealPlan> {
  try {
    const activeTypes = plan.days[0].meals.map(m => m.type)

    const res = await fetch('/api/generate-meal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ child, mealTypes: activeTypes }),
    })

    if (!res.ok) throw new Error('API error')
    const data = await res.json()

    if (!data.meals || data.meals.length === 0) throw new Error('No meals returned')

    // Apply AI meals to ALL 7 days, rotating through the AI suggestions
    const enhancedDays: DayPlan[] = plan.days.map((day, dayIdx) => ({
      ...day,
      meals: day.meals.map((meal, mealIdx) => {
        // Rotate through AI meals to vary the week
        const aiMealIdx = (mealIdx + dayIdx) % data.meals.length
        const aiMeal = data.meals[aiMealIdx] ?? data.meals[mealIdx] ?? {}
        return {
          ...meal,
          name: aiMeal.name ?? meal.name,
          ingredients: aiMeal.ingredients ?? meal.ingredients,
          preparation: aiMeal.preparation ?? meal.preparation,
          tip: aiMeal.taste_tip
            ? `${aiMeal.taste_tip} | ${aiMeal.nutrition_tip ?? ''}`
            : (aiMeal.nutrition_tip ?? meal.tip),
        }
      }),
    }))

    const aiGoals: WeeklyGoal[] = (data.goals ?? []).map((g: Omit<WeeklyGoal, 'id' | 'current_value' | 'completed'>, i: number) => ({
      id: `goal-ai-${i}`,
      current_value: 0,
      completed: false,
      ...g,
    }))

    return {
      ...plan,
      days: enhancedDays,
      goals: aiGoals.length > 0 ? aiGoals : plan.goals,
      shopping_list: data.shopping_list ?? [],
      ai_enhanced: true,
    }
  } catch (e) {
    console.error('enhanceMealPlanWithAI error:', e)
    return { ...plan, ai_enhanced: false }
  }
}

// ─── Recipe Combiner (Cozinha dos Campeões) ───────────────────────────────────
export function combineIngredients(names: string[]): { recipe_name: string; instructions: string[] } {
  const joined = names.join(' + ')
  return {
    recipe_name: `Criação Especial: ${joined}`,
    instructions: [
      `Junte ${names[0]} e ${names[1]} numa tigela`,
      `Adicione ${names[2] ?? ''} e misture bem`,
      'Sirva com carinho e muita saúde!',
    ],
  }
}

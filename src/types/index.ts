// ─── Auth ───────────────────────────────────────────────────────────────────
export interface Profile {
  id: string
  email: string
  display_name: string
  role: 'parent' | 'child'
  avatar_url?: string
  total_points: number
  weekly_points: number
  level: PlayerLevel
  created_at: string
}

export type PlayerLevel = 'Aprendiz' | 'Chef Bronze' | 'Chef Prata' | 'Chef Ouro' | 'Guardião do Reino Vita'

export const LEVEL_THRESHOLDS: Record<PlayerLevel, number> = {
  'Aprendiz': 0,
  'Chef Bronze': 50,
  'Chef Prata': 150,
  'Chef Ouro': 350,
  'Guardião do Reino Vita': 700,
}

// ─── Child ──────────────────────────────────────────────────────────────────
export type Sex = 'M' | 'F' | 'outro'
export type ActivityLevel = 'sedentario' | 'leve' | 'moderado' | 'ativo'
export type GutHealth = 'normal' | 'constipado' | 'diarreia' | 'varia'

export interface Child {
  id: string
  owner_id: string
  name: string
  age: number
  sex: Sex
  weight_kg: number
  height_cm: number
  meals_per_day: number
  meal_schedule: string[]
  activity_level: ActivityLevel
  gut_health: GutHealth
  allergies: string[]
  food_preferences: string[]
  food_dislikes: string[]
  cookware: string[]
  pantry_raw: string
  pantry_parsed: PantryCategory[]
  created_at?: string
}

export type PantryItemCategory = 'proteinas' | 'carboidratos' | 'hortalicas' | 'frutas' | 'laticinios' | 'gorduras' | 'temperos' | 'outros'

export interface PantryCategory {
  category: PantryItemCategory
  items: string[]
}

export const PANTRY_CATEGORY_LABELS: Record<PantryItemCategory, string> = {
  proteinas: '🍗 Proteínas',
  carboidratos: '🍚 Carboidratos',
  hortalicas: '🥦 Hortaliças',
  frutas: '🍎 Frutas',
  laticinios: '🧀 Laticínios',
  gorduras: '🥑 Gorduras Boas',
  temperos: '🧄 Temperos',
  outros: '📦 Outros',
}

// ─── Meal Plan ───────────────────────────────────────────────────────────────
export type MealType = 'cafe' | 'lanche1' | 'almoco' | 'lanche2' | 'jantar' | 'ceia'

export const MEAL_TYPE_LABELS: Record<MealType, string> = {
  cafe: '☀️ Café da manhã',
  lanche1: '🍎 Lanche da manhã',
  almoco: '🍽️ Almoço',
  lanche2: '🍌 Lanche da tarde',
  jantar: '🌙 Jantar',
  ceia: '🌛 Ceia',
}

export interface Meal {
  id: string
  type: MealType
  name: string
  ingredients: string[]
  preparation: string[]
  kcal: number
  protein_g: number
  carb_g: number
  fat_g: number
  tip?: string
}

export interface DayPlan {
  date: string
  meals: Meal[]
}

export interface WeeklyGoal {
  id: string
  description: string
  target_value: number
  current_value: number
  unit: string
  completed: boolean
}

export interface MealPlan {
  id: string
  child_id: string
  week_start: string
  days: DayPlan[]
  goals: WeeklyGoal[]
  generated_at: string
}

// ─── Food Cards & Battle ─────────────────────────────────────────────────────
export interface CardAttributes {
  energia: number
  valor_biologico: number
  forca_vitaminica: number
  fator_saude: number
  gordura_ruim: number
}

export type BattleAttribute = keyof CardAttributes

export const ATTRIBUTE_LABELS: Record<BattleAttribute, string> = {
  energia: '⚡ Energia',
  valor_biologico: '🧬 Valor Biológico',
  forca_vitaminica: '💪 Força Vitamínica',
  fator_saude: '❤️ Fator Saúde',
  gordura_ruim: '☠️ Gordura Ruim',
}

export const ATTRIBUTE_INVERTED: Record<BattleAttribute, boolean> = {
  energia: false,
  valor_biologico: false,
  forca_vitaminica: false,
  fator_saude: false,
  gordura_ruim: true, // lower is better
}

export type CardColor = 'verde' | 'laranja' | 'azul' | 'amarelo' | 'vermelho'

export interface FoodCard {
  id: string
  name: string
  emoji: string
  color: CardColor
  is_chaos: boolean
  category: PantryItemCategory
  attributes: CardAttributes
  voice_line: string
  rarity: 'comum' | 'raro' | 'lendario'
}

export interface BattleRound {
  round_number: number
  player_card: FoodCard
  ai_card: FoodCard
  chosen_attribute: BattleAttribute
  player_value: number
  ai_value: number
  winner: 'player' | 'ai' | 'tie'
}

export type BattlePhase = 'selecting-card' | 'selecting-attribute' | 'resolving' | 'round-result' | 'battle-result'

export interface BattleSession {
  player_hand: FoodCard[]
  ai_hand: FoodCard[]
  rounds: BattleRound[]
  phase: BattlePhase
  player_wins: number
  ai_wins: number
  outcome?: 'victory' | 'defeat' | 'draw'
}

// ─── Map / Capture ───────────────────────────────────────────────────────────
export interface MapFoodItem extends FoodCard {
  lat: number
  lng: number
  spawned_at: number
  expires_at: number
  captured: boolean
}

// ─── Mission ─────────────────────────────────────────────────────────────────
export interface Mission {
  id: string
  title: string
  description: string
  type: 'capture' | 'cook' | 'battle' | 'market'
  target_value: number
  current_value: number
  point_reward: number
  expires_at: string
  completed: boolean
}

// ─── Recipe ──────────────────────────────────────────────────────────────────
export interface Recipe {
  id: string
  name: string
  emoji: string
  ingredients: string[]
  instructions: string[]
  nutrition_summary: string
  battle_card: FoodCard
  discovered_at: string
}

// ─── Shop ────────────────────────────────────────────────────────────────────
export interface ShopItem {
  id: string
  name: string
  emoji: string
  description: string
  price_points: number
  type: 'cosmetic' | 'booster'
}

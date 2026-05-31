import type { PantryCategory, PantryItemCategory } from '../types'

const FOOD_MAP: Record<string, PantryItemCategory> = {
  // proteinas
  frango: 'proteinas', 'file de frango': 'proteinas', carne: 'proteinas', 'carne moida': 'proteinas',
  ovo: 'proteinas', ovos: 'proteinas', atum: 'proteinas', sardinha: 'proteinas', salmao: 'proteinas',
  feijao: 'proteinas', 'feijao preto': 'proteinas', 'feijao carioca': 'proteinas', lentilha: 'proteinas',
  grao: 'proteinas', 'grao de bico': 'proteinas', tofu: 'proteinas',
  // carboidratos
  arroz: 'carboidratos', macarrao: 'carboidratos', massa: 'carboidratos', pao: 'carboidratos',
  'pao integral': 'carboidratos', aveia: 'carboidratos', 'batata doce': 'carboidratos', batata: 'carboidratos',
  mandioca: 'carboidratos', inhame: 'carboidratos', quinoa: 'carboidratos', 'farinha de aveia': 'carboidratos',
  tapioca: 'carboidratos', 'farinha de trigo': 'carboidratos',
  // hortalicas
  alface: 'hortalicas', tomate: 'hortalicas', cenoura: 'hortalicas', brocolis: 'hortalicas',
  chuchu: 'hortalicas', abobrinha: 'hortalicas', pepino: 'hortalicas', couve: 'hortalicas',
  espinafre: 'hortalicas', rucula: 'hortalicas', repolho: 'hortalicas', berinjela: 'hortalicas',
  pimentao: 'hortalicas', cebola: 'hortalicas', alho: 'hortalicas', beterraba: 'hortalicas',
  // frutas
  banana: 'frutas', maca: 'frutas', laranja: 'frutas', mamao: 'frutas', manga: 'frutas',
  morango: 'frutas', uva: 'frutas', melancia: 'frutas', abacaxi: 'frutas', pera: 'frutas',
  limao: 'frutas', maracuja: 'frutas', goiaba: 'frutas', acerola: 'frutas', abacate: 'frutas',
  // laticinios
  leite: 'laticinios', queijo: 'laticinios', iogurte: 'laticinios', 'iogurte grego': 'laticinios',
  requeijao: 'laticinios', 'leite desnatado': 'laticinios', mussarela: 'laticinios',
  // gorduras
  azeite: 'gorduras', oleo: 'gorduras', 'oleo de coco': 'gorduras', manteiga: 'gorduras',
  castanha: 'gorduras', amendoim: 'gorduras', 'pasta de amendoim': 'gorduras', 'oleo de girassol': 'gorduras',
  // temperos
  sal: 'temperos', pimenta: 'temperos', oregano: 'temperos', curcuma: 'temperos', gengibre: 'temperos',
  canela: 'temperos', 'caldo de legumes': 'temperos', 'tempero pronto': 'temperos', mostarda: 'temperos',
  // laticinios extra
  cacau: 'outros', 'chocolate em po': 'outros', mel: 'outros', geleia: 'outros',
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9 ]/g, '')
    .trim()
}

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  )
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    }
  }
  return dp[m][n]
}

function classify(token: string): PantryItemCategory {
  const norm = normalize(token)
  if (FOOD_MAP[norm]) return FOOD_MAP[norm]

  // fuzzy match
  let best: PantryItemCategory = 'outros'
  let bestDist = Infinity
  for (const [key, cat] of Object.entries(FOOD_MAP)) {
    const dist = levenshtein(norm, key)
    if (dist < bestDist && dist <= 2) {
      bestDist = dist
      best = cat
    }
  }
  return best
}

export function parsePantry(raw: string): PantryCategory[] {
  const tokens = raw
    .split(/[,\n;]+/)
    .map(t => t.replace(/^\d+(\.\d+)?\s*(kg|g|ml|l|un|unidade|pacote|caixa|lata|xic|colher|punhado)?\s*/i, '').trim())
    .filter(Boolean)

  const map: Record<PantryItemCategory, string[]> = {
    proteinas: [], carboidratos: [], hortalicas: [], frutas: [],
    laticinios: [], gorduras: [], temperos: [], outros: [],
  }

  for (const token of tokens) {
    const cat = classify(token)
    if (!map[cat].includes(token)) map[cat].push(token)
  }

  return (Object.entries(map) as [PantryItemCategory, string[]][])
    .filter(([, items]) => items.length > 0)
    .map(([category, items]) => ({ category, items }))
}

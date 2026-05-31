import type { PantryCategory, PantryItemCategory } from '../types'

const FOOD_MAP: Record<string, PantryItemCategory> = {
  // ── Proteínas ──────────────────────────────────────────────────────────────
  frango: 'proteinas', 'file de frango': 'proteinas', 'peito de frango': 'proteinas',
  'coxa de frango': 'proteinas', 'sobrecoxa': 'proteinas', 'frango inteiro': 'proteinas',
  carne: 'proteinas', 'carne bovina': 'proteinas', 'carne vermelha': 'proteinas',
  'carne moida': 'proteinas', 'carne moída': 'proteinas', patinho: 'proteinas',
  'patinho moido': 'proteinas', 'patinho moído': 'proteinas',
  'baby beef': 'proteinas', beef: 'proteinas', picanha: 'proteinas',
  alcatra: 'proteinas', contrafile: 'proteinas', 'contra file': 'proteinas',
  maminha: 'proteinas', acem: 'proteinas', 'músculo': 'proteinas', musculo: 'proteinas',
  linguica: 'proteinas', 'linguiça': 'proteinas', salsicha: 'proteinas',
  presunto: 'proteinas', peito: 'proteinas', 'peito de peru': 'proteinas',
  ovo: 'proteinas', ovos: 'proteinas',
  atum: 'proteinas', sardinha: 'proteinas', salmao: 'proteinas', tilapia: 'proteinas',
  'peixe': 'proteinas', bacalhau: 'proteinas', camarao: 'proteinas',
  feijao: 'proteinas', 'feijao preto': 'proteinas', 'feijao carioca': 'proteinas',
  'feijão': 'proteinas', lentilha: 'proteinas', ervilha: 'proteinas',
  'grao de bico': 'proteinas', 'grão de bico': 'proteinas', tofu: 'proteinas',
  'proteina de soja': 'proteinas', 'pts': 'proteinas',

  // ── Carboidratos ───────────────────────────────────────────────────────────
  arroz: 'carboidratos', 'arroz integral': 'carboidratos', 'arroz branco': 'carboidratos',
  macarrao: 'carboidratos', 'macarrão': 'carboidratos', massa: 'carboidratos',
  espaguete: 'carboidratos', talharim: 'carboidratos', fusilli: 'carboidratos',
  pao: 'carboidratos', 'pão': 'carboidratos', 'pao integral': 'carboidratos',
  'pão integral': 'carboidratos', 'pao de forma': 'carboidratos', torrada: 'carboidratos',
  aveia: 'carboidratos', 'flocos de aveia': 'carboidratos',
  'batata doce': 'carboidratos', 'batata-doce': 'carboidratos', batata: 'carboidratos',
  'batata inglesa': 'carboidratos', 'batata palha': 'carboidratos',
  mandioca: 'carboidratos', macaxeira: 'carboidratos', aipim: 'carboidratos',
  inhame: 'carboidratos', cará: 'carboidratos',
  quinoa: 'carboidratos', granola: 'carboidratos',
  tapioca: 'carboidratos', 'goma de tapioca': 'carboidratos',
  'farinha de trigo': 'carboidratos', 'farinha de mandioca': 'carboidratos',
  'farinha de milho': 'carboidratos', 'farinha de milho em floca': 'carboidratos',
  'farinha de milho em flocao': 'carboidratos', 'fuba': 'carboidratos', 'fubá': 'carboidratos',
  'milho cozido': 'carboidratos', milho: 'carboidratos', 'milho verde': 'carboidratos',
  'canjica': 'carboidratos', 'cuscuz': 'carboidratos',
  'bolacha': 'carboidratos', 'biscoito': 'carboidratos',
  'bolacha maisena': 'carboidratos', 'biscoito maisena': 'carboidratos',
  'bolacha de agua e sal': 'carboidratos', 'cream cracker': 'carboidratos',
  'arroz de leite': 'carboidratos',

  // ── Hortaliças / Legumes / Verduras ───────────────────────────────────────
  alface: 'hortalicas', rucula: 'hortalicas', 'rúcula': 'hortalicas',
  tomate: 'hortalicas', 'tomate cereja': 'hortalicas',
  cenoura: 'hortalicas', brocolis: 'hortalicas', 'brócolis': 'hortalicas',
  couve: 'hortalicas', 'couve flor': 'hortalicas', 'couve-flor': 'hortalicas',
  acelga: 'hortalicas', espinafre: 'hortalicas', repolho: 'hortalicas',
  chuchu: 'hortalicas', abobrinha: 'hortalicas', berinjela: 'hortalicas',
  pepino: 'hortalicas', pimentao: 'hortalicas', 'pimentão': 'hortalicas',
  cebola: 'hortalicas', 'cebola roxa': 'hortalicas', alho: 'hortalicas',
  'alho poro': 'hortalicas', 'alho-poró': 'hortalicas',
  beterraba: 'hortalicas', 'vagem': 'hortalicas', quiabo: 'hortalicas',
  jiló: 'hortalicas', jilo: 'hortalicas', maxixe: 'hortalicas',
  'ervilha fresca': 'hortalicas', 'milho verde fresco': 'hortalicas',
  'palmito': 'hortalicas', cogumelo: 'hortalicas', champignon: 'hortalicas',
  'salsa': 'hortalicas', cebolinha: 'hortalicas',
  'coentro': 'hortalicas', 'manjericao': 'hortalicas', 'manjericão': 'hortalicas',

  // ── Frutas ─────────────────────────────────────────────────────────────────
  banana: 'frutas', maca: 'frutas', 'maçã': 'frutas',
  laranja: 'frutas', mamao: 'frutas', 'mamão': 'frutas', papaya: 'frutas',
  manga: 'frutas', morango: 'frutas', uva: 'frutas',
  melancia: 'frutas', melao: 'frutas', 'melão': 'frutas',
  abacaxi: 'frutas', pera: 'frutas',
  limao: 'frutas', 'limão': 'frutas', 'limao siciliano': 'frutas',
  maracuja: 'frutas', 'maracujá': 'frutas', goiaba: 'frutas',
  acerola: 'frutas', caju: 'frutas', pitanga: 'frutas',
  abacate: 'frutas', kiwi: 'frutas', mirtilo: 'frutas',
  framboesa: 'frutas', amora: 'frutas', lichia: 'frutas',
  coco: 'frutas', 'coco ralado': 'frutas',
  'banana prata': 'frutas', 'banana nanica': 'frutas',
  pessego: 'frutas', 'pêssego': 'frutas', ameixa: 'frutas',
  figo: 'frutas', tâmara: 'frutas',

  // ── Laticínios ─────────────────────────────────────────────────────────────
  leite: 'laticinios', 'leite integral': 'laticinios', 'leite desnatado': 'laticinios',
  'leite semi': 'laticinios', 'leite sem lactose': 'laticinios',
  'leite de coco': 'laticinios', 'leite condensado': 'laticinios',
  'creme de leite': 'laticinios',
  queijo: 'laticinios', mussarela: 'laticinios', 'muçarela': 'laticinios',
  'queijo mussarela': 'laticinios', 'queijo prato': 'laticinios',
  'queijo minas': 'laticinios', 'queijo fresco': 'laticinios',
  'queijo sem lactose': 'laticinios', 'queijo ricota': 'laticinios', ricota: 'laticinios',
  'queijo cottage': 'laticinios', cottage: 'laticinios',
  iogurte: 'laticinios', 'iogurte natural': 'laticinios', 'iogurte grego': 'laticinios',
  'iogurte sem lactose': 'laticinios', 'iogute sem lactose': 'laticinios',
  'iogute': 'laticinios', 'yogurte': 'laticinios',
  requeijao: 'laticinios', 'requeijão': 'laticinios',
  manteiga: 'gorduras', 'manteiga sem sal': 'gorduras',
  'creme cheese': 'laticinios', 'cream cheese': 'laticinios',

  // ── Gorduras Boas ──────────────────────────────────────────────────────────
  azeite: 'gorduras', 'azeite de oliva': 'gorduras', 'azeite extra virgem': 'gorduras',
  oleo: 'gorduras', 'óleo': 'gorduras', 'oleo de coco': 'gorduras',
  'oleo de girassol': 'gorduras', 'oleo de canola': 'gorduras', 'oleo de soja': 'gorduras',
  castanha: 'gorduras', 'castanha do para': 'gorduras', 'castanha de caju': 'gorduras',
  amendoim: 'gorduras', 'pasta de amendoim': 'gorduras', 'amendoim torrado': 'gorduras',
  noz: 'gorduras', nozes: 'gorduras', amêndoa: 'gorduras', amendoa: 'gorduras',
  'pasta de amendoa': 'gorduras', sementes: 'gorduras', 'semente de chia': 'gorduras',
  chia: 'gorduras', linhaca: 'gorduras', 'linhaça': 'gorduras',
  gergelim: 'gorduras', tahine: 'gorduras',

  // ── Temperos / Condimentos ─────────────────────────────────────────────────
  sal: 'temperos', 'sal refinado': 'temperos', 'sal grosso': 'temperos',
  'sal rosa': 'temperos', 'flor de sal': 'temperos',
  pimenta: 'temperos', 'pimenta do reino': 'temperos', 'pimenta vermelha': 'temperos',
  oregano: 'temperos', 'orégano': 'temperos', curcuma: 'temperos', 'cúrcuma': 'temperos',
  acafrao: 'temperos', 'açafrão': 'temperos', gengibre: 'temperos',
  canela: 'temperos', 'canela em po': 'temperos', baunilha: 'temperos',
  'caldo de legumes': 'temperos', 'caldo de frango': 'temperos', 'caldo de carne': 'temperos',
  'tempero pronto': 'temperos', 'tempero baiano': 'temperos',
  mostarda: 'temperos', ketchup: 'temperos', molho: 'temperos',
  'molho de tomate': 'temperos', 'molho shoyu': 'temperos', shoyu: 'temperos',
  'vinagre': 'temperos', 'vinagre de maca': 'temperos', 'vinagre de maça': 'temperos',
  'vinagre de maçã': 'temperos', 'vinagre branco': 'temperos',
  'diversos temperos': 'temperos', 'temperos variados': 'temperos',
  alecrim: 'temperos', tomilho: 'temperos', louro: 'temperos',
  'extrato de tomate': 'temperos',
  mel: 'outros', 'mel de abelha': 'outros',
  acucar: 'outros', 'açúcar': 'outros', 'acucar mascavo': 'outros',
  'acucar demerara': 'outros', 'adocante': 'outros',
  cacau: 'outros', 'cacau em po': 'outros', 'chocolate em po': 'outros',
  'chocolate': 'outros', 'achocolatado': 'outros',
  'farinha de aveia': 'carboidratos', 'farelo de aveia': 'carboidratos',
  'proteina whey': 'proteinas', whey: 'proteinas',
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function levenshtein(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > 3) return 99
  const m = a.length, n = b.length
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  )
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
  return dp[m][n]
}

function classify(token: string): PantryItemCategory {
  const norm = normalize(token)
  if (!norm) return 'outros'

  // Exact match
  if (FOOD_MAP[norm]) return FOOD_MAP[norm]

  // Partial match — check if any key is contained in the token or vice versa
  for (const [key, cat] of Object.entries(FOOD_MAP)) {
    if (norm.includes(key) || key.includes(norm)) return cat
  }

  // Fuzzy match (Levenshtein ≤ 2)
  let best: PantryItemCategory = 'outros'
  let bestDist = Infinity
  for (const [key, cat] of Object.entries(FOOD_MAP)) {
    const dist = levenshtein(norm, key)
    if (dist < bestDist && dist <= 2) { bestDist = dist; best = cat }
  }
  return best
}

export function parsePantry(raw: string): PantryCategory[] {
  const tokens = raw
    .split(/[,\n;]+/)
    .map(t => t
      .replace(/^\d+(\.\d+)?\s*(kg|g|ml|l|un|unidade|pacote|caixa|lata|xic|colher|punhado|pote|garrafa|saco)\.?\s*/i, '')
      .trim()
    )
    .filter(t => t.length > 1)

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

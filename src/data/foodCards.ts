import type { FoodCard } from '../types'

export const ALL_FOOD_CARDS: FoodCard[] = [
  // ── Frutas (Verde) ─────────────────────────────────────────────────────────
  { id: 'banana', name: 'Banana Poderosa', emoji: '🍌', color: 'verde', is_chaos: false, category: 'frutas', rarity: 'comum', voice_line: 'Minha energia não tem fim!', attributes: { energia: 89, valor_biologico: 30, forca_vitaminica: 72, fator_saude: 78, gordura_ruim: 3 } },
  { id: 'maca', name: 'Maçã Mágica', emoji: '🍎', color: 'verde', is_chaos: false, category: 'frutas', rarity: 'comum', voice_line: 'Uma por dia, sem médico na vida!', attributes: { energia: 52, valor_biologico: 20, forca_vitaminica: 68, fator_saude: 82, gordura_ruim: 2 } },
  { id: 'morango', name: 'Morango Superstar', emoji: '🍓', color: 'verde', is_chaos: false, category: 'frutas', rarity: 'raro', voice_line: 'Vitamina C na veia!', attributes: { energia: 32, valor_biologico: 22, forca_vitaminica: 95, fator_saude: 88, gordura_ruim: 1 } },
  { id: 'manga', name: 'Manga Tropical', emoji: '🥭', color: 'verde', is_chaos: false, category: 'frutas', rarity: 'comum', voice_line: 'Tropical e poderoso!', attributes: { energia: 60, valor_biologico: 28, forca_vitaminica: 85, fator_saude: 80, gordura_ruim: 2 } },
  { id: 'uva', name: 'Uva Antioxidante', emoji: '🍇', color: 'verde', is_chaos: false, category: 'frutas', rarity: 'raro', voice_line: 'Antioxidante lendário!', attributes: { energia: 69, valor_biologico: 25, forca_vitaminica: 76, fator_saude: 79, gordura_ruim: 1 } },
  { id: 'laranja', name: 'Laranja Vitamínica', emoji: '🍊', color: 'verde', is_chaos: false, category: 'frutas', rarity: 'comum', voice_line: 'C de Campeão!', attributes: { energia: 47, valor_biologico: 24, forca_vitaminica: 98, fator_saude: 86, gordura_ruim: 1 } },

  // ── Hortaliças (Verde) ──────────────────────────────────────────────────────
  { id: 'brocolis', name: 'Brócolis Bravo', emoji: '🥦', color: 'verde', is_chaos: false, category: 'hortalicas', rarity: 'raro', voice_line: 'Sou pequeno, mas poderoso!', attributes: { energia: 34, valor_biologico: 60, forca_vitaminica: 99, fator_saude: 96, gordura_ruim: 2 } },
  { id: 'cenoura', name: 'Cenoura Campeã', emoji: '🥕', color: 'verde', is_chaos: false, category: 'hortalicas', rarity: 'comum', voice_line: 'Meus olhos veem tudo!', attributes: { energia: 41, valor_biologico: 28, forca_vitaminica: 90, fator_saude: 88, gordura_ruim: 1 } },
  { id: 'tomate', name: 'Tomate Turbo', emoji: '🍅', color: 'verde', is_chaos: false, category: 'hortalicas', rarity: 'comum', voice_line: 'Licopeno no ataque!', attributes: { energia: 18, valor_biologico: 30, forca_vitaminica: 82, fator_saude: 85, gordura_ruim: 1 } },
  { id: 'espinafre', name: 'Espinafre do Bem', emoji: '🌿', color: 'verde', is_chaos: false, category: 'hortalicas', rarity: 'lendario', voice_line: 'Ferro e força!', attributes: { energia: 23, valor_biologico: 55, forca_vitaminica: 100, fator_saude: 97, gordura_ruim: 1 } },

  // ── Proteínas (Laranja) ─────────────────────────────────────────────────────
  { id: 'frango', name: 'Frango Fortão', emoji: '🍗', color: 'laranja', is_chaos: false, category: 'proteinas', rarity: 'comum', voice_line: 'Proteína de qualidade!', attributes: { energia: 165, valor_biologico: 95, forca_vitaminica: 45, fator_saude: 82, gordura_ruim: 18 } },
  { id: 'ovo', name: 'Ovo Essencial', emoji: '🥚', color: 'laranja', is_chaos: false, category: 'proteinas', rarity: 'raro', voice_line: 'O alimento completo!', attributes: { energia: 143, valor_biologico: 100, forca_vitaminica: 60, fator_saude: 88, gordura_ruim: 25 } },
  { id: 'atum', name: 'Atum Ômega', emoji: '🐟', color: 'laranja', is_chaos: false, category: 'proteinas', rarity: 'raro', voice_line: 'Ômega-3 na corrente!', attributes: { energia: 108, valor_biologico: 92, forca_vitaminica: 70, fator_saude: 90, gordura_ruim: 8 } },
  { id: 'feijao', name: 'Feijão Guerreiro', emoji: '🫘', color: 'laranja', is_chaos: false, category: 'proteinas', rarity: 'comum', voice_line: 'Fibra e proteína juntas!', attributes: { energia: 127, valor_biologico: 68, forca_vitaminica: 55, fator_saude: 84, gordura_ruim: 4 } },

  // ── Carboidratos (Azul) ─────────────────────────────────────────────────────
  { id: 'arroz', name: 'Arroz Aventureiro', emoji: '🍚', color: 'azul', is_chaos: false, category: 'carboidratos', rarity: 'comum', voice_line: 'Energia sustentada!', attributes: { energia: 130, valor_biologico: 35, forca_vitaminica: 22, fator_saude: 72, gordura_ruim: 3 } },
  { id: 'aveia', name: 'Aveia Heroína', emoji: '🌾', color: 'azul', is_chaos: false, category: 'carboidratos', rarity: 'raro', voice_line: 'Fibras que protegem!', attributes: { energia: 389, valor_biologico: 55, forca_vitaminica: 68, fator_saude: 87, gordura_ruim: 12 } },
  { id: 'batata-doce', name: 'Batata Doce Turbo', emoji: '🍠', color: 'azul', is_chaos: false, category: 'carboidratos', rarity: 'raro', voice_line: 'Energia lenta e potente!', attributes: { energia: 86, valor_biologico: 25, forca_vitaminica: 78, fator_saude: 85, gordura_ruim: 2 } },

  // ── Gorduras Boas (Amarelo) ──────────────────────────────────────────────────
  { id: 'abacate', name: 'Abacate Amigo', emoji: '🥑', color: 'amarelo', is_chaos: false, category: 'gorduras', rarity: 'lendario', voice_line: 'Gordura do bem!', attributes: { energia: 160, valor_biologico: 45, forca_vitaminica: 80, fator_saude: 91, gordura_ruim: 15 } },
  { id: 'azeite', name: 'Azeite Nobre', emoji: '🫒', color: 'amarelo', is_chaos: false, category: 'gorduras', rarity: 'raro', voice_line: 'Mediterrâneo poderoso!', attributes: { energia: 884, valor_biologico: 10, forca_vitaminica: 55, fator_saude: 88, gordura_ruim: 16 } },
  { id: 'castanha', name: 'Castanha Campeã', emoji: '🌰', color: 'amarelo', is_chaos: false, category: 'gorduras', rarity: 'raro', voice_line: 'Selênio do Brasil!', attributes: { energia: 656, valor_biologico: 60, forca_vitaminica: 72, fator_saude: 86, gordura_ruim: 20 } },

  // ── Monstrinhos do Caos (Vermelho) ───────────────────────────────────────────
  { id: 'refrigerante', name: 'Refri Ranzinza', emoji: '🥤', color: 'vermelho', is_chaos: true, category: 'outros', rarity: 'comum', voice_line: 'Açúcar no ataque!', attributes: { energia: 42, valor_biologico: 0, forca_vitaminica: 0, fator_saude: 5, gordura_ruim: 0 } },
  { id: 'salgadinho', name: 'Salgadinho do Caos', emoji: '🍟', color: 'vermelho', is_chaos: true, category: 'outros', rarity: 'comum', voice_line: 'Sódio devastador!', attributes: { energia: 536, valor_biologico: 8, forca_vitaminica: 5, fator_saude: 8, gordura_ruim: 90 } },
  { id: 'biscoito-recheado', name: 'Biscoito Maligno', emoji: '🍪', color: 'vermelho', is_chaos: true, category: 'outros', rarity: 'comum', voice_line: 'Gordura trans ataca!', attributes: { energia: 482, valor_biologico: 5, forca_vitaminica: 3, fator_saude: 10, gordura_ruim: 85 } },
]

export const HEALTHY_CARDS = ALL_FOOD_CARDS.filter(c => !c.is_chaos)
export const CHAOS_CARDS = ALL_FOOD_CARDS.filter(c => c.is_chaos)

import { create } from 'zustand'
import type { BattleSession, FoodCard, BattleAttribute, BattleRound } from '../types'
import { ATTRIBUTE_INVERTED } from '../types'
import { ALL_FOOD_CARDS } from '../data/foodCards'

function pickAiCard(attribute: BattleAttribute, hand: FoodCard[]): FoodCard {
  const sorted = [...hand].sort((a, b) => {
    const inv = ATTRIBUTE_INVERTED[attribute]
    return inv
      ? a.attributes[attribute] - b.attributes[attribute]
      : b.attributes[attribute] - a.attributes[attribute]
  })
  return Math.random() < 0.8 ? sorted[0] : sorted[Math.floor(Math.random() * sorted.length)]
}

function resolveRound(attr: BattleAttribute, pVal: number, aiVal: number): 'player' | 'ai' | 'tie' {
  if (ATTRIBUTE_INVERTED[attr]) {
    if (pVal < aiVal) return 'player'
    if (pVal > aiVal) return 'ai'
    return 'tie'
  }
  if (pVal > aiVal) return 'player'
  if (pVal < aiVal) return 'ai'
  return 'tie'
}

interface BattleStoreState {
  session: BattleSession | null
  selectedCard: FoodCard | null
  startBattle: (playerHand: FoodCard[]) => void
  selectCard: (card: FoodCard) => void
  selectAttribute: (attr: BattleAttribute) => void
  nextRound: () => void
  resetBattle: () => void
}

function buildAiHand(): FoodCard[] {
  const shuffled = [...ALL_FOOD_CARDS].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 5)
}

export const useBattleStore = create<BattleStoreState>((set, get) => ({
  session: null,
  selectedCard: null,

  startBattle: (playerHand) => {
    set({
      session: {
        player_hand: playerHand,
        ai_hand: buildAiHand(),
        rounds: [],
        phase: 'selecting-card',
        player_wins: 0,
        ai_wins: 0,
      },
      selectedCard: null,
    })
  },

  selectCard: (card) => {
    const s = get().session
    if (!s || s.phase !== 'selecting-card') return
    set({ selectedCard: card, session: { ...s, phase: 'selecting-attribute' } })
  },

  selectAttribute: (attr) => {
    const s = get().session
    const pCard = get().selectedCard
    if (!s || !pCard || s.phase !== 'selecting-attribute') return

    const aiCard = pickAiCard(attr, s.ai_hand)
    const pVal = pCard.attributes[attr]
    const aiVal = aiCard.attributes[attr]
    const winner = resolveRound(attr, pVal, aiVal)

    const round: BattleRound = {
      round_number: s.rounds.length + 1,
      player_card: pCard,
      ai_card: aiCard,
      chosen_attribute: attr,
      player_value: pVal,
      ai_value: aiVal,
      winner,
    }

    const newPlayerWins = s.player_wins + (winner === 'player' ? 1 : 0)
    const newAiWins = s.ai_wins + (winner === 'ai' ? 1 : 0)
    const newRounds = [...s.rounds, round]

    const battleDone = newPlayerWins >= 2 || newAiWins >= 2 || newRounds.length >= 3
    const outcome = battleDone
      ? newPlayerWins > newAiWins ? 'victory' : newPlayerWins < newAiWins ? 'defeat' : 'draw'
      : undefined

    set({
      session: {
        ...s,
        rounds: newRounds,
        player_wins: newPlayerWins,
        ai_wins: newAiWins,
        phase: battleDone ? 'battle-result' : 'round-result',
        outcome,
        player_hand: s.player_hand.filter(c => c.id !== pCard.id),
        ai_hand: s.ai_hand.filter(c => c.id !== aiCard.id),
      },
    })
  },

  nextRound: () => {
    const s = get().session
    if (!s) return
    set({ session: { ...s, phase: 'selecting-card' }, selectedCard: null })
  },

  resetBattle: () => set({ session: null, selectedCard: null }),
}))

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMapStore } from '../../store/useMapStore'
import { usePointsStore } from '../../store/usePointsStore'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { combineIngredients } from '../../services/mealPlanGenerator'
import type { FoodCard } from '../../types'
import { ALL_FOOD_CARDS } from '../../data/foodCards'
import { X, ChefHat } from 'lucide-react'

export function CozinhaPage() {
  const { inventory } = useMapStore()
  const { addPoints } = usePointsStore()
  const [slots, setSlots] = useState<(FoodCard | null)[]>([null, null, null])
  const [recipe, setRecipe] = useState<{ recipe_name: string; instructions: string[] } | null>(null)

  // If inventory is empty, show demo cards
  const availableCards = inventory.length > 0 ? inventory : ALL_FOOD_CARDS.slice(0, 8)

  const placeCard = (card: FoodCard) => {
    const emptyIdx = slots.findIndex(s => s === null)
    if (emptyIdx === -1) return
    setSlots(s => { const n = [...s]; n[emptyIdx] = card; return n })
  }

  const removeSlot = (i: number) => setSlots(s => { const n = [...s]; n[i] = null; return n })

  const handleCook = () => {
    const filled = slots.filter(Boolean) as FoodCard[]
    if (filled.length < 3) return
    const result = combineIngredients(filled.map(c => c.name))
    setRecipe(result)
    addPoints(10)
  }

  const canCook = slots.every(Boolean)

  return (
    <div className="px-4 py-4 flex flex-col gap-4">
      <div>
        <h2 className="font-title font-bold text-xl text-gray-800">Cozinha dos Campeões 🍳</h2>
        <p className="font-body text-sm text-gray-500">Combine 3 alimentos para criar uma receita poderosa!</p>
      </div>

      {/* Slots */}
      <Card className="bg-gradient-to-br from-amarelo to-yellow-200 border-0">
        <p className="font-title font-bold text-gray-800 mb-3">Ingredientes selecionados</p>
        <div className="grid grid-cols-3 gap-3">
          {slots.map((card, i) => (
            <motion.div key={i} className="relative" whileTap={{ scale: 0.95 }}>
              <div className={`aspect-square rounded-2xl flex flex-col items-center justify-center text-center ${card ? 'bg-white shadow-md' : 'bg-white/50 border-2 border-dashed border-yellow-400'}`}>
                {card ? (
                  <>
                    <span className="text-3xl">{card.emoji}</span>
                    <span className="text-xs font-title font-semibold text-gray-700 mt-1 px-1 leading-tight">{card.name.split(' ')[0]}</span>
                    <button onClick={() => removeSlot(i)} className="absolute top-1 right-1 bg-coral text-white rounded-full p-0.5">
                      <X size={10} />
                    </button>
                  </>
                ) : (
                  <span className="text-2xl opacity-40">+</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        <Button fullWidth onClick={handleCook} disabled={!canCook} className="mt-4" variant="secondary">
          <ChefHat size={16} className="mr-1 inline" /> Cozinhar! (+10 pts)
        </Button>
      </Card>

      {/* Recipe Result */}
      <AnimatePresence>
        {recipe && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <Card className="bg-verde/20 border-verde">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-3xl">🎉</span>
                <h3 className="font-title font-bold text-gray-800">{recipe.recipe_name}</h3>
              </div>
              <div className="flex flex-col gap-1">
                {recipe.instructions.map((step, i) => (
                  <p key={i} className="text-sm font-body text-gray-700">
                    <span className="font-semibold text-turquesa">{i + 1}.</span> {step}
                  </p>
                ))}
              </div>
              <Button size="sm" className="mt-3" onClick={() => { setRecipe(null); setSlots([null, null, null]) }}>
                Criar outra receita
              </Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inventory */}
      <div>
        <p className="font-title font-bold text-gray-800 mb-2">
          {inventory.length > 0 ? '🎒 Seu inventário' : '🎒 Alimentos disponíveis (demo)'}
        </p>
        <div className="grid grid-cols-4 gap-2">
          {availableCards.filter(c => !c.is_chaos).map((card, i) => (
            <motion.button key={`${card.id}-${i}`} whileTap={{ scale: 0.9 }} onClick={() => placeCard(card)}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-2 flex flex-col items-center gap-1 active:border-verde transition">
              <span className="text-2xl">{card.emoji}</span>
              <span className="text-xs font-body text-gray-600 text-center leading-tight">{card.name.split(' ')[0]}</span>
              <Badge color={card.color === 'vermelho' ? 'coral' : card.color === 'verde' ? 'verde' : card.color === 'amarelo' ? 'amarelo' : 'turquesa'} className="text-[10px] px-1.5">
                {card.rarity}
              </Badge>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}

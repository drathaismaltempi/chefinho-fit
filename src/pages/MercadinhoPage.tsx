import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'
import { usePointsStore } from '../store/usePointsStore'
import type { ShopItem } from '../types'

const SHOP_ITEMS: ShopItem[] = [
  { id: '1', name: 'Avental do Herói', emoji: '👨‍🍳', description: 'Visual especial para seu avatar', price_points: 50, type: 'cosmetic' },
  { id: '2', name: 'Chapéu de Chef Dourado', emoji: '🎩', description: 'Chapéu raro para os mais dedicados', price_points: 100, type: 'cosmetic' },
  { id: '3', name: 'Espátula Mágica', emoji: '🪄', description: '+1 Força Vitamínica por 7 dias', price_points: 75, type: 'booster' },
  { id: '4', name: 'Boost de Energia', emoji: '⚡', description: '+2 Energia nas próximas 5 batalhas', price_points: 60, type: 'booster' },
  { id: '5', name: 'Moldura Frutas', emoji: '🍓', description: 'Moldura especial para suas cartas', price_points: 40, type: 'cosmetic' },
  { id: '6', name: 'Super Vitamina', emoji: '💊', description: '+5 Fator Saúde por 3 dias', price_points: 90, type: 'booster' },
]

export function MercadinhoPage() {
  const { total_points, addPoints } = usePointsStore()
  const [selected, setSelected] = useState<ShopItem | null>(null)
  const [purchased, setPurchased] = useState<string[]>([])

  const handleBuy = () => {
    if (!selected) return
    addPoints(-selected.price_points)
    setPurchased(p => [...p, selected.id])
    setSelected(null)
  }

  return (
    <div className="px-4 py-4 flex flex-col gap-4">
      <div>
        <h2 className="font-title font-bold text-xl text-gray-800">Mercadinho do Bem 🛍️</h2>
        <p className="font-body text-sm text-gray-500">Troque seus pontos por itens especiais</p>
      </div>

      <Card className="bg-amarelo border-0 flex items-center justify-between">
        <div>
          <p className="font-body text-xs text-gray-600">Seus pontos</p>
          <p className="font-title font-bold text-2xl text-gray-800">⭐ {total_points}</p>
        </div>
        <p className="text-4xl">💰</p>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        {SHOP_ITEMS.map((item, i) => {
          const owned = purchased.includes(item.id)
          const canAfford = total_points >= item.price_points
          return (
            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Card padding="sm" className={`flex flex-col gap-2 ${owned ? 'opacity-60' : ''}`}>
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{item.emoji}</span>
                  <Badge color={item.type === 'booster' ? 'turquesa' : 'coral'}>
                    {item.type === 'booster' ? 'Booster' : 'Visual'}
                  </Badge>
                </div>
                <div>
                  <p className="font-title font-bold text-sm text-gray-800">{item.name}</p>
                  <p className="font-body text-xs text-gray-500">{item.description}</p>
                </div>
                <Button
                  size="sm" fullWidth
                  variant={owned ? 'ghost' : canAfford ? 'primary' : 'ghost'}
                  disabled={owned || !canAfford}
                  onClick={() => setSelected(item)}
                >
                  {owned ? 'Adquirido ✓' : `⭐ ${item.price_points} pts`}
                </Button>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Confirmar compra">
        {selected && (
          <div className="flex flex-col gap-4 text-center">
            <span className="text-6xl">{selected.emoji}</span>
            <div>
              <h3 className="font-title font-bold text-gray-800">{selected.name}</h3>
              <p className="font-body text-sm text-gray-500 mt-1">{selected.description}</p>
            </div>
            <div className="bg-amarelo rounded-xl p-3">
              <p className="font-title font-bold text-gray-800">Custo: ⭐ {selected.price_points} pts</p>
              <p className="text-xs text-gray-600">Saldo após: {total_points - selected.price_points} pts</p>
            </div>
            <Button onClick={handleBuy} variant="secondary" fullWidth>Comprar agora!</Button>
          </div>
        )}
      </Modal>
    </div>
  )
}

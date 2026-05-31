import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBattleStore } from '../../store/useBattleStore'
import { usePointsStore } from '../../store/usePointsStore'
import { useMapStore } from '../../store/useMapStore'
import { ATTRIBUTE_LABELS, ATTRIBUTE_INVERTED, type BattleAttribute, type FoodCard } from '../../types'
import { HEALTHY_CARDS } from '../../data/foodCards'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Shield, Swords } from 'lucide-react'

const CARD_COLOR_BG: Record<string, string> = {
  verde: 'from-green-400 to-emerald-500',
  laranja: 'from-orange-400 to-amber-500',
  azul: 'from-blue-400 to-cyan-500',
  amarelo: 'from-yellow-300 to-amber-400',
  vermelho: 'from-red-400 to-rose-500',
}

function NutritionCard({ card, selected, onClick, flip }: { card: FoodCard; selected?: boolean; onClick?: () => void; flip?: boolean }) {
  return (
    <motion.button
      className={`relative w-full max-w-[160px] aspect-[3/4] rounded-2xl overflow-hidden shadow-lg transition-all ${selected ? 'ring-4 ring-coral ring-offset-2' : ''} ${onClick ? 'cursor-pointer active:scale-95' : 'cursor-default'}`}
      onClick={onClick}
      whileHover={onClick ? { y: -4 } : {}}
      whileTap={onClick ? { scale: 0.95 } : {}}
      animate={flip ? { rotateY: [0, 180, 0] } : {}}
      transition={{ duration: 0.6 }}
    >
      <div className={`absolute inset-0 bg-gradient-to-b ${CARD_COLOR_BG[card.color] ?? 'from-gray-400 to-gray-600'}`} />
      <div className="relative z-10 h-full flex flex-col p-2.5">
        <div className="text-center mb-1">
          <p className="font-title font-bold text-white text-xs truncate">{card.name}</p>
          {card.is_chaos && <Badge color="coral" className="text-[9px]">CAOS</Badge>}
        </div>
        <div className="flex-1 flex items-center justify-center">
          <span className="text-5xl">{card.emoji}</span>
        </div>
        <div className="flex flex-col gap-0.5 mt-1">
          {(Object.entries(card.attributes) as [BattleAttribute, number][]).map(([attr, val]) => (
            <div key={attr} className="flex items-center justify-between">
              <span className="text-[9px] text-white/80 font-body truncate">{ATTRIBUTE_LABELS[attr].split(' ')[1]}</span>
              <span className={`text-[10px] font-title font-bold ${ATTRIBUTE_INVERTED[attr] ? 'text-red-200' : 'text-white'}`}>{val}</span>
            </div>
          ))}
        </div>
        <p className="text-[9px] text-white/70 font-body text-center mt-1 italic leading-tight">"{card.voice_line}"</p>
      </div>
    </motion.button>
  )
}

export function BattlePage() {
  const { session, selectedCard, startBattle, selectCard, selectAttribute, nextRound, resetBattle } = useBattleStore()
  const { addPoints } = usePointsStore()
  const { inventory } = useMapStore()
  const [pointsAwarded, setPointsAwarded] = useState(false)
  const [, setFlipAI] = useState(false)

  const playerCards = inventory.length >= 3 ? inventory.slice(0, 5) : HEALTHY_CARDS.slice(0, 5)

  const handleStart = () => startBattle(playerCards)

  const handleSelectAttr = (attr: BattleAttribute) => {
    setFlipAI(true)
    setTimeout(() => setFlipAI(false), 700)
    selectAttribute(attr)
  }

  useEffect(() => {
    if (session?.phase === 'battle-result' && !pointsAwarded) {
      const pts = session.outcome === 'victory' ? 20 : session.outcome === 'draw' ? 10 : 5
      addPoints(pts)
      setPointsAwarded(true)
    }
  }, [session?.phase])

  const handleReset = () => { resetBattle(); setPointsAwarded(false) }

  if (!session) {
    return (
      <div className="px-4 py-4 flex flex-col gap-4">
        <div>
          <h2 className="font-title font-bold text-xl text-gray-800">Batalha de Pratos ⚔️</h2>
          <p className="font-body text-sm text-gray-500">Super Trunfo Nutricional — você vs. Chef do Caos</p>
        </div>
        <Card className="bg-gradient-to-br from-coral to-rose-400 border-0 text-white text-center">
          <p className="text-5xl mb-3">⚔️</p>
          <h3 className="font-title font-bold text-xl">Pronto para batalhar?</h3>
          <p className="font-body text-sm opacity-90 mt-1">Escolha um atributo para vencer cada rodada. Ganhe 2 de 3 rodadas!</p>
          <Button className="mt-4 bg-white text-coral border-0 hover:bg-gray-50 w-full" onClick={handleStart}>
            Começar Batalha! 🃏
          </Button>
        </Card>
        <div className="flex flex-col gap-2">
          <p className="font-title font-semibold text-gray-700">Suas cartas</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {playerCards.map(c => <NutritionCard key={c.id} card={c} />)}
          </div>
        </div>
        <Card padding="sm" className="bg-amarelo border-0">
          <p className="font-title font-semibold text-sm text-gray-800 mb-1">Como jogar?</p>
          <ul className="text-xs font-body text-gray-700 flex flex-col gap-0.5">
            <li>1. Escolha uma carta da sua mão</li>
            <li>2. Escolha qual atributo comparar</li>
            <li>3. Quem tiver o valor maior, vence a rodada</li>
            <li>4. ⚠️ Gordura Ruim: quanto menor, melhor!</li>
            <li>5. Vença 2 de 3 rodadas para ganhar (+20 pts)</li>
          </ul>
        </Card>
      </div>
    )
  }

  const lastRound = session.rounds[session.rounds.length - 1]

  return (
    <div className="px-4 py-4 flex flex-col gap-3">
      {/* Score */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield size={20} className="text-turquesa" />
          <span className="font-title font-bold text-turquesa text-lg">{session.player_wins}</span>
          <span className="text-gray-400">vs</span>
          <span className="font-title font-bold text-coral text-lg">{session.ai_wins}</span>
          <Swords size={20} className="text-coral" />
        </div>
        <Badge color="gray">Rodada {session.rounds.length + (session.phase === 'battle-result' ? 0 : 1)} / 3</Badge>
        <button onClick={handleReset} className="text-xs text-gray-400 underline">Sair</button>
      </div>

      {/* Battle Result */}
      {session.phase === 'battle-result' && (
        <AnimatePresence>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center gap-4 py-6">
            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
              <span className="text-7xl">
                {session.outcome === 'victory' ? '🏆' : session.outcome === 'draw' ? '🤝' : '😢'}
              </span>
            </motion.div>
            <h2 className="font-title font-bold text-2xl text-gray-800">
              {session.outcome === 'victory' ? 'Vitória!' : session.outcome === 'draw' ? 'Empate!' : 'Derrota...'}
            </h2>
            <p className="font-body text-gray-500 text-center">
              {session.outcome === 'victory' ? 'Seu prato venceu pelo sabor e pela ciência! +20 pts' : session.outcome === 'draw' ? 'Batalha equilibrada! +10 pts' : 'O Chef do Caos venceu desta vez... +5 pts'}
            </p>
            <Button onClick={handleReset} variant="secondary">Jogar novamente!</Button>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Round Result */}
      {session.phase === 'round-result' && lastRound && (
        <Card className={lastRound.winner === 'player' ? 'bg-verde/20 border-verde' : lastRound.winner === 'ai' ? 'bg-coral/20 border-coral' : 'bg-gray-100'}>
          <div className="flex justify-around items-center">
            <div className="text-center">
              <p className="text-3xl">{lastRound.player_card.emoji}</p>
              <p className="font-title font-bold text-sm text-turquesa">{lastRound.player_value}</p>
              <p className="text-xs text-gray-500">Você</p>
            </div>
            <div className="text-center">
              <p className="font-title font-bold text-lg">
                {lastRound.winner === 'player' ? '🎉 Ganhou!' : lastRound.winner === 'ai' ? '😢 Perdeu' : '🤝 Empate'}
              </p>
              <p className="text-xs text-gray-500">{ATTRIBUTE_LABELS[lastRound.chosen_attribute]}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl">{lastRound.ai_card.emoji}</p>
              <p className="font-title font-bold text-sm text-coral">{lastRound.ai_value}</p>
              <p className="text-xs text-gray-500">Chef Caos</p>
            </div>
          </div>
          <Button fullWidth className="mt-3" onClick={nextRound}>Próxima rodada!</Button>
        </Card>
      )}

      {/* Hand */}
      {(session.phase === 'selecting-card' || session.phase === 'selecting-attribute') && (
        <>
          <p className="font-title font-semibold text-sm text-gray-700">
            {session.phase === 'selecting-card' ? 'Escolha sua carta:' : 'Escolha o atributo:'}
          </p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {session.player_hand.map(c => (
              <div key={c.id} className="flex-shrink-0">
                <NutritionCard card={c} selected={selectedCard?.id === c.id}
                  onClick={session.phase === 'selecting-card' ? () => selectCard(c) : undefined} />
              </div>
            ))}
          </div>

          {session.phase === 'selecting-attribute' && selectedCard && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="bg-amarelo border-0">
                <p className="font-title font-semibold text-sm text-gray-800 mb-2">Qual atributo você escolhe?</p>
                <div className="grid grid-cols-1 gap-2">
                  {(Object.keys(ATTRIBUTE_LABELS) as BattleAttribute[]).map(attr => (
                    <button key={attr} onClick={() => handleSelectAttr(attr)}
                      className="flex items-center justify-between bg-white rounded-xl px-3 py-2.5 border-2 border-transparent hover:border-coral active:scale-95 transition">
                      <span className="font-title font-semibold text-sm text-gray-800">{ATTRIBUTE_LABELS[attr]}</span>
                      <div className="flex items-center gap-2">
                        {ATTRIBUTE_INVERTED[attr] && <span className="text-xs text-gray-400">(menor = melhor)</span>}
                        <span className="font-title font-bold text-coral text-lg">{selectedCard.attributes[attr]}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}
        </>
      )}
    </div>
  )
}

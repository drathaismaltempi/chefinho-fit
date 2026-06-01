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
  verde: 'from-lime-300 via-green-400 to-emerald-500',
  laranja: 'from-orange-300 via-orange-400 to-amber-500',
  azul: 'from-sky-300 via-blue-400 to-cyan-500',
  amarelo: 'from-yellow-200 via-yellow-300 to-amber-400',
  vermelho: 'from-rose-300 via-red-400 to-rose-600',
}

const CARD_BORDER: Record<string, string> = {
  verde: 'border-green-200',
  laranja: 'border-orange-200',
  azul: 'border-sky-200',
  amarelo: 'border-yellow-200',
  vermelho: 'border-rose-200',
}

const ATTR_EMOJI: Record<BattleAttribute, string> = {
  energia: '⚡',
  valor_biologico: '🧬',
  forca_vitaminica: '💪',
  fator_saude: '❤️',
  gordura_ruim: '☠️',
}

const RARITY_GLOW: Record<string, string> = {
  comum: '',
  raro: 'shadow-[0_0_20px_rgba(74,192,192,0.6)]',
  lendario: 'shadow-[0_0_25px_rgba(255,193,7,0.8)]',
}

function AttrBar({ attr, val }: { attr: BattleAttribute; val: number }) {
  const inverted = ATTRIBUTE_INVERTED[attr]
  // For gordura_ruim, fill represents "how bad" (red); for others, fill is good (white/bright)
  const pct = Math.min(100, val)
  return (
    <div className="flex items-center gap-1">
      <span className="text-[11px] leading-none w-3.5 text-center drop-shadow">{ATTR_EMOJI[attr]}</span>
      <div className="flex-1 h-2.5 rounded-full bg-black/25 overflow-hidden">
        <div
          className={`h-full rounded-full ${inverted ? 'bg-red-300' : 'bg-white'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[10px] font-title font-extrabold text-white w-5 text-right drop-shadow">{val}</span>
    </div>
  )
}

function NutritionCard({ card, selected, onClick, flip }: { card: FoodCard; selected?: boolean; onClick?: () => void; flip?: boolean }) {
  return (
    <motion.button
      className={`relative w-full max-w-[170px] aspect-[3/4] rounded-3xl overflow-hidden border-4 ${CARD_BORDER[card.color] ?? 'border-gray-200'} ${RARITY_GLOW[card.rarity] ?? ''} shadow-xl transition-all ${selected ? 'ring-4 ring-coral ring-offset-2' : ''} ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
      onClick={onClick}
      whileHover={onClick ? { y: -6, scale: 1.03 } : {}}
      whileTap={onClick ? { scale: 0.94 } : {}}
      animate={flip ? { rotateY: [0, 180, 0] } : {}}
      transition={{ duration: 0.6 }}
    >
      {/* Fundo gradiente vibrante */}
      <div className={`absolute inset-0 bg-gradient-to-br ${CARD_COLOR_BG[card.color] ?? 'from-gray-400 to-gray-600'}`} />
      {/* Brilho radial atrás do personagem */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(255,255,255,0.55),transparent_55%)]" />
      {/* Estrelinha de raridade */}
      {card.rarity !== 'comum' && (
        <div className="absolute top-1.5 right-2 z-20 text-sm drop-shadow">
          {card.rarity === 'lendario' ? '🌟' : '✨'}
        </div>
      )}

      <div className="relative z-10 h-full flex flex-col p-2.5">
        {/* Nome no topo numa faixa */}
        <div className="bg-white/90 rounded-full px-2 py-1 mb-1 shadow-sm">
          <p className="font-title font-extrabold text-gray-800 text-[11px] text-center truncate leading-tight">{card.name}</p>
        </div>

        {/* Personagem grande com sombrinha */}
        <div className="flex-1 flex items-center justify-center relative">
          {card.is_chaos && (
            <span className="absolute top-0 left-0 bg-red-600 text-white text-[8px] font-title font-bold px-1.5 py-0.5 rounded-full rotate-[-12deg] shadow">CAOS!</span>
          )}
          <motion.span
            className="text-[64px] drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)]"
            animate={{ y: [0, -4, 0], rotate: [0, -3, 3, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            {card.emoji}
          </motion.span>
        </div>

        {/* Atributos em barras coloridas */}
        <div className="bg-black/15 rounded-2xl p-1.5 flex flex-col gap-1 backdrop-blur-sm">
          {(Object.entries(card.attributes) as [BattleAttribute, number][]).map(([attr, val]) => (
            <AttrBar key={attr} attr={attr} val={val} />
          ))}
        </div>
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
              <Card className="bg-gradient-to-br from-amarelo to-yellow-200 border-0">
                <p className="font-title font-bold text-base text-gray-800 mb-2 text-center">⚔️ Qual poder você escolhe?</p>
                <div className="grid grid-cols-1 gap-2">
                  {(Object.keys(ATTRIBUTE_LABELS) as BattleAttribute[]).map((attr, i) => {
                    const colors = ['bg-coral', 'bg-turquesa', 'bg-verde', 'bg-pink-400', 'bg-purple-400']
                    return (
                      <motion.button key={attr} onClick={() => handleSelectAttr(attr)}
                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center justify-between bg-white rounded-2xl px-3 py-2.5 border-2 border-transparent hover:border-coral active:scale-95 transition shadow-sm">
                        <span className="font-title font-bold text-sm text-gray-800">{ATTRIBUTE_LABELS[attr]}</span>
                        <div className="flex items-center gap-2">
                          {ATTRIBUTE_INVERTED[attr] && <span className="text-[10px] text-gray-400">(menor vence!)</span>}
                          <span className={`font-title font-extrabold text-white text-base ${colors[i]} rounded-full w-9 h-9 flex items-center justify-center shadow`}>{selectedCard.attributes[attr]}</span>
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              </Card>
            </motion.div>
          )}
        </>
      )}
    </div>
  )
}

import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'

export function FamiliaPage() {
  const navigate = useNavigate()
  const hasChild = !!localStorage.getItem('chefinho-child')
  const hasPlan = !!localStorage.getItem('chefinho-meal-plan')

  return (
    <div className="px-4 py-4 flex flex-col gap-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-title font-bold text-2xl text-gray-800">Modo Família 🍳</h2>
        <p className="text-gray-500 text-sm mt-0.5">Cardápios saudáveis feitos com o que você tem</p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <Card className="bg-gradient-to-br from-verde to-lime-300 border-0 text-gray-800">
          <p className="text-3xl mb-2">🧺</p>
          <h3 className="font-title font-bold text-lg">Cardápio Personalizado</h3>
          <p className="font-body text-sm mt-1 opacity-80">Com base na despensa, rotina e preferências do seu Chefinho</p>
          <div className="mt-4 flex flex-col gap-2">
            {hasPlan && (
              <Button variant="ghost" onClick={() => navigate('/familia/plano')} className="bg-white/80 border-0">
                Ver Cardápio Atual 🍽️
              </Button>
            )}
            <Button onClick={() => navigate('/familia/onboarding')} className="bg-white/90 text-gray-800 border-0 hover:bg-white">
              {hasChild ? 'Criar Novo Cardápio' : 'Começar Agora'} ✨
            </Button>
          </div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { emoji: '🥗', title: 'Refeições Balanceadas', desc: '3 a 6 refeições por dia' },
          { emoji: '💩', title: 'Saúde Intestinal', desc: 'Cardápio adaptado ao intestino' },
          { emoji: '🚫', title: 'Sem Alergias', desc: 'Receitas livres de intolerâncias' },
          { emoji: '🏆', title: 'Metas Semanais', desc: 'Ganhe medalhas cumprindo metas' },
        ].map(f => (
          <Card key={f.title} padding="sm" className="flex flex-col gap-1">
            <p className="text-2xl">{f.emoji}</p>
            <p className="font-title font-bold text-sm text-gray-800">{f.title}</p>
            <p className="font-body text-xs text-gray-500">{f.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}

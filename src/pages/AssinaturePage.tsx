import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, Star, Zap } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { useSubscriptionStore } from '../store/useSubscriptionStore'
import { useAuthStore } from '../store/useAuthStore'

// Substituir pela URL real do checkout Hotmart após cadastrar o produto
const HOTMART_CHECKOUT_URL = 'https://pay.hotmart.com/SEU-PRODUTO-AQUI'

const FREE_FEATURES = [
  '1 cardápio personalizado por IA por mês',
  'Modo Aventura completo (mapa, batalhas, cozinha)',
  '1 perfil de criança',
]

const PLUS_FEATURES = [
  'Cardápios ilimitados com IA toda semana',
  'Modo Aventura completo (mapa, batalhas, cozinha)',
  'Até 3 perfis de crianças',
  'Histórico de cardápios anteriores',
  'Lista de compras personalizada',
  'Suporte prioritário por e-mail',
]

export function AssinaturePage() {
  const navigate = useNavigate()
  const { plan, aiMealsUsed, aiMealsLimit } = useSubscriptionStore()
  const { profile } = useAuthStore()

  const isPlus = plan === 'plus'

  function handleAssinar() {
    const email = profile?.email ?? ''
    const url = email
      ? `${HOTMART_CHECKOUT_URL}?email=${encodeURIComponent(email)}`
      : HOTMART_CHECKOUT_URL
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="px-4 py-4 flex flex-col gap-5">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral rounded w-fit"
        aria-label="Voltar"
      >
        <ArrowLeft size={16} /> Voltar
      </button>

      {/* Cabeçalho */}
      <div className="text-center">
        <span className="text-5xl">⭐</span>
        <h1 className="font-title font-bold text-2xl text-gray-800 mt-2">Chefinho Plus</h1>
        <p className="font-body text-sm text-gray-500 mt-1">
          Cardápios ilimitados para a família toda
        </p>
      </div>

      {/* Status atual */}
      {!isPlus && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 font-body text-sm text-gray-700">
          <p>
            Plano atual: <strong>Gratuito</strong> — você usou{' '}
            <strong>{aiMealsUsed}/{aiMealsLimit}</strong> cardápio(s) por IA este mês.
          </p>
          {aiMealsUsed >= aiMealsLimit && (
            <p className="mt-1 text-amber-700 font-semibold">
              Limite atingido! Assine para gerar quantos quiser. 🚀
            </p>
          )}
        </div>
      )}

      {isPlus && (
        <div className="bg-verde/20 border border-verde rounded-2xl px-4 py-3 flex items-center gap-2 font-body text-sm text-gray-700">
          <Star size={16} className="text-verde fill-verde flex-shrink-0" />
          <p>Você já é assinante <strong>Chefinho Plus</strong>! 🎉</p>
        </div>
      )}

      {/* Preço */}
      {!isPlus && (
        <div className="bg-gradient-to-br from-coral to-pink-500 rounded-2xl p-5 text-white text-center">
          <p className="font-body text-sm opacity-90">Apenas</p>
          <p className="font-title font-bold text-4xl mt-1">R$19,90</p>
          <p className="font-body text-sm opacity-90">por mês · cancele quando quiser</p>
          <p className="font-body text-xs opacity-75 mt-1">ou R$149/ano (economize 38%)</p>
        </div>
      )}

      {/* Comparativo */}
      <div className="flex flex-col gap-3">
        <h2 className="font-title font-bold text-gray-800">O que está incluído</h2>

        <div className="border-2 border-gray-200 rounded-2xl p-4 flex flex-col gap-2">
          <p className="font-title font-semibold text-sm text-gray-500">Gratuito</p>
          {FREE_FEATURES.map(f => (
            <div key={f} className="flex items-start gap-2">
              <Check size={15} className="text-gray-400 mt-0.5 flex-shrink-0" />
              <p className="font-body text-sm text-gray-600">{f}</p>
            </div>
          ))}
        </div>

        <div className="border-2 border-coral rounded-2xl p-4 flex flex-col gap-2 relative overflow-hidden">
          <div className="absolute top-3 right-3 bg-coral text-white text-xs font-title font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Zap size={10} /> PLUS
          </div>
          <p className="font-title font-semibold text-sm text-coral">Chefinho Plus</p>
          {PLUS_FEATURES.map(f => (
            <div key={f} className="flex items-start gap-2">
              <Check size={15} className="text-coral mt-0.5 flex-shrink-0" />
              <p className="font-body text-sm text-gray-700">{f}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      {!isPlus && (
        <div className="flex flex-col gap-2">
          <Button fullWidth onClick={handleAssinar} className="text-base py-4">
            Assinar Chefinho Plus ⭐
          </Button>
          <p className="font-body text-xs text-center text-gray-400">
            Pagamento seguro via Hotmart · PIX, cartão ou boleto
          </p>
        </div>
      )}

      {isPlus && (
        <Button fullWidth variant="ghost" onClick={() => navigate('/')}>
          Voltar ao início
        </Button>
      )}

      <p className="font-body text-xs text-center text-gray-400 pb-2">
        Dúvidas?{' '}
        <a
          href="mailto:drathaispreconsulta@gmail.com"
          className="text-coral underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral rounded"
        >
          Entre em contato
        </a>
      </p>
    </div>
  )
}

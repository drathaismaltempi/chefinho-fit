import { useState, useEffect } from 'react'
import { useNavigate, Link, Navigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import { useSubscriptionStore } from '../../store/useSubscriptionStore'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../../components/ui/Button'
import { Input, Textarea } from '../../components/ui/Input'
import { parsePantry } from '../../services/pantryParser'
import { PANTRY_CATEGORY_LABELS, type Child, type PantryItemCategory } from '../../types'
import { generateMealPlan, enhanceMealPlanWithAI } from '../../services/mealPlanGenerator'
import { ChevronRight, ChevronLeft } from 'lucide-react'

const TOTAL_STEPS = 8

const LOADING_MESSAGES = [
  'Analisando a despensa... 🥕',
  'Montando receitas nutritivas... 👨‍🍳',
  'Calculando porções ideais... ⚖️',
  'Escolhendo combinações gostosas... 😋',
  'Quase pronto! ✨',
]

type FormData = Omit<Child, 'id' | 'owner_id' | 'pantry_parsed'>

const INITIAL: FormData = {
  name: '', age: 8, sex: 'M', weight_kg: 30, height_cm: 130,
  meals_per_day: 5, meal_schedule: ['07:00', '10:00', '12:30', '15:30', '19:00'],
  activity_level: 'moderado', gut_health: 'normal',
  allergies: [], food_preferences: [], food_dislikes: [],
  cookware: [], pantry_raw: '',
}

const COOKWARE_OPTIONS = ['Fogão', 'Forno', 'Airfryer', 'Micro-ondas', 'Frigideira', 'Panela elétrica', 'Liquidificador']
const ALLERGY_OPTIONS = ['Glúten', 'Lactose', 'Ovo', 'Amendoim', 'Frutos do mar', 'Soja', 'Nozes']

function loadSavedForm(): FormData {
  try {
    const saved = localStorage.getItem('chefinho-child')
    if (!saved) return INITIAL
    const child = JSON.parse(saved) as Child
    // Map Child back to FormData (omit id, owner_id, pantry_parsed)
    const { id: _id, owner_id: _o, pantry_parsed: _pp, ...formData } = child
    return formData as FormData
  } catch {
    return INITIAL
  }
}

function hasConsented(): boolean {
  return !!localStorage.getItem('chefinho-consent')
}

function ConsentGate({ onAccept }: { onAccept: () => void }) {
  const [checked, setChecked] = useState(false)

  function accept() {
    localStorage.setItem('chefinho-consent', new Date().toISOString())
    onAccept()
  }

  return (
    <div className="px-4 py-6 flex flex-col gap-5">
      <div>
        <h1 className="font-title font-bold text-2xl text-gray-800">Antes de começar 👋</h1>
        <p className="font-body text-sm text-gray-500 mt-1">Leia com atenção, responsável</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col gap-3 font-body text-sm text-gray-700">
        <p>O Chefinho Fit coleta informações da criança (nome, idade, peso, altura, alergias e preferências) para gerar um cardápio semanal personalizado com inteligência artificial.</p>
        <p>Esses dados ficam salvos <strong>no seu dispositivo</strong>. Ao gerar o cardápio, o perfil é enviado de forma segura (HTTPS) ao nosso servidor apenas para processar a resposta da IA — sem armazenamento permanente.</p>
        <p><strong>Não vendemos nem compartilhamos seus dados.</strong> Não usamos rastreadores ou publicidade.</p>
        <p>
          Leia nossa{' '}
          <Link to="/privacidade" className="text-coral underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral rounded">
            Política de Privacidade
          </Link>{' '}
          e nossos{' '}
          <Link to="/termos" className="text-coral underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral rounded">
            Termos de Uso
          </Link>
          .
        </p>
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={e => setChecked(e.target.checked)}
          className="mt-0.5 w-4 h-4 accent-coral"
          aria-label="Confirmar consentimento parental"
        />
        <span className="font-body text-sm text-gray-700">
          Confirmo que sou o <strong>responsável legal</strong> desta criança e concordo com a coleta e uso dos dados conforme descrito acima.
        </span>
      </label>

      <Button fullWidth onClick={accept} disabled={!checked}>
        Continuar →
      </Button>
    </div>
  )
}

export function OnboardingPage() {
  const navigate = useNavigate()
  const { user, token } = useAuthStore()
  const { aiMealsUsed, aiMealsLimit } = useSubscriptionStore()

  // Redireciona para login se não autenticado
  if (!user) return <Navigate to="/login?redirect=/familia/onboarding" replace />

  // Redireciona para paywall se limite atingido (exceto quem está editando perfil existente)
  const isEditing = !!localStorage.getItem('chefinho-child')
  if (!isEditing && aiMealsUsed >= aiMealsLimit) {
    return <Navigate to="/assinatura" replace />
  }

  const { plan: subPlan } = useSubscriptionStore()
  return <OnboardingForm token={token} isPlus={subPlan === 'plus'} navigate={navigate} />
}

function OnboardingForm({ token, isPlus, navigate }: { token: string | null; isPlus: boolean; navigate: ReturnType<typeof useNavigate> }) {
  const [consented, setConsented] = useState(hasConsented)
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormData>(loadSavedForm)
  const [tagInput, setTagInput] = useState('')
  const [pantryPreview, setPantryPreview] = useState<ReturnType<typeof parsePantry>>(
    () => form.pantry_raw ? parsePantry(form.pantry_raw) : []
  )
  const [isGenerating, setIsGenerating] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0])
  const isEditing = !!localStorage.getItem('chefinho-child')

  useEffect(() => {
    if (!isGenerating) return
    let i = 0
    const id = setInterval(() => {
      i = (i + 1) % LOADING_MESSAGES.length
      setLoadingMsg(LOADING_MESSAGES[i])
    }, 4000)
    return () => clearInterval(id)
  }, [isGenerating])

  if (!consented) {
    return <ConsentGate onAccept={() => setConsented(true)} />
  }

  const update = (field: keyof FormData, value: unknown) => setForm(f => ({ ...f, [field]: value }))
  const toggleArr = (field: 'allergies' | 'food_dislikes' | 'food_preferences' | 'cookware', val: string) => {
    const arr = form[field] as string[]
    update(field, arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val])
  }

  const handlePantryChange = (v: string) => {
    update('pantry_raw', v)
    if (v.length > 5) setPantryPreview(parsePantry(v))
  }

  const handleFinish = async () => {
    setIsGenerating(true)
    const parsed = parsePantry(form.pantry_raw)
    const existingChild = localStorage.getItem('chefinho-child')
    const existingId = existingChild ? JSON.parse(existingChild).id : `child-${Date.now()}`
    const child: Child = { ...form, id: existingId, owner_id: 'local', pantry_parsed: parsed }
    localStorage.setItem('chefinho-child', JSON.stringify(child))
    localStorage.removeItem('chefinho-meal-plan')
    const basePlan = generateMealPlan(child)
    const plan = await enhanceMealPlanWithAI(child, basePlan, token, isPlus)
    if ((plan as any).errorCode === 'limit_reached') {
      setIsGenerating(false)
      navigate('/assinatura')
      return
    }
    if ((plan as any).errorCode === 'login_required') {
      setIsGenerating(false)
      navigate('/login?redirect=/familia/onboarding')
      return
    }
    localStorage.setItem('chefinho-meal-plan', JSON.stringify(plan))
    setIsGenerating(false)
    navigate('/familia/plano')
  }

  return (
    <div className="px-4 py-4 flex flex-col gap-4 min-h-full">
      {/* Progress */}
      <div className="flex gap-1.5">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i < step ? 'bg-coral' : 'bg-gray-200'}`} />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400 font-body">Passo {step} de {TOTAL_STEPS}</p>
        {isEditing && <p className="text-xs text-turquesa font-body">✏️ Editando perfil de {form.name}</p>}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.2 }}>
          {step === 1 && (
            <StepCard title="Quem é o seu Chefinho? 👶" subtitle="Vamos conhecer melhor sua criança">
              <Input label="Nome" value={form.name} onChange={e => update('name', e.target.value)} placeholder="Nome da criança" />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Idade (anos)" type="number" value={form.age} onChange={e => update('age', +e.target.value)} min={1} max={18} />
                <div className="flex flex-col gap-1">
                  <label className="font-title font-semibold text-sm text-gray-700">Sexo</label>
                  <select className="rounded-xl border-2 border-gray-200 px-3 py-2.5 font-body text-gray-800 outline-none focus:border-turquesa" value={form.sex} onChange={e => update('sex', e.target.value)}>
                    <option value="M">Menino</option>
                    <option value="F">Menina</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Peso (kg)" type="number" value={form.weight_kg} onChange={e => update('weight_kg', +e.target.value)} min={5} max={150} />
                <Input label="Altura (cm)" type="number" value={form.height_cm} onChange={e => update('height_cm', +e.target.value)} min={50} max={220} />
              </div>
            </StepCard>
          )}
          {step === 2 && (
            <StepCard title="Rotina alimentar 🕐" subtitle="Quantas refeições por dia?">
              <div className="flex flex-col gap-1">
                <label className="font-title font-semibold text-sm text-gray-700">Refeições por dia: <strong>{form.meals_per_day}</strong></label>
                <input type="range" min={3} max={6} value={form.meals_per_day} onChange={e => update('meals_per_day', +e.target.value)} className="accent-coral" />
                <div className="flex justify-between text-xs text-gray-400"><span>3</span><span>6</span></div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-title font-semibold text-sm text-gray-700">Horários das refeições</label>
                {form.meal_schedule.slice(0, form.meals_per_day).map((t, i) => (
                  <input key={i} type="time" value={t} onChange={e => {
                    const s = [...form.meal_schedule]; s[i] = e.target.value; update('meal_schedule', s)
                  }} className="rounded-xl border-2 border-gray-200 px-3 py-2 font-body text-gray-800 outline-none focus:border-turquesa" />
                ))}
              </div>
            </StepCard>
          )}
          {step === 3 && (
            <StepCard title="Atividade física 🏃" subtitle="Como é a rotina de movimentos?">
              {(['sedentario', 'leve', 'moderado', 'ativo'] as const).map(level => (
                <button key={level} onClick={() => update('activity_level', level)}
                  className={`w-full rounded-xl border-2 px-4 py-3 text-left font-body transition ${form.activity_level === level ? 'border-coral bg-coral/10' : 'border-gray-200 bg-white'}`}>
                  <strong className="font-title">{({ sedentario: '😴 Sedentário', leve: '🚶 Leve', moderado: '🏃 Moderado', ativo: '⚡ Muito ativo' })[level]}</strong>
                  <p className="text-xs text-gray-500 mt-0.5">{({ sedentario: 'Pouca ou nenhuma atividade', leve: '1-2 dias de exercício/semana', moderado: '3-4 dias de exercício/semana', ativo: 'Exercita-se todos os dias' })[level]}</p>
                </button>
              ))}
            </StepCard>
          )}
          {step === 4 && (
            <StepCard title="Saúde intestinal 💩" subtitle="Como costuma ser o intestino?">
              {(['normal', 'constipado', 'diarreia', 'varia'] as const).map(h => (
                <button key={h} onClick={() => update('gut_health', h)}
                  className={`w-full rounded-xl border-2 px-4 py-3 text-left font-body transition ${form.gut_health === h ? 'border-coral bg-coral/10' : 'border-gray-200 bg-white'}`}>
                  {({ normal: '✅ Normal', constipado: '😣 Constipado (intestino preso)', diarreia: '💧 Diarreia frequente', varia: '🔄 Varia muito' })[h]}
                </button>
              ))}
            </StepCard>
          )}
          {step === 5 && (
            <StepCard title="Alergias e intolerâncias 🚫" subtitle="Selecione todas que se aplicam">
              <div className="flex flex-wrap gap-2">
                {ALLERGY_OPTIONS.map(a => (
                  <button key={a} onClick={() => toggleArr('allergies', a)}
                    className={`px-3 py-1.5 rounded-full border-2 text-sm font-body transition ${form.allergies.includes(a) ? 'border-coral bg-coral text-white' : 'border-gray-200 bg-white text-gray-700'}`}>
                    {a}
                  </button>
                ))}
              </div>
              <Input label="Outras alergias" placeholder="Digite e pressione Enter" value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && tagInput.trim()) { toggleArr('allergies', tagInput.trim()); setTagInput('') } }} />
              {form.allergies.length === 0 && <p className="text-sm text-gray-400 font-body">Nenhuma alergia selecionada</p>}
            </StepCard>
          )}
          {step === 6 && (
            <StepCard title="Gostos alimentares 😋" subtitle="O que a criança ama ou odeia?">
              <Textarea label="O que adora comer?" placeholder="Ex: frango, massa, banana, cenoura crua..." rows={3}
                value={form.food_preferences.join(', ')}
                onChange={e => update('food_preferences', e.target.value.split(',').map(x => x.trim()).filter(Boolean))} />
              <Textarea label="O que não gosta ou recusa?" placeholder="Ex: brócolis, peixe, tomate..." rows={3}
                value={form.food_dislikes.join(', ')}
                onChange={e => update('food_dislikes', e.target.value.split(',').map(x => x.trim()).filter(Boolean))} />
            </StepCard>
          )}
          {step === 7 && (
            <StepCard title="Utensílios disponíveis 🍳" subtitle="O que você tem para preparar as refeições?">
              <div className="flex flex-wrap gap-2">
                {COOKWARE_OPTIONS.map(c => (
                  <button key={c} onClick={() => toggleArr('cookware', c)}
                    className={`px-3 py-2 rounded-xl border-2 text-sm font-body transition ${form.cookware.includes(c) ? 'border-verde bg-verde text-gray-800' : 'border-gray-200 bg-white text-gray-700'}`}>
                    {c}
                  </button>
                ))}
              </div>
            </StepCard>
          )}
          {step === 8 && (
            <StepCard title="O que tem na despensa? 🧺" subtitle="Liste os ingredientes separados por vírgula">
              <Textarea
                label="Ingredientes disponíveis"
                placeholder="Ex: ovos, frango, banana, arroz, cenoura, azeite, iogurte..."
                rows={5}
                value={form.pantry_raw}
                onChange={e => handlePantryChange(e.target.value)}
              />
              {pantryPreview.length > 0 && (
                <div className="flex flex-col gap-2 mt-2">
                  <p className="font-title font-semibold text-sm text-gray-700">Encontrei estes itens:</p>
                  {pantryPreview.map(cat => (
                    <div key={cat.category} className="flex flex-col gap-1">
                      <p className="text-xs font-title font-semibold text-gray-500">{PANTRY_CATEGORY_LABELS[cat.category as PantryItemCategory]}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.items.map(item => (
                          <span key={item} className="bg-gray-100 px-2 py-0.5 rounded-full text-xs font-body text-gray-700">{item}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </StepCard>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex gap-3 mt-auto pt-4">
        {step > 1 && (
          <Button variant="ghost" onClick={() => setStep(s => s - 1)} className="flex items-center gap-1">
            <ChevronLeft size={16} /> Voltar
          </Button>
        )}
        {step < TOTAL_STEPS ? (
          <Button fullWidth onClick={() => setStep(s => s + 1)} className="flex items-center justify-center gap-1">
            Próximo <ChevronRight size={16} />
          </Button>
        ) : (
          <Button fullWidth variant="secondary" onClick={handleFinish} disabled={isGenerating}>
            {isGenerating ? loadingMsg : 'Gerar Cardápio com IA 🍽️'}
          </Button>
        )}
      </div>
    </div>
  )
}

function StepCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="font-title font-bold text-xl text-gray-800">{title}</h2>
        {subtitle && <p className="font-body text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'

export function LoginPage() {
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get('redirect') ?? '/familia'

  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}${redirect}`,
      },
    })

    setLoading(false)

    if (authError) {
      setError('Não foi possível enviar o e-mail. Tente novamente.')
      return
    }

    setSent(true)
  }

  if (sent) {
    return (
      <div className="px-6 py-10 flex flex-col items-center gap-5 text-center">
        <span className="text-6xl">📬</span>
        <div>
          <h1 className="font-title font-bold text-2xl text-gray-800">Verifique seu e-mail!</h1>
          <p className="font-body text-sm text-gray-500 mt-2">
            Enviamos um link de acesso para <strong>{email}</strong>.<br />
            Clique no link e você entrará automaticamente.
          </p>
        </div>
        <p className="font-body text-xs text-gray-400">
          Não recebeu? Verifique a pasta de spam ou{' '}
          <button
            onClick={() => setSent(false)}
            className="text-coral underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral rounded"
          >
            tente novamente
          </button>
          .
        </p>
      </div>
    )
  }

  return (
    <div className="px-6 py-8 flex flex-col gap-6 max-w-sm mx-auto">
      <div className="text-center">
        <span className="text-5xl">👨‍🍳</span>
        <h1 className="font-title font-bold text-2xl text-gray-800 mt-3">Entrar no Chefinho Fit</h1>
        <p className="font-body text-sm text-gray-500 mt-1">
          Digite seu e-mail e enviaremos um link de acesso — sem senha!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <Input
          label="Seu e-mail"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="voce@email.com"
          autoComplete="email"
          required
        />

        {error && (
          <p role="alert" className="text-sm text-red-500 font-body">{error}</p>
        )}

        <Button fullWidth type="submit" disabled={loading || !email.includes('@')}>
          {loading ? 'Enviando...' : 'Enviar link de acesso →'}
        </Button>
      </form>

      <p className="font-body text-xs text-center text-gray-400">
        Ao continuar você concorda com os{' '}
        <a href="/termos" className="text-coral underline">Termos de Uso</a>
        {' '}e a{' '}
        <a href="/privacidade" className="text-coral underline">Política de Privacidade</a>.
      </p>
    </div>
  )
}

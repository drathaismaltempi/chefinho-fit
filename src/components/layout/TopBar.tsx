import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { usePointsStore } from '../../store/usePointsStore'
import { useAuthStore } from '../../store/useAuthStore'
import { useSubscriptionStore } from '../../store/useSubscriptionStore'
import { Star, MoreVertical, X, LogIn, LogOut } from 'lucide-react'

export function TopBar() {
  const { total_points, level } = usePointsStore()
  const { user, logout } = useAuthStore()
  const { plan } = useSubscriptionStore()
  const navigate = useNavigate()

  const [menuOpen, setMenuOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  async function handleDeleteData() {
    localStorage.clear()
    await logout()
    setConfirmDelete(false)
    setMenuOpen(false)
    window.location.href = '/'
  }

  async function handleLogout() {
    await logout()
    setMenuOpen(false)
    navigate('/')
  }

  return (
    <header
      className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-lg z-30 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between"
      role="banner"
    >
      <Link
        to="/"
        className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral rounded"
        aria-label="Chefinho Fit — página inicial"
      >
        <span aria-hidden="true" className="text-2xl">👨‍🍳</span>
        <div>
          <p className="font-title font-bold text-coral text-base leading-none">Chefinho Fit</p>
          <p className="text-xs text-gray-400">{level}</p>
        </div>
      </Link>

      <div className="flex items-center gap-2">
        {/* Pontuação */}
        <div
          className="flex items-center gap-1.5 bg-amarelo px-3 py-1.5 rounded-full"
          aria-label={`${total_points} pontos`}
        >
          <Star size={14} className="text-yellow-500 fill-yellow-500" aria-hidden="true" />
          <span className="font-title font-bold text-gray-800 text-sm" aria-hidden="true">{total_points} pts</span>
        </div>

        {/* Botão login rápido (se não logado) */}
        {!user && (
          <Link
            to="/login"
            className="flex items-center gap-1 bg-coral text-white text-xs font-title font-bold px-3 py-1.5 rounded-full hover:bg-coral/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
            aria-label="Entrar"
          >
            <LogIn size={12} aria-hidden="true" /> Entrar
          </Link>
        )}

        {/* Menu configurações */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="p-1.5 rounded-full hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
            aria-label="Abrir menu de configurações"
            aria-expanded={menuOpen}
            aria-haspopup="menu"
          >
            <MoreVertical size={18} className="text-gray-500" aria-hidden="true" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} aria-hidden="true" />
              <nav
                role="menu"
                aria-label="Opções"
                className="absolute right-0 top-9 z-20 bg-white border border-gray-200 rounded-xl shadow-lg py-1 min-w-[190px]"
              >
                {user && (
                  <>
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs font-body text-gray-400 truncate">{user.email}</p>
                      {plan === 'plus' && (
                        <p className="text-xs font-title font-bold text-coral mt-0.5">⭐ Chefinho Plus</p>
                      )}
                    </div>
                    <Link
                      to="/assinatura"
                      role="menuitem"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm font-body text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:bg-gray-50"
                    >
                      {plan === 'plus' ? '⭐ Minha assinatura' : '⭐ Seja Plus'}
                    </Link>
                    <hr className="my-1 border-gray-100" />
                  </>
                )}

                <Link
                  to="/privacidade"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2.5 text-sm font-body text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:bg-gray-50"
                >
                  Política de Privacidade
                </Link>
                <Link
                  to="/termos"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2.5 text-sm font-body text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:bg-gray-50"
                >
                  Termos de Uso
                </Link>
                <hr className="my-1 border-gray-100" />

                {user ? (
                  <button
                    role="menuitem"
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm font-body text-gray-600 hover:bg-gray-50 flex items-center gap-2 focus-visible:outline-none focus-visible:bg-gray-50"
                  >
                    <LogOut size={14} aria-hidden="true" /> Sair
                  </button>
                ) : (
                  <Link
                    to="/login"
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-body text-coral hover:bg-coral/5 focus-visible:outline-none focus-visible:bg-coral/5"
                  >
                    <LogIn size={14} aria-hidden="true" /> Entrar / Cadastrar
                  </Link>
                )}

                <button
                  role="menuitem"
                  onClick={() => { setConfirmDelete(true); setMenuOpen(false) }}
                  className="w-full text-left px-4 py-2.5 text-sm font-body text-red-600 hover:bg-red-50 focus-visible:outline-none focus-visible:bg-red-50"
                >
                  Excluir meus dados
                </button>
              </nav>
            </>
          )}
        </div>
      </div>

      {/* Modal de confirmação de exclusão */}
      {confirmDelete && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6"
        >
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm flex flex-col gap-4 shadow-xl">
            <div className="flex items-start justify-between">
              <h2 id="delete-dialog-title" className="font-title font-bold text-gray-800">
                Excluir todos os dados?
              </h2>
              <button
                onClick={() => setConfirmDelete(false)}
                className="p-1 rounded hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
                aria-label="Cancelar"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <p className="font-body text-sm text-gray-600">
              Isso apagará o perfil, cardápio, pontos e histórico salvos neste dispositivo. Sua conta e assinatura permanecem intactos.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 rounded-xl border-2 border-gray-200 py-2.5 font-body text-sm text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteData}
                className="flex-1 rounded-xl bg-red-500 py-2.5 font-body text-sm text-white hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              >
                Sim, excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

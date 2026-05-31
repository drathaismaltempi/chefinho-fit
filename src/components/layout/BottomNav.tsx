import { NavLink } from 'react-router-dom'
import { Home, UtensilsCrossed, Map, ShoppingBag, Trophy } from 'lucide-react'
import { cn } from '../../lib/cn'

const NAV = [
  { to: '/', icon: Home, label: 'Início' },
  { to: '/familia', icon: UtensilsCrossed, label: 'Família' },
  { to: '/aventura/mapa', icon: Map, label: 'GO!' },
  { to: '/mercadinho', icon: ShoppingBag, label: 'Loja' },
  { to: '/ranking', icon: Trophy, label: 'Ranking' },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-white border-t border-gray-100 z-30 flex">
      {NAV.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            cn(
              'flex-1 flex flex-col items-center gap-0.5 py-2.5 text-xs font-title font-semibold transition-colors',
              isActive ? 'text-coral' : 'text-gray-400'
            )
          }
        >
          {({ isActive }) => (
            <>
              <Icon size={22} className={isActive ? 'stroke-coral' : ''} />
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

import { usePointsStore } from '../../store/usePointsStore'
import { Star } from 'lucide-react'

export function TopBar() {
  const { total_points, level } = usePointsStore()

  return (
    <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-lg z-30 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-2xl">👨‍🍳</span>
        <div>
          <h1 className="font-title font-bold text-coral text-base leading-none">Chefinho Fit</h1>
          <p className="text-xs text-gray-400">{level}</p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 bg-amarelo px-3 py-1.5 rounded-full">
        <Star size={14} className="text-yellow-500 fill-yellow-500" />
        <span className="font-title font-bold text-gray-800 text-sm">{total_points} pts</span>
      </div>
    </header>
  )
}

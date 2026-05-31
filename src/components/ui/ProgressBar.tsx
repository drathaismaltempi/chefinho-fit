import { cn } from '../../lib/cn'

interface ProgressBarProps {
  value: number
  max: number
  color?: 'verde' | 'coral' | 'turquesa'
  className?: string
  showLabel?: boolean
}

const colors = {
  verde: 'bg-verde',
  coral: 'bg-coral',
  turquesa: 'bg-turquesa',
}

export function ProgressBar({ value, max, color = 'turquesa', className, showLabel }: ProgressBarProps) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-500', colors[color])}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-gray-500">{value} / {max}</span>
      )}
    </div>
  )
}

import { cn } from '../../lib/cn'

interface BadgeProps {
  children: React.ReactNode
  color?: 'verde' | 'coral' | 'turquesa' | 'amarelo' | 'gray'
  className?: string
}

const colors = {
  verde: 'bg-verde text-gray-800',
  coral: 'bg-coral text-white',
  turquesa: 'bg-turquesa text-white',
  amarelo: 'bg-amarelo text-gray-800',
  gray: 'bg-gray-100 text-gray-600',
}

export function Badge({ children, color = 'verde', className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-title font-semibold', colors[color], className)}>
      {children}
    </span>
  )
}

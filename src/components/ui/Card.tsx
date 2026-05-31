import { cn } from '../../lib/cn'
import type { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddings = { none: '', sm: 'p-3', md: 'p-5', lg: 'p-7' }

export function Card({ padding = 'md', className, children, ...props }: CardProps) {
  return (
    <div
      className={cn('bg-white rounded-card shadow-sm border border-gray-100', paddings[padding], className)}
      {...props}
    >
      {children}
    </div>
  )
}

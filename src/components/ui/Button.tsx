import { cn } from '../../lib/cn'
import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

const variants = {
  primary: 'bg-coral text-white hover:bg-red-400 active:scale-95',
  secondary: 'bg-verde text-gray-800 hover:bg-lime-400 active:scale-95',
  ghost: 'bg-white border-2 border-gray-200 text-gray-700 hover:border-coral active:scale-95',
  danger: 'bg-red-500 text-white hover:bg-red-600 active:scale-95',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-7 py-3.5 text-lg',
}

export function Button({ variant = 'primary', size = 'md', fullWidth, className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'font-title font-semibold rounded-full transition-all duration-150 shadow-sm disabled:opacity-50',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

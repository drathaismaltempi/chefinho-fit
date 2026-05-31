import { cn } from '../../lib/cn'
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="font-title font-semibold text-sm text-gray-700">{label}</label>}
      <input
        className={cn(
          'rounded-xl border-2 border-gray-200 px-4 py-2.5 font-body text-gray-800 outline-none transition focus:border-turquesa',
          error && 'border-coral',
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-coral">{error}</span>}
    </div>
  )
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export function Textarea({ label, error, className, ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="font-title font-semibold text-sm text-gray-700">{label}</label>}
      <textarea
        className={cn(
          'rounded-xl border-2 border-gray-200 px-4 py-2.5 font-body text-gray-800 outline-none transition focus:border-turquesa resize-none',
          error && 'border-coral',
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-coral">{error}</span>}
    </div>
  )
}

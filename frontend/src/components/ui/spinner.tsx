import type { HTMLAttributes } from 'react'

interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg'
}

export function Spinner({ size = 'md', className, ...props }: SpinnerProps) {
  const sizeClass =
    size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-8 w-8' : 'h-5 w-5'
  const base =
    'inline-block rounded-full border-2 border-blue-600 border-t-transparent animate-spin'
  const merged = [sizeClass, base, className].filter(Boolean).join(' ')
  return <div className={merged} {...props} />
}

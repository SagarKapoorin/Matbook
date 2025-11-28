import type { ButtonHTMLAttributes } from 'react'

type Variant = 'default' | 'outline' | 'ghost'
type Size = 'default' | 'sm'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

export function Button({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50'
  const variantClass =
    variant === 'outline'
      ? 'border border-gray-300 bg-white hover:bg-gray-100 text-gray-900'
      : variant === 'ghost'
      ? 'bg-transparent hover:bg-gray-100 text-gray-900'
      : 'bg-blue-600 text-white hover:bg-blue-700'
  const sizeClass = size === 'sm' ? 'h-8 px-3' : 'h-9 px-4'
  const merged = [base, variantClass, sizeClass, className]
    .filter(Boolean)
    .join(' ')
  return <button className={merged} {...props} />
}

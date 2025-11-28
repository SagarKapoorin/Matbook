import type { LabelHTMLAttributes } from 'react'

export function Label({
  className,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) {
  const base = 'text-sm font-medium text-gray-800'
  const merged = [base, className].filter(Boolean).join(' ')
  return <label className={merged} {...props} />
}

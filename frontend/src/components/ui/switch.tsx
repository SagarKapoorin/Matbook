import type { ButtonHTMLAttributes } from 'react'

interface SwitchProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  checked: boolean
  onCheckedChange?: (checked: boolean) => void
}

export function Switch({
  checked,
  onCheckedChange,
  className,
  ...props
}: SwitchProps) {
  const base =
    'inline-flex h-5 w-9 items-center rounded-full border border-gray-300 transition-colors'
  const trackClass = checked ? 'bg-blue-600 border-blue-600' : 'bg-gray-200'
  const thumbBase =
    'inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform'
  const thumbPos = checked ? 'translate-x-4' : 'translate-x-0'
  const merged = [base, trackClass, className].filter(Boolean).join(' ')
  return (
    <button
      type='button'
      role='switch'
      aria-checked={checked}
      className={merged}
      onClick={() => onCheckedChange && onCheckedChange(!checked)}
      {...props}
    >
      <span className={[thumbBase, thumbPos].join(' ')} />
    </button>
  )
}

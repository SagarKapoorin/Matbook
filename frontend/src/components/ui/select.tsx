import type { SelectHTMLAttributes } from 'react'
import type { FieldOption } from '../../api'

interface SimpleSelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  value: string
  options: FieldOption[]
  placeholder?: string
  onValueChange: (value: string) => void
}

export function Select({
  className,
  value,
  options,
  placeholder,
  onValueChange,
  ...props
}: SimpleSelectProps) {
  const base =
    'block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
  const merged = [base, className].filter(Boolean).join(' ')
  return (
    <select
      className={merged}
      value={value}
      onChange={e => onValueChange(e.target.value)}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

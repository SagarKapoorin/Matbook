import type { FieldSchema, FieldValue } from '../api'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Select } from './ui/select'
import { Switch } from './ui/switch'
import { Label } from './ui/label'

interface SimpleFieldApi {
  state: {
    value: FieldValue
    meta: {
      errors?: readonly unknown[]
    }
  }
  handleChange: (value: FieldValue) => void
}

interface FieldRendererProps {
  field: FieldSchema
  fieldApi: SimpleFieldApi
}

export function FieldRenderer({ field, fieldApi }: FieldRendererProps) {
  const error =
    typeof fieldApi.state.meta.errors?.[0] === 'string'
      ? (fieldApi.state.meta.errors[0] as string)
      : undefined

  const value = fieldApi.state.value

  if (field.type === 'textarea') {
    const textValue = typeof value === 'string' ? value : ''
    return (
      <div className="flex flex-col gap-1">
        <Label htmlFor={field.name}>{field.label}</Label>
        <Textarea
          id={field.name}
          placeholder={field.placeholder}
          value={textValue}
          onChange={e => fieldApi.handleChange(e.target.value)}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    )
  }

  if (field.type === 'number') {
    const numberValue =
      typeof value === 'number' || typeof value === 'string' ? value : ''
    return (
      <div className="flex flex-col gap-1">
        <Label htmlFor={field.name}>{field.label}</Label>
        <Input
          id={field.name}
          type="number"
          placeholder={field.placeholder}
          value={numberValue}
          onChange={e =>
            fieldApi.handleChange(
              e.target.value === '' ? '' : Number(e.target.value)
            )
          }
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    )
  }

  if (field.type === 'date') {
    const dateValue = typeof value === 'string' ? value : ''
    return (
      <div className="flex flex-col gap-1">
        <Label htmlFor={field.name}>{field.label}</Label>
        <Input
          id={field.name}
          type="date"
          placeholder={field.placeholder}
          value={dateValue}
          onChange={e => fieldApi.handleChange(e.target.value)}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    )
  }

  if (field.type === 'select') {
    const selectValue = typeof value === 'string' ? value : ''
    return (
      <div className="flex flex-col gap-1">
        <Label htmlFor={field.name}>{field.label}</Label>
        <Select
          id={field.name}
          value={selectValue}
          placeholder={field.placeholder}
          options={field.options ?? []}
          onValueChange={val => fieldApi.handleChange(val)}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    )
  }

  if (field.type === 'multi-select') {
    const selectedValues: string[] = Array.isArray(value)
      ? value.map(v => String(v ?? ''))
      : []
    return (
      <div className="flex flex-col gap-1">
        <Label htmlFor={field.name}>{field.label}</Label>
        <select
          id={field.name}
          multiple
          className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedValues}
          onChange={e =>
            fieldApi.handleChange(
              Array.from(e.target.selectedOptions).map(o => o.value)
            )
          }
        >
          {field.options?.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    )
  }

  if (field.type === 'switch') {
    return (
      <div className="flex items-center justify-between gap-2 rounded-md border border-gray-200 bg-white px-3 py-2">
        <div className="flex flex-col">
          <Label htmlFor={field.name}>{field.label}</Label>
          {field.placeholder && (
            <span className="text-xs text-gray-500">
              {field.placeholder}
            </span>
          )}
        </div>
        <div className="flex flex-col items-end">
          <Switch
            id={field.name}
            checked={Boolean(value)}
            onCheckedChange={val => fieldApi.handleChange(val)}
          />
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={field.name}>{field.label}</Label>
      {(() => {
        const textValue = typeof value === 'string' ? value : ''
        return (
          <Input
            id={field.name}
            type="text"
            placeholder={field.placeholder}
            value={textValue}
            onChange={e => fieldApi.handleChange(e.target.value)}
          />
        )
      })()}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}

import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from '@tanstack/react-form'
import {
  createSubmission,
  type FormSchema,
  getFormSchema,
  type FieldSchema,
  type FieldValue,
  type FormValues,
} from '../api'
import { FieldRenderer } from '../components/FieldRenderer'
import { Button } from '../components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../components/ui/card'
import { Spinner } from '../components/ui/spinner'

function buildFieldValidators(field: FieldSchema) {
  const rules = field.validation
  if (!rules) return undefined

  return {
    onChange: ({ value }: { value: FieldValue }) => {
      const v = value

      if (rules.required) {
        if (typeof v === 'string' && v.trim().length === 0) return 'Required'
        if (Array.isArray(v) && v.length === 0) return 'Required'
        if (typeof v === 'boolean' && !v) return 'Required'
        if (v === null || v === undefined) return 'Required'
      }
      if (typeof v === 'string') {
        if (rules.minLength && v.length < rules.minLength)
          return `Minimum ${rules.minLength} characters`
        if (rules.maxLength && v.length > rules.maxLength)
          return `Maximum ${rules.maxLength} characters`
        if (rules.pattern) {
          const regex = new RegExp(rules.pattern)
          if (!regex.test(v)) return 'Invalid format'
        }
      }
      return undefined
    },
  }
}

export default function FormPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { data: schema, isLoading, isError, error } = useQuery<FormSchema>({
    queryKey: ['form-schema'],
    queryFn: getFormSchema,
  })

  const mutation = useMutation({
    mutationFn: (values: FormValues) => createSubmission(values),
    onSuccess: () => {
      setErrorMessage(null)
      setSuccessMessage('Form submitted successfully')
      queryClient.invalidateQueries({ queryKey: ['submissions'] })
      navigate('/submissions')
    },
    onError: (err: unknown) => {
      setSuccessMessage(null)

      let message: string | null = null

      if (axios.isAxiosError(err)) {
        const status = err.response?.status
        const data = err.response?.data

        // Validation errors from backend: 400 with { [field]: message }
        if (status === 400 && data && typeof data === 'object') {
          const values = Object.values(data as Record<string, unknown>).filter(
            v => typeof v === 'string'
          ) as string[]

          if (values.length > 0) {
            message = values.join('\n')
          }
        }

        // Generic backend error: { message: string }
        if (!message && data && typeof data === 'object' && 'message' in data) {
          const m = (data as { message?: unknown }).message
          if (typeof m === 'string') {
            message = m
          }
        }

        if (!message && typeof err.message === 'string') {
          message = err.message
        }
      } else if (err instanceof Error) {
        message = err.message
      }

      setErrorMessage(message ?? 'Failed to submit form')
    },
  })

  const form = useForm({
    defaultValues: {} as FormValues,
    onSubmit: async ({ value }: { value: FormValues }) => {
      await mutation.mutateAsync(value)
    },
  })

  useEffect(() => {
    if (!schema) return

    const defaults: FormValues = {}

    schema.fields.forEach(field => {
      if (
        field.type === 'select' &&
        field.validation?.required &&
        field.options &&
        field.options.length > 0
      ) {
        // Default required selects (like department) to first option, e.g. "HR"
        defaults[field.name] = field.options[0].value
      }
    })

    if (Object.keys(defaults).length > 0) {
      // Reset both current and default form values to these defaults
      form.reset(defaults)
    }
  }, [schema, form])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Spinner size="lg" />
      </div>
    )
  }

  if (isError || !schema) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="rounded-md bg-red-50 px-4 py-3 text-red-700">
          {error instanceof Error ? error.message : 'Failed to load form schema'}
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>{schema.title}</CardTitle>
          {schema.description && (
            <CardDescription>{schema.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {successMessage && (
            <div className="mb-4 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {errorMessage}
            </div>
          )}
          <form
            className="flex flex-col gap-4"
            onSubmit={e => {
              e.preventDefault()
              form.handleSubmit()
            }}
          >
            {schema.fields.map(field => (
              <form.Field
                key={field.id}
                name={field.name}
                validators={buildFieldValidators(field)}
              >
                {fieldApi => (
                  <FieldRenderer field={field} fieldApi={fieldApi} />
                )}
              </form.Field>
            ))}
            <Button
              type="submit"
              className="mt-2 self-end"
              disabled={mutation.isPending}
            >
              {mutation.isPending && (
                <Spinner size="sm" className="mr-2" />
              )}
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

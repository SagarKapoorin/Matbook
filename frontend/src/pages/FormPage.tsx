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
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4 py-10">
        <div className="flex items-center gap-3 rounded-full bg-slate-900/70 px-4 py-2 text-sm text-slate-200 shadow-lg shadow-slate-950/60">
          <Spinner size="sm" className="mr-1" />
          Preparing your dynamic form...
        </div>
      </div>
    )
  }

  if (isError || !schema) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4 py-10">
        <div className="max-w-md rounded-2xl border border-red-500/40 bg-red-950/40 px-5 py-4 text-sm text-red-50 shadow-[0_18px_45px_rgba(248,113,113,0.35)]">
          <div className="mb-1 flex items-center gap-2 text-red-100">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-red-400/70 bg-red-500/30 text-xs font-semibold">
              !
            </span>
            <p className="text-sm font-semibold">Unable to load form</p>
          </div>
          <p className="text-xs text-red-100/80">
            {error instanceof Error
              ? error.message
              : 'Something went wrong while loading the form schema.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] px-4 py-8 md:py-10 lg:py-14">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 lg:flex-row lg:items-start">
        <div className="max-w-xl space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/70 px-3 py-1 text-xs text-slate-300 shadow-[0_10px_30px_rgba(15,23,42,0.85)]">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 text-[10px] font-semibold text-slate-950">
              ●
            </span>
            <span>Schema-driven, fully validated form</span>
          </div>
          <div className="space-y-3">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
              {schema.title}
            </h1>
            <p className="max-w-prose text-sm text-slate-300">
              {schema.description ||
                'Fill in the details below. Every field is backed by a robust validation engine on both the client and server for a smooth, polished experience.'}
            </p>
          </div>
          <div className="grid max-w-md grid-cols-3 gap-3 text-xs text-slate-300">
            <div className="rounded-xl border border-slate-700/60 bg-slate-900/70 px-3 py-2">
              <p className="text-[11px] uppercase tracking-wide text-slate-400">
                Fields
              </p>
              <p className="text-lg font-semibold text-slate-50">
                {schema.fields.length}
              </p>
            </div>
            <div className="rounded-xl border border-slate-700/60 bg-slate-900/70 px-3 py-2">
              <p className="text-[11px] uppercase tracking-wide text-slate-400">
                Realtime checks
              </p>
              <p className="text-xs text-emerald-300">
                Instant client + server validation
              </p>
            </div>
            <div className="rounded-xl border border-slate-700/60 bg-slate-900/70 px-3 py-2">
              <p className="text-[11px] uppercase tracking-wide text-slate-400">
                Submissions
              </p>
              <p className="text-xs text-slate-200">
                Review everything in the Submissions tab
              </p>
            </div>
          </div>
        </div>

        <div className="w-full lg:max-w-md">
          <Card className="w-full border-slate-700/70 bg-slate-900/80 shadow-[0_18px_60px_rgba(15,23,42,0.95)]">
            <CardHeader>
              <CardTitle className="text-base text-slate-50">
                Form details
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                All required fields are validated in real time before the
                server ever sees your data.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {successMessage && (
                <div className="mb-4 flex items-start gap-2 rounded-lg border border-emerald-500/40 bg-emerald-900/40 px-3 py-2 text-xs text-emerald-50 shadow-[0_12px_35px_rgba(16,185,129,0.4)] fade-in-up">
                  <span className="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400 text-[10px] font-semibold text-emerald-950">
                    ✓
                  </span>
                  <span>{successMessage}</span>
                </div>
              )}
              {errorMessage && (
                <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-500/40 bg-red-900/40 px-3 py-2 text-xs text-red-50 shadow-[0_12px_35px_rgba(248,113,113,0.35)] fade-in-up whitespace-pre-line">
                  <span className="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-400 text-[10px] font-semibold text-red-950">
                    !
                  </span>
                  <span>{errorMessage}</span>
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
                <div className="mt-3 flex items-center justify-between gap-3">
                  <p className="hidden text-[11px] text-slate-400 sm:block">
                    Your data is validated server-side before it is stored.
                  </p>
                  <Button
                    type="submit"
                    className="relative overflow-hidden rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 px-5 py-2 text-xs font-semibold text-slate-950 shadow-[0_14px_45px_rgba(56,189,248,0.65)] transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-[0_20px_60px_rgba(56,189,248,0.75)] disabled:translate-y-0 disabled:shadow-none"
                    disabled={mutation.isPending}
                  >
                    <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-150 group-hover:opacity-20" />
                    {mutation.isPending && (
                      <Spinner size="sm" className="mr-2 text-slate-900" />
                    )}
                    {mutation.isPending ? 'Submitting…' : 'Submit response'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

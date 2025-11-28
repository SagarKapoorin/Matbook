import axios from 'axios'

export type FieldType =
  | 'text'
  | 'textarea'
  | 'select'
  | 'multi-select'
  | 'number'
  | 'date'
  | 'switch'

export interface FieldOption {
  label: string
  value: string
}

export interface FieldValidation {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: string
}

export type FieldPrimitive = string | number | boolean | null | undefined
export type FieldValue = FieldPrimitive | FieldPrimitive[]
export type FormValues = Record<string, FieldValue>

export interface FieldSchema {
  id: string
  name: string
  label: string
  type: FieldType
  placeholder?: string
  options?: FieldOption[]
  validation?: FieldValidation
}

export interface FormSchema {
  id: string
  title: string
  description?: string
  fields: FieldSchema[]
}

export type SubmissionDataValue =
  | string
  | number
  | boolean
  | null
  | string[]
  | number[]
  | Record<string, unknown>
  | undefined

export type SubmissionData = Record<string, SubmissionDataValue>

export interface Submission {
  id: string
  createdAt: string
  data: SubmissionData
}

export interface SubmissionsResponse {
  items: Submission[]
  total: number
  totalPages: number
  page: number
  limit: number
}

export interface GetSubmissionsParams {
  page: number
  limit: number
  sortBy?: string
  order?: 'asc' | 'desc'
}

// Backend-specific response shapes

interface BackendBaseField {
  name: string
  label: string
  type: FieldType
  required?: boolean
}

interface BackendTextValidation {
  minLength?: number
  maxLength?: number
  pattern?: string
}

interface BackendTextField extends BackendBaseField {
  type: 'text' | 'textarea'
  validations?: BackendTextValidation
}

interface BackendNumberField extends BackendBaseField {
  type: 'number'
  validations?: {
    min?: number
    max?: number
  }
}

interface BackendSelectField extends BackendBaseField {
  type: 'select'
  options: string[]
}

interface BackendMultiSelectField extends BackendBaseField {
  type: 'multi-select'
  options: string[]
  validations?: {
    minSelected?: number
    maxSelected?: number
  }
}

interface BackendDateField extends BackendBaseField {
  type: 'date'
  validations?: {
    minDate?: 'today' | string
  }
}

interface BackendSwitchField extends BackendBaseField {
  type: 'switch'
}

type BackendFormField =
  | BackendTextField
  | BackendNumberField
  | BackendSelectField
  | BackendMultiSelectField
  | BackendDateField
  | BackendTextareaField
  | BackendSwitchField

interface BackendTextareaField extends BackendBaseField {
  type: 'textarea'
  validations?: BackendTextValidation
}

interface BackendFormSchema {
  title: string
  fields: BackendFormField[]
}

interface BackendFormSchemaResponse {
  success: boolean
  schema: BackendFormSchema
}

interface BackendCreateSubmissionResponse {
  success: boolean
  id: string
  createdAt: string
}

interface BackendSubmissionsMeta {
  total: number
  page: number
  totalPages: number
}

interface BackendSubmissionsResponse {
  success: boolean
  data: Submission[]
  meta: BackendSubmissionsMeta
}

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
})

export const getFormSchema = async (): Promise<FormSchema> => {
  const { data } = await api.get<BackendFormSchemaResponse>('/form-schema')
  const backend = data.schema

  return {
    id: 'default',
    title: backend.title,
    description: undefined,
    fields: backend.fields.map((field, index): FieldSchema => {
      const base: Omit<FieldSchema, 'options' | 'validation'> = {
        id: field.name ?? String(index),
        name: field.name,
        label: field.label,
        type: field.type,
        placeholder: undefined,
      }

      let options: FieldOption[] | undefined
      if (field.type === 'select' || field.type === 'multi-select') {
        options = field.options.map(option => ({
          label: option,
          value: option,
        }))
      }

      let validation: FieldValidation | undefined
      if (field.type === 'text' || field.type === 'textarea') {
        const v = field.validations
        validation = {
          required: field.required,
          minLength: v?.minLength,
          maxLength: v?.maxLength,
          pattern: v?.pattern,
        }
      } else {
        validation = {
          required: field.required,
        }
      }

      return {
        ...base,
        options,
        validation,
      }
    }),
  }
}

export const createSubmission = async (
  payload: FormValues
): Promise<Submission> => {
  const { data } = await api.post<BackendCreateSubmissionResponse>(
    '/submissions',
    payload
  )

  return {
    id: data.id,
    createdAt: data.createdAt,
    data: payload,
  }
}

export const getSubmissions = async (
  params: GetSubmissionsParams
): Promise<SubmissionsResponse> => {
  const { data } = await api.get<BackendSubmissionsResponse>('/submissions', {
    params: {
      page: params.page,
      limit: params.limit,
      sortBy: params.sortBy,
      sortOrder: params.order,
    },
  })

  return {
    items: data.data,
    total: data.meta.total,
    totalPages: data.meta.totalPages,
    page: data.meta.page,
    limit: params.limit,
  }
}

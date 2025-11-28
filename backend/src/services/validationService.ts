import {
  FormSchema,
  FormField,
  TextField,
  NumberField,
  SelectField,
  MultiSelectField,
  DateField,
  TextareaField,
  SwitchField,
  ValidationResult,
} from '../types';

const isEmpty = (value: unknown): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  return false;
};

const validateTextField = (field: TextField, value: unknown): string | null => {
  if (isEmpty(value)) {
    return null;
  }
  if (typeof value !== 'string') {
    return `${field.label} must be a string.`;
  }
  const { validations } = field;
  if (validations?.minLength !== undefined && value.length < validations.minLength) {
    return `${field.label} must be at least ${validations.minLength} characters long.`;
  }
  if (validations?.maxLength !== undefined && value.length > validations.maxLength) {
    return `${field.label} must be at most ${validations.maxLength} characters long.`;
  }
  if (validations?.pattern) {
    const regex = new RegExp(validations.pattern);
    if (!regex.test(value)) {
      return `${field.label} is invalid.`;
    }
  }
  return null;
};

const normalizeNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && !Number.isNaN(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (!Number.isNaN(parsed)) return parsed;
  }
  return null;
};

const validateNumberField = (field: NumberField, value: unknown): string | null => {
  if (isEmpty(value)) {
    return null;
  }
  const num = normalizeNumber(value);
  if (num === null) {
    return `${field.label} must be a number.`;
  }
  const { validations } = field;
  if (validations?.min !== undefined && num < validations.min) {
    return `${field.label} must be at least ${validations.min}.`;
  }
  if (validations?.max !== undefined && num > validations.max) {
    return `${field.label} must be at most ${validations.max}.`;
  }
  return null;
};

const validateSelectField = (field: SelectField, value: unknown): string | null => {
  if (isEmpty(value)) {
    return null;
  }
  if (typeof value !== 'string') {
    return `${field.label} must be a string.`;
  }
  if (!field.options.includes(value)) {
    return `${field.label} must be one of: ${field.options.join(', ')}.`;
  }
  return null;
};

const validateMultiSelectField = (field: MultiSelectField, value: unknown): string | null => {
  if (isEmpty(value)) {
    return null;
  }
  if (!Array.isArray(value)) {
    return `${field.label} must be an array.`;
  }
  const selectedValues = value;
  if (!selectedValues.every((v) => typeof v === 'string')) {
    return `${field.label} must contain only strings.`;
  }
  if (!selectedValues.every((v) => field.options.includes(v))) {
    return `${field.label} contains invalid selection(s).`;
  }
  const { validations } = field;
  if (validations?.minSelected !== undefined && selectedValues.length < validations.minSelected) {
    return `${field.label} must have at least ${validations.minSelected} selection(s).`;
  }
  if (validations?.maxSelected !== undefined && selectedValues.length > validations.maxSelected) {
    return `${field.label} must have at most ${validations.maxSelected} selection(s).`;
  }
  return null;
};

const getMinDate = (minDate: 'today' | string): Date => {
  if (minDate === 'today') {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }
  const fixed = new Date(minDate);
  fixed.setHours(0, 0, 0, 0);
  return fixed;
};

const validateDateField = (field: DateField, value: unknown): string | null => {
  if (isEmpty(value)) {
    return null;
  }
  if (typeof value !== 'string') {
    return `${field.label} must be a date string.`;
  }
  const dateValue = new Date(value);
  if (Number.isNaN(dateValue.getTime())) {
    return `${field.label} must be a valid date.`;
  }
  const { validations } = field;
  if (validations?.minDate) {
    const minDate = getMinDate(validations.minDate);
    const normalizedInput = new Date(dateValue);
    normalizedInput.setHours(0, 0, 0, 0);
    if (normalizedInput < minDate) {
      return `${field.label} cannot be earlier than ${minDate.toISOString().substring(0, 10)}.`;
    }
  }
  return null;
};

const validateTextareaField = (field: TextareaField, value: unknown): string | null => {
  if (isEmpty(value)) {
    return null;
  }
  if (typeof value !== 'string') {
    return `${field.label} must be a string.`;
  }
  const { validations } = field;
  if (validations?.maxLength !== undefined && value.length > validations.maxLength) {
    return `${field.label} must be at most ${validations.maxLength} characters long.`;
  }
  return null;
};

const validateSwitchField = (field: SwitchField, value: unknown): string | null => {
  if (isEmpty(value)) {
    return null;
  }
  if (typeof value !== 'boolean') {
    return `${field.label} must be a boolean.`;
  }
  return null;
};

export const validateSubmissionData = (
  data: Record<string, any>,
  schema: FormSchema,
): ValidationResult => {
  const errors: Record<string, string> = {};
  schema.fields.forEach((field: FormField) => {
    const value = data[field.name];
    if (field.required) {
      if (field.type === 'switch' ? value !== true : isEmpty(value)) {
        errors[field.name] =
          field.type === 'switch'
            ? `${field.label} must be accepted.`
            : `${field.label} is required.`;
        return;
      }
    }
    if (!field.required && isEmpty(value)) {
      return;
    }
    let error: string | null = null;
    switch (field.type) {
      case 'text':
        error = validateTextField(field, value);
        break;
      case 'number':
        error = validateNumberField(field, value);
        break;
      case 'select':
        error = validateSelectField(field, value);
        break;
      case 'multi-select':
        error = validateMultiSelectField(field, value);
        break;
      case 'date':
        error = validateDateField(field, value);
        break;
      case 'textarea':
        error = validateTextareaField(field, value);
        break;
      case 'switch':
        error = validateSwitchField(field, value);
        break;
      default:
        break;
    }
    if (error) {
      errors[field.name] = error;
    }
  });
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};


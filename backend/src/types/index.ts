export interface Submission {
  id: string;
  createdAt: string;
  data: Record<string, any>;
}

export type FieldType =
  | 'text'
  | 'number'
  | 'select'
  | 'multi-select'
  | 'date'
  | 'textarea'
  | 'switch';

interface BaseField {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
}

export interface TextValidationRules {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

export interface NumberValidationRules {
  min?: number;
  max?: number;
}

export interface MultiSelectValidationRules {
  minSelected?: number;
  maxSelected?: number;
}

export interface DateValidationRules {
  minDate?: 'today' | string;
}

export interface TextField extends BaseField {
  type: 'text';
  validations?: TextValidationRules;
}

export interface NumberField extends BaseField {
  type: 'number';
  validations?: NumberValidationRules;
}

export interface SelectField extends BaseField {
  type: 'select';
  options: string[];
}

export interface MultiSelectField extends BaseField {
  type: 'multi-select';
  options: string[];
  validations?: MultiSelectValidationRules;
}

export interface DateField extends BaseField {
  type: 'date';
  validations?: DateValidationRules;
}

export interface TextareaField extends BaseField {
  type: 'textarea';
  validations?: TextValidationRules;
}

export interface SwitchField extends BaseField {
  type: 'switch';
}

export type FormField =
  | TextField
  | NumberField
  | SelectField
  | MultiSelectField
  | DateField
  | TextareaField
  | SwitchField;

export interface FormSchema {
  title: string;
  fields: FormField[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}


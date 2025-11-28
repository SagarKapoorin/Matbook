import { FormSchema } from '../types';

const formSchema: FormSchema = {
  title: 'Employee Onboarding',
  fields: [
    {
      name: 'fullName',
      label: 'Full Name',
      type: 'text',
      required: true,
      validations: {
        minLength: 2,
        pattern: '^[a-zA-Z\\s]*$',
      },
    },
    {
      name: 'age',
      label: 'Age',
      type: 'number',
      required: true,
      validations: {
        min: 18,
        max: 65,
      },
    },
    {
      name: 'department',
      label: 'Department',
      type: 'select',
      required: true,
      options: ['HR', 'Engineering', 'Marketing'],
    },
    {
      name: 'skills',
      label: 'Skills',
      type: 'multi-select',
      options: ['React', 'Node', 'Python', 'Java'],
      validations: {
        minSelected: 1,
        maxSelected: 3,
      },
    },
    {
      name: 'dateOfJoining',
      label: 'Date of Joining',
      type: 'date',
      required: true,
      validations: {
        minDate: 'today',
      },
    },
    {
      name: 'bio',
      label: 'Bio',
      type: 'textarea',
      validations: {
        maxLength: 200,
      },
    },
    {
      name: 'termsAccepted',
      label: 'Terms Accepted',
      type: 'switch',
      required: true,
    },
  ],
};

export default formSchema;


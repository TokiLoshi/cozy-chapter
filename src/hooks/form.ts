import { createFormHook } from '@tanstack/react-form'

import {
  DateField,
  NumberField,
  Select,
  SubmitButton,
  TextArea,
  TextField,
} from '../components/FormComponents'
import { fieldContext, formContext } from './form-context'

export const { useAppForm } = createFormHook({
  fieldComponents: {
    DateField,
    NumberField,
    Select,
    TextField,
    TextArea,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
})

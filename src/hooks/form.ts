import { createFormHook } from '@tanstack/react-form'

import {
  DateField,
  Select,
  SubmitButton,
  TextArea,
  TextField,
} from '../components/FormComponents'
import { fieldContext, formContext } from './form-context'

export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
    Select,
    TextArea,
    DateField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
})

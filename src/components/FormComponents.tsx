import { useStore } from '@tanstack/react-form'
import { useState } from 'react'
import { ChevronDownIcon } from 'lucide-react'
import { useFieldContext, useFormContext } from '@/hooks/demo.form-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea as ShadcnTextarea } from '@/components/ui/textarea'
import * as ShadcnSelect from '@/components/ui/select'
import { Slider as ShadcnSlider } from '@/components/ui/slider'
import { Switch as ShadcnSwitch } from '@/components/ui/switch'

import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

const labelStyles = 'text-sm font-medium text-slate-300 mb-2 ms-2'
const inputStyles =
  'border-slate-700 bg-slate-900/50' +
  'focus-visible:ring-1 focus-visible:ring-amber-500/50 focus-visible:border-amber-500/50'

export function DateField({
  label,
  placeholder,
}: {
  label: string
  placeholder?: string
}) {
  const field = useFieldContext<Date | null>()
  const errors = useStore(field.store, (state) => state.meta.errors)
  const [open, setOpen] = useState(false)

  return (
    <div>
      <Label
        htmlFor={label}
        className={labelStyles}
        // className="mb-2 text-xl font-bold"
      >
        {label}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild className={inputStyles}>
          <Button
            variant="outline"
            id={label}
            className="w-full justify-between font-normal bg-slat-900 text-white"
            type="button"
          >
            {field.state.value
              ? field.state.value.toLocaleDateString()
              : placeholder || 'Select Date'}
            <ChevronDownIcon className="w-5 h-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="z-[100] w-auto overflow-hidden p-0 bg-slate-900 text-white"
          align="start"
        >
          <Calendar
            mode="single"
            classNames={{
              today: 'bg-slate-800 text-slate-100 rounded-md',
              day_button:
                'data-[selected-single=true]:bg-amber-600 data-[selected-single=true]:text-white',
            }}
            selected={field.state.value || undefined}
            className={labelStyles}
            captionLayout="dropdown"
            disabled={{ after: new Date() }}
            onSelect={(date) => {
              field.handleChange(date || null)
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  )
}

export function SubmitButton({
  label,
  className,
}: {
  label: string
  className?: string
}) {
  const form = useFormContext()
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button type="submit" disabled={isSubmitting} className={className}>
          {label}
        </Button>
      )}
    </form.Subscribe>
  )
}

function ErrorMessages({
  errors,
}: {
  errors: Array<string | { message: string }>
}) {
  return (
    <>
      {errors.map((error) => (
        <div
          key={typeof error === 'string' ? error : error.message}
          className="text-red-400 mt-1 text-center text-sm font-mono"
        >
          {typeof error === 'string' ? error : error.message}
        </div>
      ))}
    </>
  )
}

export function TextField({
  label,
  placeholder,
}: {
  label: string
  placeholder?: string
}) {
  const field = useFieldContext<string>()
  const errors = useStore(field.store, (state) => state.meta.errors)

  return (
    <div>
      <Label
        htmlFor={label}
        className={labelStyles}
        // className="mb-2 text-xl font-bold"
      >
        {label}
      </Label>
      <Input
        value={field.state.value}
        placeholder={placeholder}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        className={inputStyles}
      />
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  )
}

export function NumberField({
  label,
  placeholder,
  min,
  max,
}: {
  label: string
  placeholder?: string
  min?: number
  max?: number
}) {
  const field = useFieldContext<number | null>()
  const errors = useStore(field.store, (state) => state.meta.errors)

  return (
    <div>
      <Label htmlFor={label} className="mb-2 text-xl font-bold">
        {label}
      </Label>
      <Input
        id={label}
        type="number"
        className={inputStyles}
        value={field.state.value ?? ''}
        placeholder={placeholder}
        min={min}
        max={max}
        step="1"
        onBlur={(e) => {
          field.handleBlur()
          if (e.target.value === '') {
            field.handleChange(min ?? 0)
          }
        }}
        onChange={(e) => {
          const value = e.target.value
          if (value === '') {
            field.handleChange(null)
          } else {
            const parsedValue = value === '' ? 0 : parseInt(value, 10)
            if (!isNaN(parsedValue)) {
              field.handleChange(parsedValue)
            }
          }
        }}
      />
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  )
}

export function TextArea({
  label,
  rows = 3,
}: {
  label: string
  rows?: number
}) {
  const field = useFieldContext<string>()
  const errors = useStore(field.store, (state) => state.meta.errors)

  return (
    <div>
      <Label
        htmlFor={label}
        className={labelStyles}
        // className="mb-2 text-xl font-bold"
      >
        {label}
      </Label>
      <ShadcnTextarea
        id={label}
        value={field.state.value}
        onBlur={field.handleBlur}
        rows={rows}
        onChange={(e) => field.handleChange(e.target.value)}
        className={inputStyles}
      />
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  )
}

export function Select({
  label,
  values,
  placeholder,
}: {
  label: string
  values: Array<{ label: string; value: string }>
  placeholder?: string
}) {
  const field = useFieldContext<string>()
  const errors = useStore(field.store, (state) => state.meta.errors)

  return (
    <div>
      <label
        htmlFor={field.name}
        // className="block text-lg font-bold text-slate-100 mb-2"
        // className="mb-1.5 block text-sm font-medium text-slate-300"
        className={labelStyles}
      >
        {label}
      </label>
      <ShadcnSelect.Select
        name={field.name}
        value={field.state.value}
        onValueChange={(value) => field.handleChange(value)}
      >
        <ShadcnSelect.SelectTrigger className={cn(inputStyles, 'w-full p-3')}>
          <ShadcnSelect.SelectValue placeholder={placeholder} />
        </ShadcnSelect.SelectTrigger>
        <ShadcnSelect.SelectContent className="z-[100] bg-slate-900 text-white">
          <ShadcnSelect.SelectGroup>
            <ShadcnSelect.SelectLabel className={labelStyles}>
              {label}
            </ShadcnSelect.SelectLabel>
            {values.map((value) => (
              <ShadcnSelect.SelectItem
                key={value.value}
                value={value.value}
                className="focus:bg-slate-800 focus:text-slate-100"
              >
                {value.label}
              </ShadcnSelect.SelectItem>
            ))}
          </ShadcnSelect.SelectGroup>
        </ShadcnSelect.SelectContent>
      </ShadcnSelect.Select>
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  )
}

export function Slider({ label }: { label: string }) {
  const field = useFieldContext<number>()
  const errors = useStore(field.store, (state) => state.meta.errors)

  return (
    <div>
      <Label
        htmlFor={label}
        // className="mb-2 text-xl font-bold"
        className="mb-1.5 block text-sm font-medium text-slate-300"
      >
        {label}
      </Label>
      <ShadcnSlider
        id={label}
        onBlur={field.handleBlur}
        value={[field.state.value]}
        onValueChange={(value) => field.handleChange(value[0])}
      />
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  )
}

export function Switch({ label }: { label: string }) {
  const field = useFieldContext<boolean>()
  const errors = useStore(field.store, (state) => state.meta.errors)
  return (
    <div>
      <div className="flex items-center gap-2">
        <ShadcnSwitch
          id={label}
          onBlur={field.handleBlur}
          checked={field.state.value}
          onCheckedChange={(checked) => field.handleChange(checked)}
        />
        <Label htmlFor={label}>{label}</Label>
      </div>
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  )
}

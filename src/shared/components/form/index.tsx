
'use client'

import React from 'react'
import { useForm, FormProvider, useFormContext, FieldValues, Path, DefaultValues } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { notify } from '@/shared/components/notify'
import { ZodType } from 'zod'

// Composable form components using react-hook-form context
type FormProps<TForm extends FieldValues> = {
  schema?: ZodType<any>
  onSubmit: (data: TForm) => Promise<void> | void
  defaultValues?: DefaultValues<TForm>
  children?: React.ReactNode
}

export function Form<TForm extends FieldValues>({ schema, onSubmit, defaultValues, children }: FormProps<TForm>) {
  const methods = useForm<TForm>({ resolver: schema ? zodResolver(schema as any) : undefined, defaultValues })

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="mt-6 space-y-4">
        {children}
      </form>
    </FormProvider>
  )
}

type FormInputProps<TForm extends FieldValues> = {
  name: Path<TForm> | string
  label: string
  type?: string
  placeholder?: string
}

export function FormInput<TForm extends FieldValues>({ name, label, type = 'text', placeholder = '' }: FormInputProps<TForm>) {
  const { register, formState } = useFormContext<TForm>()
  const error = (formState.errors as any)[name as any]

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        {...(register(name as any) as any)}
        type={type}
        placeholder={placeholder}
        className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />
      {error && <p className="text-red-500 text-xs mt-1">{(error as any).message}</p>}
    </div>
  )
}

type FormSelectProps<TForm extends FieldValues> = {
  name: Path<TForm> | string
  label: string
  options: Array<{ value: string; label: string }>
}

export function FormSelect<TForm extends FieldValues>({ name, label, options }: FormSelectProps<TForm>) {
  const { register, formState } = useFormContext<TForm>()
  const error = (formState.errors as any)[name as any]

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <select {...(register(name as any) as any)} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg">
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-xs mt-1">{(error as any).message}</p>}
    </div>
  )
}

// Dynamic form types
export type Field<TForm extends FieldValues = FieldValues> = {
  name: Path<TForm> | string
  label: string
  type?: 'text' | 'email' | 'password' | 'select'
  placeholder?: string
  options?: Array<{ value: string; label: string }>
}

type Props<TForm extends FieldValues> = {
  onSuccess?: () => void
  submitLabel?: string
  fields?: Field<TForm>[]
  schema?: ZodType<any>
  submit?: (data: TForm) => Promise<void> | void
}

// Keep a default SignUpForm wrapper for convenience (default export)
export default function SignUpForm<TForm extends FieldValues = FieldValues>({ onSuccess, submitLabel = 'Criar conta', fields, schema, submit }: Props<TForm>) {
  // Do not provide default fields here — parent must pass `fields` explicitly.
  const usedFields = fields ?? []

  if (!usedFields.length) {
    // If called without fields, fail loudly so the parent can fix it.
    console.warn('SignUpForm: no fields provided. Pass `fields` prop from the parent.')
    return null
  }

  const submitHandler = async (data: TForm) => {
    try {
      if (submit) {
        await submit(data)
      }
      if (onSuccess) onSuccess()
    } catch (err: any) {
      notify({ message: err.message || 'Erro ao criar conta', type: 'error' })
    }
  }

  // Render using the composable Form API for clarity
  return (
    <Form<TForm> schema={schema} onSubmit={submitHandler}>
      {usedFields.map((f) => {
        if (f.type === 'select') {
          return <FormSelect key={String(f.name)} name={String(f.name)} label={f.label} options={f.options || []} />
        }

        return <FormInput key={String(f.name)} name={String(f.name)} label={f.label} placeholder={f.placeholder} type={(f.type as any) || 'text'} />
      })}

      <div className="flex gap-2 items-center">
        <div className="flex-1" />
        <button type="submit" className="ml-auto bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition">
          {submitLabel}
        </button>
      </div>
    </Form>
  )
}

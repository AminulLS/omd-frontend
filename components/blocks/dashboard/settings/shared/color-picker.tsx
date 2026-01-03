'use client'

import { useState } from 'react'
import { Field, FieldContent, FieldLabel, FieldDescription, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface ColorPickerProps {
  label: string
  value: string
  onChange: (value: string) => void
  description?: string
  error?: string[]
  className?: string
}

export function ColorPicker({
  label,
  value,
  onChange,
  description,
  error,
  className,
}: ColorPickerProps) {
  const [isValid, setIsValid] = useState(true)

  const handleColorChange = (newValue: string) => {
    // Validate hex color
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$|^$/
    const valid = hexRegex.test(newValue)
    setIsValid(valid || newValue === '')

    if (valid || newValue === '') {
      onChange(newValue)
    }
  }

  return (
    <Field className={className}>
      <FieldLabel>{label}</FieldLabel>
      <FieldContent>
        <div className="flex gap-2">
          <Input
            type="color"
            value={value || '#000000'}
            onChange={(e) => handleColorChange(e.target.value)}
            className="w-20 h-10 cursor-pointer"
            disabled={!value}
          />
          <Input
            type="text"
            value={value}
            onChange={(e) => handleColorChange(e.target.value)}
            placeholder="#3F9AAE"
            className="flex-1 font-mono"
          />
        </div>
        {description && <FieldDescription>{description}</FieldDescription>}
        {error && <FieldError errors={error.map((e) => ({ message: e }))} />}
        {!isValid && (
          <div className="text-destructive text-xs mt-1">
            Invalid hex color format (e.g., #3F9AAE)
          </div>
        )}
      </FieldContent>
    </Field>
  )
}

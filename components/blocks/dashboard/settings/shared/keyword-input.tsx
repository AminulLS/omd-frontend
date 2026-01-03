'use client'

import { useState, KeyboardEvent } from 'react'
import { Field, FieldContent, FieldLabel, FieldDescription, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KeywordInputProps {
  label: string
  value: string[]
  onChange: (value: string[]) => void
  description?: string
  error?: string[]
  placeholder?: string
  className?: string
}

export function KeywordInput({
  label,
  value,
  onChange,
  description,
  error,
  placeholder = 'Type and press Enter',
  className,
}: KeywordInputProps) {
  const [inputValue, setInputValue] = useState('')

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const newKeyword = inputValue.trim()

      if (newKeyword && !value.includes(newKeyword)) {
        onChange([...value, newKeyword])
        setInputValue('')
      }
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      // Remove last tag when backspace is pressed on empty input
      onChange(value.slice(0, -1))
    }
  }

  const handleRemoveKeyword = (keywordToRemove: string) => {
    onChange(value.filter((keyword) => keyword !== keywordToRemove))
  }

  return (
    <Field className={className}>
      <FieldLabel>{label}</FieldLabel>
      <FieldContent>
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            {value.map((keyword) => (
              <Badge
                key={keyword}
                variant="secondary"
                className="gap-1 pr-1"
              >
                {keyword}
                <button
                  type="button"
                  onClick={() => handleRemoveKeyword(keyword)}
                  className="hover:bg-destructive/20 rounded-sm p-0.5 transition-colors"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            ))}
          </div>
          <Input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
          />
        </div>
        {description && <FieldDescription>{description}</FieldDescription>}
        {error && <FieldError errors={error.map((e) => ({ message: e }))} />}
      </FieldContent>
    </Field>
  )
}

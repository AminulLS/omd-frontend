'use client'

import { Button } from '@/components/ui/button'
import { Loader2, Save, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SettingsSaveBarProps {
  onSave: () => void
  onReset: () => void
  isSaving?: boolean
  isResetting?: boolean
  disabled?: boolean
  className?: string
  saveLabel?: string
  resetLabel?: string
}

export function SettingsSaveBar({
  onSave,
  onReset,
  isSaving = false,
  isResetting = false,
  disabled = false,
  className,
  saveLabel = 'Save Changes',
  resetLabel = 'Reset to Defaults',
}: SettingsSaveBarProps) {
  return (
    <div className={cn('flex gap-2 mt-6 pt-4 border-t', className)}>
      <Button onClick={onSave} disabled={disabled || isSaving || isResetting}>
        {isSaving ? (
          <>
            <Loader2 className="size-4 animate-spin mr-2" />
            Saving...
          </>
        ) : (
          <>
            <Save className="size-4 mr-2" />
            {saveLabel}
          </>
        )}
      </Button>
      <Button
        variant="outline"
        onClick={onReset}
        disabled={disabled || isSaving || isResetting}
      >
        {isResetting ? (
          <>
            <Loader2 className="size-4 animate-spin mr-2" />
            Resetting...
          </>
        ) : (
          <>
            <RotateCcw className="size-4 mr-2" />
            {resetLabel}
          </>
        )}
      </Button>
    </div>
  )
}

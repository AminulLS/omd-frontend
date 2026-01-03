import { useState, useEffect, useCallback } from 'react'
import { AllSettings, SettingsUpdateResponse } from '@/lib/types/settings'
import { getAllSettings, updateSettingsByCategory } from '@/lib/api/settings-api'

export function useSettings() {
  const [settings, setSettings] = useState<AllSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load all settings
  const loadSettings = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await getAllSettings()
      setSettings(data)
    } catch (err) {
      setError('Failed to load settings')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Update settings by category
  const updateSettings = useCallback(async (
    category: keyof AllSettings,
    data: Partial<AllSettings[keyof AllSettings]>
  ): Promise<SettingsUpdateResponse> => {
    setIsSaving(true)
    setError(null)

    try {
      const result = await updateSettingsByCategory(category, data)

      if (result.success) {
        // Update local state
        setSettings(prev => prev ? {
          ...prev,
          [category]: { ...prev[category], ...data }
        } : null)
      } else {
        setError(result.message || 'Failed to update settings')
      }

      return result
    } catch (err) {
      const errorMsg = 'Failed to update settings'
      setError(errorMsg)
      console.error(err)
      return { success: false, message: errorMsg }
    } finally {
      setIsSaving(false)
    }
  }, [])

  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  return {
    settings,
    isLoading,
    isSaving,
    error,
    updateSettings,
    reloadSettings: loadSettings,
  }
}

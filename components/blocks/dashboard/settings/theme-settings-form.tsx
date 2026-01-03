'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel, FieldContent, FieldDescription } from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'
import { ColorThemeSettings } from '@/lib/types/settings'
import { getSettingsByCategory, updateSettingsByCategory, resetSettingsToDefaults } from '@/lib/api/settings-api'
import { ColorPicker } from './shared/color-picker'
import { SettingsSaveBar } from './shared/settings-save-bar'

export function ThemeSettingsForm() {
  const [settings, setSettings] = useState<ColorThemeSettings>({
    mode: 'system',
    primaryColor: '',
    secondaryColor: '',
    accentColor: '',
    customCss: '',
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    setIsLoading(true)
    try {
      const data = await getSettingsByCategory('theme')
      setSettings(data)
    } catch (error) {
      console.error('Failed to load settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    setErrors({})
    setSuccessMessage('')

    try {
      const result = await updateSettingsByCategory('theme', settings)

      if (result.success) {
        setSuccessMessage(result.message || 'Settings saved successfully')
        setTimeout(() => setSuccessMessage(''), 3000)
      } else {
        setErrors(result.errors || {})
      }
    } catch (error) {
      console.error('Failed to save settings:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset to default values?')) return

    setIsResetting(true)
    try {
      await resetSettingsToDefaults('theme')
      await loadSettings()
      setSuccessMessage('Settings reset to defaults')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      console.error('Failed to reset settings:', error)
    } finally {
      setIsResetting(false)
    }
  }

  const handleChange = (field: keyof ColorThemeSettings, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 px-4 py-3 rounded-md text-sm">
          {successMessage}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Theme Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel>Theme Mode</FieldLabel>
              <FieldContent>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="theme-mode"
                      value="light"
                      checked={settings.mode === 'light'}
                      onChange={(e) => handleChange('mode', e.target.value as 'light' | 'dark' | 'system')}
                      className="size-4"
                    />
                    <span>Light</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="theme-mode"
                      value="dark"
                      checked={settings.mode === 'dark'}
                      onChange={(e) => handleChange('mode', e.target.value as 'light' | 'dark' | 'system')}
                      className="size-4"
                    />
                    <span>Dark</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="theme-mode"
                      value="system"
                      checked={settings.mode === 'system'}
                      onChange={(e) => handleChange('mode', e.target.value as 'light' | 'dark' | 'system')}
                      className="size-4"
                    />
                    <span>System</span>
                  </label>
                </div>
                <FieldDescription>
                  Choose the default theme mode for the application
                </FieldDescription>
              </FieldContent>
            </Field>

            <ColorPicker
              label="Primary Color"
              value={settings.primaryColor}
              onChange={(value) => handleChange('primaryColor', value)}
              description="Main brand color used throughout the application"
              error={errors.primaryColor}
            />

            <ColorPicker
              label="Secondary Color"
              value={settings.secondaryColor}
              onChange={(value) => handleChange('secondaryColor', value)}
              description="Secondary accent color for supporting elements"
              error={errors.secondaryColor}
            />

            <ColorPicker
              label="Accent Color"
              value={settings.accentColor}
              onChange={(value) => handleChange('accentColor', value)}
              description="Highlight color for call-to-action elements"
              error={errors.accentColor}
            />

            <Field>
              <FieldLabel>Custom CSS</FieldLabel>
              <FieldContent>
                <Textarea
                  value={settings.customCss}
                  onChange={(e) => handleChange('customCss', e.target.value)}
                  placeholder="/* Enter custom CSS here */"
                  rows={8}
                  className="font-mono text-sm"
                />
                <FieldDescription>
                  Additional CSS to customize the application styling
                </FieldDescription>
              </FieldContent>
            </Field>
          </FieldGroup>

          <SettingsSaveBar
            onSave={handleSave}
            onReset={handleReset}
            isSaving={isSaving}
            isResetting={isResetting}
          />
        </CardContent>
      </Card>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel, FieldContent, FieldDescription } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'
import { BasicSettings } from '@/lib/types/settings'
import { getSettingsByCategory, updateSettingsByCategory, resetSettingsToDefaults } from '@/lib/api/settings-api'
import { ColorPicker } from './shared/color-picker'
import { SettingsSaveBar } from './shared/settings-save-bar'

export function BasicSettingsForm() {
  const [settings, setSettings] = useState<BasicSettings>({
    siteTitle: '',
    siteDescription: '',
    logoUrl: '',
    faviconUrl: '',
    brandColor: '',
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
      const data = await getSettingsByCategory('basic')
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
      const result = await updateSettingsByCategory('basic', settings)

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
      await resetSettingsToDefaults('basic')
      await loadSettings()
      setSuccessMessage('Settings reset to defaults')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      console.error('Failed to reset settings:', error)
    } finally {
      setIsResetting(false)
    }
  }

  const handleChange = (field: keyof BasicSettings, value: string) => {
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
          <CardTitle>Basic Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel>Site Title</FieldLabel>
              <FieldContent>
                <Input
                  value={settings.siteTitle}
                  onChange={(e) => handleChange('siteTitle', e.target.value)}
                  placeholder="Enter site title"
                />
                <FieldDescription>
                  The main title displayed in the header and browser tab
                </FieldDescription>
                {errors.siteTitle && (
                  <div className="text-destructive text-xs mt-1">
                    {errors.siteTitle[0]}
                  </div>
                )}
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Site Description</FieldLabel>
              <FieldContent>
                <Textarea
                  value={settings.siteDescription}
                  onChange={(e) => handleChange('siteDescription', e.target.value)}
                  placeholder="Enter site description"
                  rows={3}
                />
                <FieldDescription>
                  A brief description of your site
                </FieldDescription>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Logo URL</FieldLabel>
              <FieldContent>
                <Input
                  value={settings.logoUrl}
                  onChange={(e) => handleChange('logoUrl', e.target.value)}
                  placeholder="/logo.png"
                />
                <FieldDescription>
                  Path or URL to your logo image
                </FieldDescription>
                {errors.logoUrl && (
                  <div className="text-destructive text-xs mt-1">
                    {errors.logoUrl[0]}
                  </div>
                )}
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Favicon URL</FieldLabel>
              <FieldContent>
                <Input
                  value={settings.faviconUrl}
                  onChange={(e) => handleChange('faviconUrl', e.target.value)}
                  placeholder="/favicon.ico"
                />
                <FieldDescription>
                  Path or URL to your favicon
                </FieldDescription>
                {errors.faviconUrl && (
                  <div className="text-destructive text-xs mt-1">
                    {errors.faviconUrl[0]}
                  </div>
                )}
              </FieldContent>
            </Field>

            <ColorPicker
              label="Brand Color"
              value={settings.brandColor}
              onChange={(value) => handleChange('brandColor', value)}
              description="Primary brand color for the application"
              error={errors.brandColor}
            />
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

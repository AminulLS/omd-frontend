'use client'

import { useState, useEffect } from 'react'
import { Field, FieldGroup, FieldLabel, FieldContent, FieldDescription } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { Loader2, CheckIcon } from 'lucide-react'
import { SEOSettings } from '@/lib/types/settings'
import { getSettingsByCategory, updateSettingsByCategory, resetSettingsToDefaults } from '@/lib/api/settings-api'
import { KeywordInput } from './shared/keyword-input'
import { SettingsSaveBar } from './shared/settings-save-bar'

export function SEOSettingsForm() {
  const [settings, setSettings] = useState<SEOSettings>({
    metaTitle: '',
    metaDescription: '',
    metaKeywords: [],
    ogImage: '',
    twitterHandle: '',
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
      const data = await getSettingsByCategory('seo')
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
      const result = await updateSettingsByCategory('seo', settings)

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
      await resetSettingsToDefaults('seo')
      await loadSettings()
      setSuccessMessage('Settings reset to defaults')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      console.error('Failed to reset settings:', error)
    } finally {
      setIsResetting(false)
    }
  }

  const handleChange = (field: keyof SEOSettings, value: string | string[]) => {
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

  const metaTitleLength = settings.metaTitle.length
  const metaDescriptionLength = settings.metaDescription.length

  return (
    <div className="space-y-4">
      {/* Success Message */}
      {successMessage && (
        <Alert className="mb-4 border-green-600 bg-green-50 text-green-800">
          <CheckIcon />
          <AlertTitle>{successMessage}</AlertTitle>
        </Alert>
      )}

      <div>
        <FieldGroup>
          <Field>
            <FieldLabel>Meta Title</FieldLabel>
            <FieldContent>
              <Input
                value={settings.metaTitle}
                onChange={(e) => handleChange('metaTitle', e.target.value)}
                placeholder="Enter meta title"
              />
              <FieldDescription>
                Title for search engines (recommended: 50-60 characters)
                <span className={`ml-2 ${metaTitleLength > 60 ? 'text-orange-500' : metaTitleLength > 50 ? 'text-green-500' : ''}`}>
                  ({metaTitleLength}/60)
                </span>
              </FieldDescription>
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Meta Description</FieldLabel>
            <FieldContent>
              <Textarea
                value={settings.metaDescription}
                onChange={(e) => handleChange('metaDescription', e.target.value)}
                placeholder="Enter meta description"
                rows={3}
              />
              <FieldDescription>
                Description for search engines (recommended: 150-160 characters)
                <span className={`ml-2 ${metaDescriptionLength > 160 ? 'text-orange-500' : metaDescriptionLength > 150 ? 'text-green-500' : ''}`}>
                  ({metaDescriptionLength}/160)
                </span>
              </FieldDescription>
            </FieldContent>
          </Field>

          <KeywordInput
            label="Meta Keywords"
            value={settings.metaKeywords}
            onChange={(value) => handleChange('metaKeywords', value)}
            description="Comma-separated keywords for SEO"
            placeholder="Type keyword and press Enter"
          />

          <Field>
            <FieldLabel>Open Graph Image</FieldLabel>
            <FieldContent>
              <Input
                value={settings.ogImage}
                onChange={(e) => handleChange('ogImage', e.target.value)}
                placeholder="/og-image.png"
              />
              <FieldDescription>
                Image displayed when sharing on social media (recommended: 1200x630px)
              </FieldDescription>
              {errors.ogImage && (
                <div className="text-destructive text-xs mt-1">
                  {errors.ogImage[0]}
                </div>
              )}
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Twitter Handle</FieldLabel>
            <FieldContent>
              <Input
                value={settings.twitterHandle}
                onChange={(e) => handleChange('twitterHandle', e.target.value)}
                placeholder="@yourhandle"
              />
              <FieldDescription>
                Twitter account for website attribution
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
      </div>
    </div>
  )
}

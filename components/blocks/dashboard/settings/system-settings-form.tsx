'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel, FieldContent, FieldDescription } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { SystemSettings } from '@/lib/types/settings'
import { getSettingsByCategory, updateSettingsByCategory, resetSettingsToDefaults } from '@/lib/api/settings-api'
import { KeywordInput } from './shared/keyword-input'
import { SettingsSaveBar } from './shared/settings-save-bar'

export function SystemSettingsForm() {
  const [settings, setSettings] = useState<SystemSettings>({
    cacheEnabled: true,
    cacheTtlMinutes: 60,
    storageProvider: 'local',
    storageBucketName: '',
    storageRegion: 'us-east-1',
    auditLogRetentionDays: 90,
    maxFileSize: 10,
    allowedFileTypes: [],
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
      const data = await getSettingsByCategory('system')
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
      const result = await updateSettingsByCategory('system', settings)

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
      await resetSettingsToDefaults('system')
      await loadSettings()
      setSuccessMessage('Settings reset to defaults')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      console.error('Failed to reset settings:', error)
    } finally {
      setIsResetting(false)
    }
  }

  const handleChange = (field: keyof SystemSettings, value: string | number | boolean | string[]) => {
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
          <CardTitle>System Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            {/* Cache Settings Section */}
            <div className="space-y-4 pb-4 border-b">
              <h3 className="text-sm font-semibold">Cache Configuration</h3>

              <Field>
                <FieldLabel>Enable Caching</FieldLabel>
                <FieldContent>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.cacheEnabled}
                      onChange={(e) => handleChange('cacheEnabled', e.target.checked)}
                      className="size-4"
                    />
                    <span className="text-sm">Cache responses to improve performance</span>
                  </label>
                </FieldContent>
              </Field>

              {settings.cacheEnabled && (
                <Field>
                  <FieldLabel>Cache TTL (Minutes)</FieldLabel>
                  <FieldContent>
                    <Input
                      type="number"
                      value={settings.cacheTtlMinutes}
                      onChange={(e) => handleChange('cacheTtlMinutes', parseInt(e.target.value) || 0)}
                      min={1}
                      max={1440}
                    />
                    <FieldDescription>
                      Time-to-live for cached data (min: 1 minute)
                    </FieldDescription>
                    {errors.cacheTtlMinutes && (
                      <div className="text-destructive text-xs mt-1">
                        {errors.cacheTtlMinutes[0]}
                      </div>
                    )}
                  </FieldContent>
                </Field>
              )}
            </div>

            {/* Storage Settings Section */}
            <div className="space-y-4 py-4 border-b">
              <h3 className="text-sm font-semibold">Storage Configuration</h3>

              <Field>
                <FieldLabel>Storage Provider</FieldLabel>
                <FieldContent>
                  <Select
                    value={settings.storageProvider}
                    onValueChange={(value) => handleChange('storageProvider', value as 'local' | 's3' | 'azure' | 'gcs')}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="local">Local Storage</SelectItem>
                      <SelectItem value="s3">Amazon S3</SelectItem>
                      <SelectItem value="azure">Azure Blob Storage</SelectItem>
                      <SelectItem value="gcs">Google Cloud Storage</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldDescription>
                    Choose where to store uploaded files
                  </FieldDescription>
                </FieldContent>
              </Field>

              {settings.storageProvider !== 'local' && (
                <>
                  <Field>
                    <FieldLabel>Bucket Name</FieldLabel>
                    <FieldContent>
                      <Input
                        value={settings.storageBucketName}
                        onChange={(e) => handleChange('storageBucketName', e.target.value)}
                        placeholder="my-bucket-name"
                      />
                      <FieldDescription>
                        Name of the storage bucket/container
                      </FieldDescription>
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel>Storage Region</FieldLabel>
                    <FieldContent>
                      <Input
                        value={settings.storageRegion}
                        onChange={(e) => handleChange('storageRegion', e.target.value)}
                        placeholder="us-east-1"
                      />
                      <FieldDescription>
                        Geographic region for the storage bucket
                      </FieldDescription>
                    </FieldContent>
                  </Field>
                </>
              )}
            </div>

            {/* Audit Log Settings Section */}
            <div className="space-y-4 py-4 border-b">
              <h3 className="text-sm font-semibold">Audit Log Settings</h3>

              <Field>
                <FieldLabel>Log Retention (Days)</FieldLabel>
                <FieldContent>
                  <Input
                    type="number"
                    value={settings.auditLogRetentionDays}
                    onChange={(e) => handleChange('auditLogRetentionDays', parseInt(e.target.value) || 0)}
                    min={7}
                    max={3650}
                  />
                  <FieldDescription>
                    Number of days to retain audit logs before deletion (min: 7 days)
                  </FieldDescription>
                  {errors.auditLogRetentionDays && (
                    <div className="text-destructive text-xs mt-1">
                      {errors.auditLogRetentionDays[0]}
                    </div>
                  )}
                </FieldContent>
              </Field>
            </div>

            {/* File Upload Settings Section */}
            <div className="space-y-4 pt-4">
              <h3 className="text-sm font-semibold">File Upload Settings</h3>

              <Field>
                <FieldLabel>Maximum File Size (MB)</FieldLabel>
                <FieldContent>
                  <Input
                    type="number"
                    value={settings.maxFileSize}
                    onChange={(e) => handleChange('maxFileSize', parseInt(e.target.value) || 0)}
                    min={1}
                    max={100}
                  />
                  <FieldDescription>
                    Maximum size for uploaded files in megabytes
                  </FieldDescription>
                  {errors.maxFileSize && (
                    <div className="text-destructive text-xs mt-1">
                      {errors.maxFileSize[0]}
                    </div>
                  )}
                </FieldContent>
              </Field>

              <KeywordInput
                label="Allowed File Types"
                value={settings.allowedFileTypes}
                onChange={(value) => handleChange('allowedFileTypes', value)}
                description="MIME types allowed for upload (e.g., image/png, application/pdf)"
                placeholder="Type MIME type and press Enter"
              />
            </div>
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

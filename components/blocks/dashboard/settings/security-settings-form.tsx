'use client'

import { useState, useEffect } from 'react'
import { Field, FieldGroup, FieldLabel, FieldContent, FieldDescription } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { Loader2, CheckIcon } from 'lucide-react'
import { SecuritySettings } from '@/lib/types/settings'
import { getSettingsByCategory, updateSettingsByCategory, resetSettingsToDefaults } from '@/lib/api/settings-api'
import { SettingsSaveBar } from './shared/settings-save-bar'

export function SecuritySettingsForm() {
  const [settings, setSettings] = useState<SecuritySettings>({
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireLowercase: true,
    passwordRequireNumbers: true,
    passwordRequireSpecialChars: true,
    passwordExpiryDays: 90,
    sessionTimeoutMinutes: 60,
    maxLoginAttempts: 5,
    captchaEnabled: false,
    captchaSiteKey: '',
    captchaSecretKey: '',
    twoFactorEnabled: false,
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
      const data = await getSettingsByCategory('security')
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
      const result = await updateSettingsByCategory('security', settings)

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
      await resetSettingsToDefaults('security')
      await loadSettings()
      setSuccessMessage('Settings reset to defaults')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      console.error('Failed to reset settings:', error)
    } finally {
      setIsResetting(false)
    }
  }

  const handleChange = (field: keyof SecuritySettings, value: string | number | boolean) => {
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
          <Alert className="mb-4 border-green-600 bg-green-50 text-green-800">
            <CheckIcon className="" />
            <AlertTitle>{successMessage}</AlertTitle>
          </Alert>
      )}

      <div>
        <FieldGroup>
          {/* Password Policy Section */}
          <div className="space-y-4 pb-4 border-b">
            <h3 className="text-sm font-semibold">Password Policy</h3>

            <Field>
              <FieldLabel>Minimum Password Length</FieldLabel>
              <FieldContent>
                <Input
                  type="number"
                  value={settings.passwordMinLength}
                  onChange={(e) => handleChange('passwordMinLength', parseInt(e.target.value) || 0)}
                  min={4}
                  max={128}
                />
                <FieldDescription>
                  Minimum number of characters required for passwords (min: 4)
                </FieldDescription>
                {errors.passwordMinLength && (
                  <div className="text-destructive text-xs mt-1">
                    {errors.passwordMinLength[0]}
                  </div>
                )}
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Password Requirements</FieldLabel>
              <FieldContent>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.passwordRequireUppercase}
                      onChange={(e) => handleChange('passwordRequireUppercase', e.target.checked)}
                      className="size-4"
                    />
                    <span className="text-sm">Require uppercase letters (A-Z)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.passwordRequireLowercase}
                      onChange={(e) => handleChange('passwordRequireLowercase', e.target.checked)}
                      className="size-4"
                    />
                    <span className="text-sm">Require lowercase letters (a-z)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.passwordRequireNumbers}
                      onChange={(e) => handleChange('passwordRequireNumbers', e.target.checked)}
                      className="size-4"
                    />
                    <span className="text-sm">Require numbers (0-9)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.passwordRequireSpecialChars}
                      onChange={(e) => handleChange('passwordRequireSpecialChars', e.target.checked)}
                      className="size-4"
                    />
                    <span className="text-sm">Require special characters (!@#$%^&*)</span>
                  </label>
                </div>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Password Expiry (Days)</FieldLabel>
              <FieldContent>
                <Input
                  type="number"
                  value={settings.passwordExpiryDays}
                  onChange={(e) => handleChange('passwordExpiryDays', parseInt(e.target.value) || 0)}
                  min={0}
                  max={365}
                />
                <FieldDescription>
                  Number of days before passwords expire (0 for never)
                </FieldDescription>
              </FieldContent>
            </Field>
          </div>

          {/* Session Settings Section */}
          <div className="space-y-4 py-4 border-b">
            <h3 className="text-sm font-semibold">Session Settings</h3>

            <Field>
              <FieldLabel>Session Timeout (Minutes)</FieldLabel>
              <FieldContent>
                <Input
                  type="number"
                  value={settings.sessionTimeoutMinutes}
                  onChange={(e) => handleChange('sessionTimeoutMinutes', parseInt(e.target.value) || 0)}
                  min={5}
                  max={1440}
                />
                <FieldDescription>
                  Minutes of inactivity before session expires (min: 5)
                </FieldDescription>
                {errors.sessionTimeoutMinutes && (
                  <div className="text-destructive text-xs mt-1">
                    {errors.sessionTimeoutMinutes[0]}
                  </div>
                )}
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Max Login Attempts</FieldLabel>
              <FieldContent>
                <Input
                  type="number"
                  value={settings.maxLoginAttempts}
                  onChange={(e) => handleChange('maxLoginAttempts', parseInt(e.target.value) || 0)}
                  min={1}
                  max={10}
                />
                <FieldDescription>
                  Maximum failed login attempts before account lockout
                </FieldDescription>
              </FieldContent>
            </Field>
          </div>

          {/* Captcha Settings Section */}
          <div className="space-y-4 py-4 border-b">
            <h3 className="text-sm font-semibold">Captcha Settings</h3>

            <Field>
              <FieldLabel>Enable Captcha</FieldLabel>
              <FieldContent>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.captchaEnabled}
                    onChange={(e) => handleChange('captchaEnabled', e.target.checked)}
                    className="size-4"
                  />
                  <span className="text-sm">Require captcha on login and registration</span>
                </label>
              </FieldContent>
            </Field>

            {settings.captchaEnabled && (
              <>
                <Field>
                  <FieldLabel>Captcha Site Key</FieldLabel>
                  <FieldContent>
                    <Input
                      value={settings.captchaSiteKey}
                      onChange={(e) => handleChange('captchaSiteKey', e.target.value)}
                      placeholder="Enter your site key"
                    />
                    <FieldDescription>
                      Public key for captcha verification
                    </FieldDescription>
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>Captcha Secret Key</FieldLabel>
                  <FieldContent>
                    <Input
                      type="password"
                      value={settings.captchaSecretKey}
                      onChange={(e) => handleChange('captchaSecretKey', e.target.value)}
                      placeholder="Enter your secret key"
                    />
                    <FieldDescription>
                      Private key for captcha verification (keep confidential)
                    </FieldDescription>
                  </FieldContent>
                </Field>
              </>
            )}
          </div>

          {/* Two-Factor Authentication */}
          <div className="space-y-4 pt-4">
            <h3 className="text-sm font-semibold">Two-Factor Authentication</h3>

            <Field>
              <FieldLabel>Enable 2FA</FieldLabel>
              <FieldContent>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.twoFactorEnabled}
                    onChange={(e) => handleChange('twoFactorEnabled', e.target.checked)}
                    className="size-4"
                  />
                  <span className="text-sm">Require two-factor authentication for all users</span>
                </label>
                <FieldDescription>
                  Users will need to verify their identity with a second factor
                </FieldDescription>
              </FieldContent>
            </Field>
          </div>
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

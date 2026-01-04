import {
  AllSettings,
  BasicSettings,
  SEOSettings,
  ColorThemeSettings,
  SecuritySettings,
  SystemSettings,
  SettingsUpdateResponse,
} from '@/lib/types/settings'

// Mock initial data - simulates database
const defaultSettings: AllSettings = {
  basic: {
    siteTitle: 'OMD Dashboard',
    siteDescription: 'Operations Management Dashboard',
    logoUrl: '/logo.png',
    faviconUrl: '/favicon.ico',
    brandColor: '#3F9AAE',
  },
  seo: {
    metaTitle: 'OMD - Operations Management Dashboard',
    metaDescription: 'Comprehensive dashboard for managing operations, partners, and analytics',
    metaKeywords: ['dashboard', 'operations', 'management', 'analytics'],
    ogImage: '/og-image.png',
    twitterHandle: '@operationmediallc',
  },
  theme: {
    mode: 'system',
    primaryColor: '#3F9AAE',
    secondaryColor: '#79C9C5',
    accentColor: '#F96E5B',
    customCss: '',
  },
  security: {
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
  },
  system: {
    cacheEnabled: true,
    cacheTtlMinutes: 60,
    storageProvider: 'local',
    storageBucketName: '',
    storageRegion: 'us-east-1',
    auditLogRetentionDays: 90,
    maxFileSize: 10,
    allowedFileTypes: ['image/png', 'image/jpeg', 'image/gif', 'application/pdf'],
  },
}

// In-memory storage (simulates database)
let settingsStore: AllSettings = { ...defaultSettings }

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Get all settings
 * GET /api/settings
 */
export async function getAllSettings(): Promise<AllSettings> {
  await delay(300) // Simulate network delay
  return { ...settingsStore }
}

/**
 * Get settings by category
 * GET /api/settings/:category
 */
export async function getSettingsByCategory<K extends keyof AllSettings>(
  category: K
): Promise<AllSettings[K]> {
  await delay(200)
  return { ...settingsStore[category] }
}

/**
 * Update settings by category
 * PUT /api/settings/:category
 */
export async function updateSettingsByCategory<K extends keyof AllSettings>(
  category: K,
  data: Partial<AllSettings[K]>
): Promise<SettingsUpdateResponse> {
  await delay(400)

  try {
    // Validate data based on category
    const validation = validateSettings(category, data)
    if (!validation.valid) {
      return {
        success: false,
        message: 'Validation failed',
        errors: validation.errors,
      }
    }

    // Update settings
    settingsStore[category] = {
      ...settingsStore[category],
      ...data,
    }

    // In a real app, this would persist to database
    console.log(`Updated ${category} settings:`, data)

    return {
      success: true,
      message: `${category.charAt(0).toUpperCase() + category.slice(1)} settings updated successfully`,
    }
  } catch (error) {
    return {
      success: false,
      message: 'Failed to update settings',
    }
  }
}

/**
 * Reset settings to defaults
 * POST /api/settings/reset
 */
export async function resetSettingsToDefaults(
  category?: keyof AllSettings
): Promise<SettingsUpdateResponse> {
  await delay(500)

  if (category) {
    (settingsStore as any)[category] = { ...defaultSettings[category] }
    return {
      success: true,
      message: `${category.charAt(0).toUpperCase() + category.slice(1)} settings reset to defaults`,
    }
  } else {
    settingsStore = { ...defaultSettings }
    return {
      success: true,
      message: 'All settings reset to defaults',
    }
  }
}

/**
 * Validate settings based on category
 */
function validateSettings<K extends keyof AllSettings>(
  category: K,
  data: Partial<AllSettings[K]>
): { valid: boolean; errors?: Record<string, string[]> } {
  const errors: Record<string, string[]> = {}

  switch (category) {
    case 'basic':
      const basicData = data as Partial<BasicSettings>
      if (basicData.siteTitle !== undefined && basicData.siteTitle.length < 2) {
        errors.siteTitle = ['Site title must be at least 2 characters']
      }
      if (basicData.logoUrl !== undefined && basicData.logoUrl && !isValidUrl(basicData.logoUrl)) {
        errors.logoUrl = ['Invalid URL format']
      }
      if (basicData.faviconUrl !== undefined && basicData.faviconUrl && !isValidUrl(basicData.faviconUrl)) {
        errors.faviconUrl = ['Invalid URL format']
      }
      break

    case 'security':
      const securityData = data as Partial<SecuritySettings>
      if (securityData.passwordMinLength !== undefined && securityData.passwordMinLength < 4) {
        errors.passwordMinLength = ['Password must be at least 4 characters']
      }
      if (securityData.sessionTimeoutMinutes !== undefined && securityData.sessionTimeoutMinutes < 5) {
        errors.sessionTimeoutMinutes = ['Session timeout must be at least 5 minutes']
      }
      break

    case 'system':
      const systemData = data as Partial<SystemSettings>
      if (systemData.cacheTtlMinutes !== undefined && systemData.cacheTtlMinutes < 1) {
        errors.cacheTtlMinutes = ['Cache TTL must be at least 1 minute']
      }
      if (systemData.auditLogRetentionDays !== undefined && systemData.auditLogRetentionDays < 7) {
        errors.auditLogRetentionDays = ['Retention period must be at least 7 days']
      }
      if (systemData.maxFileSize !== undefined && systemData.maxFileSize < 1) {
        errors.maxFileSize = ['Max file size must be at least 1 MB']
      }
      break
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors: Object.keys(errors).length > 0 ? errors : undefined,
  }
}

/**
 * Helper function to validate URLs
 */
function isValidUrl(url: string): boolean {
  try {
    // Allow relative URLs
    if (url.startsWith('/')) return true
    new URL(url)
    return true
  } catch {
    return false
  }
}

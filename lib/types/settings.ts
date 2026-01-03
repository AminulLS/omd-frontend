// Basic Settings - Site identity and branding
export interface BasicSettings {
  siteTitle: string
  siteDescription: string
  logoUrl: string
  faviconUrl: string
  brandColor: string
}

// SEO Settings - Search engine optimization
export interface SEOSettings {
  metaTitle: string
  metaDescription: string
  metaKeywords: string[]
  ogImage: string
  twitterHandle: string
}

// Color Theme Settings - Theme customization
export interface ColorThemeSettings {
  mode: 'light' | 'dark' | 'system'
  primaryColor: string
  secondaryColor: string
  accentColor: string
  customCss: string
}

// Security Settings - Security policies
export interface SecuritySettings {
  passwordMinLength: number
  passwordRequireUppercase: boolean
  passwordRequireLowercase: boolean
  passwordRequireNumbers: boolean
  passwordRequireSpecialChars: boolean
  passwordExpiryDays: number
  sessionTimeoutMinutes: number
  maxLoginAttempts: number
  captchaEnabled: boolean
  captchaSiteKey: string
  captchaSecretKey: string
  twoFactorEnabled: boolean
}

// System Settings - System configuration
export interface SystemSettings {
  cacheEnabled: boolean
  cacheTtlMinutes: number
  storageProvider: 'local' | 's3' | 'azure' | 'gcs'
  storageBucketName: string
  storageRegion: string
  auditLogRetentionDays: number
  maxFileSize: number
  allowedFileTypes: string[]
}

// All Settings Combined
export interface AllSettings {
  basic: BasicSettings
  seo: SEOSettings
  theme: ColorThemeSettings
  security: SecuritySettings
  system: SystemSettings
}

// Settings update response
export interface SettingsUpdateResponse {
  success: boolean
  message?: string
  errors?: Record<string, string[]>
}

// Category type for settings
export type SettingsCategory = keyof AllSettings

// User Status
export type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended'

// System Role
export type SystemRole = 'admin' | 'manager' | 'user' | 'viewer'

// Partner Role (user's role within a partner)
export type PartnerRole = 'main_user' | 'manager'

// User Profile
export interface UserProfile {
  department: string
  location: string
  avatarUrl: string
  bio: string
  phone: string
}

// User Security
export interface UserSecurity {
  password?: string // Only on create/reset
  twoFactorEnabled: boolean
  lastLogin?: string
  passwordChangedAt?: string
}

// User Preferences
export interface UserPreferences {
  emailNotifications: boolean
  pushNotifications: boolean
  theme: 'light' | 'dark' | 'system'
  language: string
}

// Partner Assignment (user's role in a partner)
export interface PartnerAssignment {
  partnerId: string
  partnerName: string
  role: PartnerRole
}

// Full User Entity
export interface User {
  id: string
  name: string
  email: string
  status: UserStatus
  role: SystemRole
  profile: UserProfile
  security: UserSecurity
  preferences: UserPreferences
  partners: PartnerAssignment[]
  createdAt: string
  updatedAt: string
}

// User create data (without id, timestamps)
export type UserCreateData = Omit<User, 'id' | 'createdAt' | 'updatedAt'>

// User update data (all fields optional except id)
export type UserUpdateData = Partial<UserCreateData>

// API Response for single user
export interface UserResponse {
  success: boolean
  data?: User
  message?: string
  errors?: Record<string, string[]>
}

// API Response for user list
export interface UserListResponse {
  success: boolean
  data?: User[]
  message?: string
  total?: number
}

// API Response for user operations (create, update, delete)
export interface UserOperationResponse {
  success: boolean
  message?: string
  errors?: Record<string, string[]>
}

// Activity Log for User
export interface UserActivityLog {
  id: string
  timestamp: string
  level: 'info' | 'warning' | 'error' | 'critical'
  eventType: string
  description: string
  actor: {
    id: string
    name: string
    email: string
  }
  metadata?: {
    ip?: string
    browser?: string
    location?: string
  }
}

// Role Permissions
export interface RolePermissions {
  canCreateUsers: boolean
  canEditUsers: boolean
  canDeleteUsers: boolean
  canManagePartners: boolean
  canViewAuditLogs: boolean
  canManageSettings: boolean
}

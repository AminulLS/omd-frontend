// Re-export SystemRole from users for convenience
export type { SystemRole } from './users'

// Also import it for use within this file
import { type SystemRole } from './users'

// Permission categories
export type PermissionCategory =
  | 'users'
  | 'partners'
  | 'audit_logs'
  | 'settings'
  | 'reports'
  | 'api_keys'

// Individual permissions
export type Permission =
  | 'users.create'
  | 'users.edit'
  | 'users.delete'
  | 'users.view'
  | 'partners.create'
  | 'partners.edit'
  | 'partners.delete'
  | 'partners.view'
  | 'audit_logs.view'
  | 'audit_logs.export'
  | 'settings.manage'
  | 'settings.view'
  | 'reports.view'
  | 'reports.export'
  | 'api_keys.create'
  | 'api_keys.delete'
  | 'api_keys.view'

// Role definition with all permissions
export interface Role {
  id: string
  name: string
  slug: string // Allow custom slugs
  description: string
  permissions: Permission[]
  isSystemRole: boolean
  createdAt: string
  updatedAt: string
}

// User with role info for ACL view
export interface UserWithRole {
  id: string
  name: string
  email: string
  role: SystemRole
  roleName: string
  status: 'active' | 'inactive' | 'pending' | 'suspended'
  department: string
  location: string
  partnerCount: number
  lastLogin?: string
  createdAt: string
}

// Permission group for UI organization
export interface PermissionGroup {
  category: PermissionCategory
  label: string
  description: string
  permissions: Permission[]
}

// Role create/update data
export interface RoleCreateData {
  name: string
  slug: string // Allow custom slugs, not just SystemRole
  description: string
  permissions: Permission[]
}

export type RoleUpdateData = Partial<RoleCreateData>

// API response types
export interface RoleListResponse {
  success: boolean
  data?: Role[]
  message?: string
  total?: number
}

export interface RoleResponse {
  success: boolean
  data?: Role
  message?: string
  errors?: Record<string, string[]>
}

export interface RoleOperationResponse {
  success: boolean
  message?: string
  errors?: Record<string, string[]>
}

export interface UsersWithRoleResponse {
  success: boolean
  data?: UserWithRole[]
  message?: string
  total?: number
}
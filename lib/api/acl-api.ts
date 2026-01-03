import {
  Role,
  RoleCreateData,
  RoleListResponse,
  RoleResponse,
  RoleOperationResponse,
  UserWithRole,
  UsersWithRoleResponse,
  Permission,
  PermissionGroup,
  SystemRole,
} from '@/lib/types/acl'
import { getAllUsers } from '@/lib/api/users-api'
import { User } from '@/lib/types/users'

// Permission groups for UI organization
export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    category: 'users',
    label: 'User Management',
    description: 'Control user account access and operations',
    permissions: ['users.create', 'users.edit', 'users.delete', 'users.view'],
  },
  {
    category: 'partners',
    label: 'Partner Management',
    description: 'Control partner and advertiser operations',
    permissions: ['partners.create', 'partners.edit', 'partners.delete', 'partners.view'],
  },
  {
    category: 'audit_logs',
    label: 'Audit Logs',
    description: 'Access and export system activity logs',
    permissions: ['audit_logs.view', 'audit_logs.export'],
  },
  {
    category: 'settings',
    label: 'Settings',
    description: 'View and modify system settings',
    permissions: ['settings.view', 'settings.manage'],
  },
  {
    category: 'reports',
    label: 'Reports',
    description: 'View and export business reports',
    permissions: ['reports.view', 'reports.export'],
  },
  {
    category: 'api_keys',
    label: 'API Keys',
    description: 'Manage API keys for programmatic access',
    permissions: ['api_keys.create', 'api_keys.delete', 'api_keys.view'],
  },
]

// Default system roles
const defaultRoles: Role[] = [
  {
    id: 'role-admin',
    name: 'Administrator',
    slug: 'admin',
    description: 'Full system access with all permissions',
    permissions: [
      'users.create',
      'users.edit',
      'users.delete',
      'users.view',
      'partners.create',
      'partners.edit',
      'partners.delete',
      'partners.view',
      'audit_logs.view',
      'audit_logs.export',
      'settings.view',
      'settings.manage',
      'reports.view',
      'reports.export',
      'api_keys.create',
      'api_keys.delete',
      'api_keys.view',
    ],
    isSystemRole: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'role-manager',
    name: 'Manager',
    slug: 'manager',
    description: 'Can manage users, partners, and view reports',
    permissions: [
      'users.create',
      'users.edit',
      'users.view',
      'partners.create',
      'partners.edit',
      'partners.view',
      'audit_logs.view',
      'settings.view',
      'reports.view',
      'reports.export',
      'api_keys.view',
    ],
    isSystemRole: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'role-user',
    name: 'User',
    slug: 'user',
    description: 'Standard user with limited access',
    permissions: [
      'users.view',
      'partners.view',
      'reports.view',
      'settings.view',
    ],
    isSystemRole: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'role-viewer',
    name: 'Viewer',
    slug: 'viewer',
    description: 'Read-only access to view data and audit logs',
    permissions: [
      'users.view',
      'partners.view',
      'audit_logs.view',
      'reports.view',
      'settings.view',
      'api_keys.view',
    ],
    isSystemRole: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
]

// Role label mapping
export const ROLE_LABEL_MAP: Record<SystemRole, string> = {
  admin: 'Administrator',
  manager: 'Manager',
  user: 'User',
  viewer: 'Viewer',
}

// Role description mapping
export const ROLE_DESCRIPTION_MAP: Record<SystemRole, string> = {
  admin: 'Full system access with all permissions',
  manager: 'Can manage users, partners, and view reports',
  user: 'Standard user with limited access',
  viewer: 'Read-only access to view data and audit logs',
}

// Permission label mapping
export const PERMISSION_LABEL_MAP: Record<Permission, string> = {
  'users.create': 'Create Users',
  'users.edit': 'Edit Users',
  'users.delete': 'Delete Users',
  'users.view': 'View Users',
  'partners.create': 'Create Partners',
  'partners.edit': 'Edit Partners',
  'partners.delete': 'Delete Partners',
  'partners.view': 'View Partners',
  'audit_logs.view': 'View Audit Logs',
  'audit_logs.export': 'Export Audit Logs',
  'settings.manage': 'Manage Settings',
  'settings.view': 'View Settings',
  'reports.view': 'View Reports',
  'reports.export': 'Export Reports',
  'api_keys.create': 'Create API Keys',
  'api_keys.delete': 'Delete API Keys',
  'api_keys.view': 'View API Keys',
}

// In-memory storage
let rolesStore: Role[] = [...defaultRoles]

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Get all roles
 * GET /api/acl/roles
 */
export async function getAllRoles(): Promise<RoleListResponse> {
  await delay(200)
  return {
    success: true,
    data: [...rolesStore],
    total: rolesStore.length,
  }
}

/**
 * Get role by ID
 * GET /api/acl/roles/:id
 */
export async function getRoleById(id: string): Promise<RoleResponse> {
  await delay(100)
  const role = rolesStore.find(r => r.id === id)

  if (!role) {
    return {
      success: false,
      message: 'Role not found',
    }
  }

  return {
    success: true,
    data: role,
  }
}

/**
 * Get role by slug
 * GET /api/acl/roles/slug/:slug
 */
export async function getRoleBySlug(slug: SystemRole): Promise<RoleResponse> {
  await delay(100)
  const role = rolesStore.find(r => r.slug === slug)

  if (!role) {
    return {
      success: false,
      message: 'Role not found',
    }
  }

  return {
    success: true,
    data: role,
  }
}

/**
 * Create a new role
 * POST /api/acl/roles
 */
export async function createRole(roleData: RoleCreateData): Promise<RoleOperationResponse> {
  await delay(300)

  try {
    // Validate
    const validation = validateRoleData(roleData)
    if (!validation.valid) {
      return {
        success: false,
        message: 'Validation failed',
        errors: validation.errors,
      }
    }

    // Check if slug already exists
    const slugExists = rolesStore.some(r => r.slug === roleData.slug)
    if (slugExists) {
      return {
        success: false,
        message: 'Role slug already exists',
        errors: { slug: ['This role slug is already in use'] },
      }
    }

    // Create new role
    const newRole: Role = {
      ...roleData,
      id: `role-${Date.now()}`,
      isSystemRole: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    rolesStore.push(newRole)

    return {
      success: true,
      message: 'Role created successfully',
    }
  } catch (error) {
    return {
      success: false,
      message: 'Failed to create role',
    }
  }
}

/**
 * Update an existing role
 * PUT /api/acl/roles/:id
 */
export async function updateRole(id: string, roleData: RoleCreateData): Promise<RoleOperationResponse> {
  await delay(300)

  try {
    const roleIndex = rolesStore.findIndex(r => r.id === id)

    if (roleIndex === -1) {
      return {
        success: false,
        message: 'Role not found',
      }
    }

    // Prevent modifying system roles' slug
    if (rolesStore[roleIndex].isSystemRole && roleData.slug !== rolesStore[roleIndex].slug) {
      return {
        success: false,
        message: 'Cannot change system role slug',
        errors: { slug: ['System role slugs cannot be modified'] },
      }
    }

    // Validate
    const validation = validateRoleData(roleData)
    if (!validation.valid) {
      return {
        success: false,
        message: 'Validation failed',
        errors: validation.errors,
      }
    }

    // Check if slug already exists (excluding current role)
    const slugExists = rolesStore.some(r => r.id !== id && r.slug === roleData.slug)
    if (slugExists) {
      return {
        success: false,
        message: 'Role slug already exists',
        errors: { slug: ['This role slug is already in use'] },
      }
    }

    // Update role
    const updatedRole: Role = {
      ...rolesStore[roleIndex],
      ...roleData,
      updatedAt: new Date().toISOString(),
    }

    rolesStore[roleIndex] = updatedRole

    return {
      success: true,
      message: 'Role updated successfully',
    }
  } catch (error) {
    return {
      success: false,
      message: 'Failed to update role',
    }
  }
}

/**
 * Delete a role
 * DELETE /api/acl/roles/:id
 */
export async function deleteRole(id: string): Promise<RoleOperationResponse> {
  await delay(200)

  const roleIndex = rolesStore.findIndex(r => r.id === id)

  if (roleIndex === -1) {
    return {
      success: false,
      message: 'Role not found',
    }
  }

  // Prevent deleting system roles
  if (rolesStore[roleIndex].isSystemRole) {
    return {
      success: false,
      message: 'Cannot delete system roles',
      errors: { role: ['System roles cannot be deleted'] },
    }
  }

  rolesStore.splice(roleIndex, 1)

  return {
    success: true,
    message: 'Role deleted successfully',
  }
}

/**
 * Get all users with their roles
 * GET /api/acl/users
 */
export async function getUsersWithRoles(): Promise<UsersWithRoleResponse> {
  await delay(300)

  const usersResponse = await getAllUsers()
  if (!usersResponse.success || !usersResponse.data) {
    return {
      success: false,
      message: 'Failed to fetch users',
    }
  }

  const usersWithRoles: UserWithRole[] = usersResponse.data.map((user: User) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    roleName: ROLE_LABEL_MAP[user.role],
    status: user.status,
    department: user.profile.department,
    location: user.profile.location,
    partnerCount: user.partners.length,
    lastLogin: user.security.lastLogin,
    createdAt: user.createdAt,
  }))

  return {
    success: true,
    data: usersWithRoles,
    total: usersWithRoles.length,
  }
}

/**
 * Get permission groups
 * GET /api/acl/permissions/groups
 */
export function getPermissionGroups(): PermissionGroup[] {
  return PERMISSION_GROUPS
}

/**
 * Validate role data
 */
function validateRoleData(
  data: RoleCreateData,
  isUpdate: boolean = false
): { valid: boolean; errors?: Record<string, string[]> } {
  const errors: Record<string, string[]> = {}

  // Name validation
  if (!data.name || data.name.length < 2) {
    errors.name = ['Name must be at least 2 characters']
  }

  // Slug validation - allow custom slugs (lowercase alphanumeric with hyphens/underscores)
  if (!data.slug || !/^[a-z][a-z0-9_-]*$/.test(data.slug)) {
    errors.slug = ['Slug must start with a lowercase letter and contain only lowercase letters, numbers, hyphens, or underscores']
  }

  if (data.slug.length < 2) {
    errors.slug = ['Slug must be at least 2 characters']
  }

  if (data.slug.length > 50) {
    errors.slug = ['Slug must be less than 50 characters']
  }

  // Description validation
  if (!data.description || data.description.length < 10) {
    errors.description = ['Description must be at least 10 characters']
  }

  // Permissions validation
  if (!data.permissions || data.permissions.length === 0) {
    errors.permissions = ['At least one permission is required']
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors: Object.keys(errors).length > 0 ? errors : undefined,
  }
}
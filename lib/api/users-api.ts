import {
  User,
  UserCreateData,
  UserUpdateData,
  UserListResponse,
  UserOperationResponse,
  UserActivityLog,
  RolePermissions,
} from '@/lib/types/users'

// Mock initial data - simulates database
const defaultUsers: User[] = [
  {
    id: 'u1',
    name: 'John Smith',
    email: 'john@company.com',
    status: 'active',
    role: 'admin',
    profile: {
      department: 'Engineering',
      location: 'San Francisco, CA',
      avatarUrl: '/avatars/john.jpg',
      bio: 'Senior administrator with 10+ years of experience.',
      phone: '+1 (555) 100-1001',
    },
    security: {
      twoFactorEnabled: true,
      lastLogin: '2025-01-03T10:30:00Z',
      passwordChangedAt: '2024-12-01T00:00:00Z',
    },
    preferences: {
      emailNotifications: true,
      pushNotifications: true,
      theme: 'system',
      language: 'en',
    },
    partners: [
      { partnerId: '1', partnerName: 'TechGlobal Inc.', role: 'main_user' },
      { partnerId: '2', partnerName: 'MediaFlow Partners', role: 'manager' },
    ],
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2025-01-03T10:30:00Z',
  },
  {
    id: 'u2',
    name: 'Sarah Johnson',
    email: 'sarah@company.com',
    status: 'active',
    role: 'manager',
    profile: {
      department: 'Operations',
      location: 'New York, NY',
      avatarUrl: '/avatars/sarah.jpg',
      bio: 'Operations manager focused on efficiency.',
      phone: '+1 (555) 200-2002',
    },
    security: {
      twoFactorEnabled: true,
      lastLogin: '2025-01-03T09:15:00Z',
      passwordChangedAt: '2024-11-15T00:00:00Z',
    },
    preferences: {
      emailNotifications: true,
      pushNotifications: false,
      theme: 'light',
      language: 'en',
    },
    partners: [
      { partnerId: '3', partnerName: 'AdNetwork Pro', role: 'main_user' },
    ],
    createdAt: '2024-02-20T00:00:00Z',
    updatedAt: '2025-01-02T14:20:00Z',
  },
  {
    id: 'u3',
    name: 'Mike Chen',
    email: 'mike@company.com',
    status: 'active',
    role: 'user',
    profile: {
      department: 'Sales',
      location: 'Austin, TX',
      avatarUrl: '/avatars/mike.jpg',
      bio: 'Sales representative specializing in enterprise accounts.',
      phone: '+1 (555) 300-3003',
    },
    security: {
      twoFactorEnabled: false,
      lastLogin: '2025-01-02T16:45:00Z',
      passwordChangedAt: '2024-10-20T00:00:00Z',
    },
    preferences: {
      emailNotifications: true,
      pushNotifications: true,
      theme: 'dark',
      language: 'en',
    },
    partners: [
      { partnerId: '1', partnerName: 'TechGlobal Inc.', role: 'manager' },
      { partnerId: '8', partnerName: 'ContentStream AI', role: 'manager' },
    ],
    createdAt: '2024-03-10T00:00:00Z',
    updatedAt: '2025-01-02T16:45:00Z',
  },
  {
    id: 'u4',
    name: 'Lisa Park',
    email: 'lisa@company.com',
    status: 'active',
    role: 'user',
    profile: {
      department: 'Marketing',
      location: 'Seattle, WA',
      avatarUrl: '/avatars/lisa.jpg',
      bio: 'Marketing specialist with a focus on digital campaigns.',
      phone: '+1 (555) 400-4004',
    },
    security: {
      twoFactorEnabled: false,
      lastLogin: '2025-01-01T11:20:00Z',
      passwordChangedAt: '2024-09-05T00:00:00Z',
    },
    preferences: {
      emailNotifications: false,
      pushNotifications: true,
      theme: 'system',
      language: 'en',
    },
    partners: [],
    createdAt: '2024-04-12T00:00:00Z',
    updatedAt: '2025-01-01T11:20:00Z',
  },
  {
    id: 'u5',
    name: 'Tom Wilson',
    email: 'tom@company.com',
    status: 'pending',
    role: 'viewer',
    profile: {
      department: 'Support',
      location: 'Chicago, IL',
      avatarUrl: '/avatars/tom.jpg',
      bio: 'Customer support representative.',
      phone: '+1 (555) 500-5005',
    },
    security: {
      twoFactorEnabled: false,
      lastLogin: undefined,
      passwordChangedAt: '2024-12-20T00:00:00Z',
    },
    preferences: {
      emailNotifications: true,
      pushNotifications: false,
      theme: 'light',
      language: 'en',
    },
    partners: [],
    createdAt: '2024-12-20T00:00:00Z',
    updatedAt: '2024-12-20T00:00:00Z',
  },
  {
    id: 'u6',
    name: 'Emily Davis',
    email: 'emily@company.com',
    status: 'inactive',
    role: 'manager',
    profile: {
      department: 'Operations',
      location: 'Boston, MA',
      avatarUrl: '/avatars/emily.jpg',
      bio: 'Former operations manager on leave.',
      phone: '+1 (555) 600-6006',
    },
    security: {
      twoFactorEnabled: true,
      lastLogin: '2024-11-01T08:00:00Z',
      passwordChangedAt: '2024-10-01T00:00:00Z',
    },
    preferences: {
      emailNotifications: true,
      pushNotifications: false,
      theme: 'system',
      language: 'en',
    },
    partners: [
      { partnerId: '6', partnerName: 'Internal Media Team', role: 'main_user' },
    ],
    createdAt: '2023-11-28T00:00:00Z',
    updatedAt: '2024-11-01T08:00:00Z',
  },
]

// Mock activity logs
const mockActivityLogs: Record<string, UserActivityLog[]> = {
  u1: [
    {
      id: 'al1',
      timestamp: '2025-01-03T10:30:00Z',
      level: 'info',
      eventType: 'user.login',
      description: 'User logged into the dashboard',
      actor: { id: 'u1', name: 'John Smith', email: 'john@company.com' },
      metadata: { ip: '192.168.1.100', browser: 'Chrome 120', location: 'San Francisco, CA' },
    },
    {
      id: 'al2',
      timestamp: '2025-01-03T09:45:00Z',
      level: 'warning',
      eventType: 'user.updated',
      description: 'User updated their profile',
      actor: { id: 'u1', name: 'John Smith', email: 'john@company.com' },
      metadata: { browser: 'Chrome 120' },
    },
  ],
  u2: [
    {
      id: 'al3',
      timestamp: '2025-01-03T09:15:00Z',
      level: 'info',
      eventType: 'user.login',
      description: 'User logged into the dashboard',
      actor: { id: 'u2', name: 'Sarah Johnson', email: 'sarah@company.com' },
      metadata: { ip: '192.168.1.101', browser: 'Edge 120', location: 'New York, NY' },
    },
  ],
}

// In-memory storage (simulates database)
let usersStore: User[] = [...defaultUsers]

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Get all users
 * GET /api/users
 */
export async function getAllUsers(): Promise<UserListResponse> {
  await delay(300)
  return {
    success: true,
    data: [...usersStore],
    total: usersStore.length,
  }
}

/**
 * Get user by ID
 * GET /api/users/:id
 */
export async function getUserById(id: string): Promise<UserListResponse> {
  await delay(200)
  const user = usersStore.find(u => u.id === id)

  if (!user) {
    return {
      success: false,
      message: 'User not found',
    }
  }

  return {
    success: true,
    data: [user],
  }
}

/**
 * Create a new user
 * POST /api/users
 */
export async function createUser(userData: UserCreateData): Promise<UserOperationResponse> {
  await delay(400)

  try {
    // Validate data
    const validation = validateUserData(userData)
    if (!validation.valid) {
      return {
        success: false,
        message: 'Validation failed',
        errors: validation.errors,
      }
    }

    // Check if email already exists
    const emailExists = usersStore.some(u => u.email.toLowerCase() === userData.email.toLowerCase())
    if (emailExists) {
      return {
        success: false,
        message: 'Email already exists',
        errors: { email: ['This email is already registered'] },
      }
    }

    // Create new user
    const newUser: User = {
      ...userData,
      id: `u${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    usersStore.push(newUser)

    return {
      success: true,
      message: 'User created successfully',
    }
  } catch (error) {
    return {
      success: false,
      message: 'Failed to create user',
    }
  }
}

/**
 * Update an existing user
 * PUT /api/users/:id
 */
export async function updateUser(id: string, userData: UserUpdateData): Promise<UserOperationResponse> {
  await delay(400)

  try {
    const userIndex = usersStore.findIndex(u => u.id === id)

    if (userIndex === -1) {
      return {
        success: false,
        message: 'User not found',
      }
    }

    // Validate data
    const validation = validateUserData(userData as UserCreateData, true)
    if (!validation.valid) {
      return {
        success: false,
        message: 'Validation failed',
        errors: validation.errors,
      }
    }

    // Check if email already exists (excluding current user)
    if (userData.email) {
      const emailExists = usersStore.some(
        u => u.id !== id && u.email.toLowerCase() === userData.email!.toLowerCase()
      )
      if (emailExists) {
        return {
          success: false,
          message: 'Email already exists',
          errors: { email: ['This email is already registered'] },
        }
      }
    }

    // Update user
    const updatedUser: User = {
      ...usersStore[userIndex],
      ...userData,
      updatedAt: new Date().toISOString(),
    }

    usersStore[userIndex] = updatedUser

    return {
      success: true,
      message: 'User updated successfully',
    }
  } catch (error) {
    return {
      success: false,
      message: 'Failed to update user',
    }
  }
}

/**
 * Delete a user
 * DELETE /api/users/:id
 */
export async function deleteUser(id: string): Promise<UserOperationResponse> {
  await delay(300)

  const userIndex = usersStore.findIndex(u => u.id === id)

  if (userIndex === -1) {
    return {
      success: false,
      message: 'User not found',
    }
  }

  usersStore.splice(userIndex, 1)

  return {
    success: true,
    message: 'User deleted successfully',
  }
}

/**
 * Get user activity logs
 * GET /api/users/:id/activity
 */
export async function getUserActivityLogs(id: string): Promise<UserActivityLog[]> {
  await delay(200)
  return mockActivityLogs[id] || []
}

/**
 * Get role permissions
 * GET /api/roles/:role/permissions
 */
export async function getRolePermissions(role: string): Promise<RolePermissions> {
  await delay(100)

  const permissions: Record<string, RolePermissions> = {
    admin: {
      canCreateUsers: true,
      canEditUsers: true,
      canDeleteUsers: true,
      canManagePartners: true,
      canViewAuditLogs: true,
      canManageSettings: true,
    },
    manager: {
      canCreateUsers: true,
      canEditUsers: true,
      canDeleteUsers: false,
      canManagePartners: true,
      canViewAuditLogs: true,
      canManageSettings: false,
    },
    user: {
      canCreateUsers: false,
      canEditUsers: false,
      canDeleteUsers: false,
      canManagePartners: false,
      canViewAuditLogs: false,
      canManageSettings: false,
    },
    viewer: {
      canCreateUsers: false,
      canEditUsers: false,
      canDeleteUsers: false,
      canManagePartners: false,
      canViewAuditLogs: true,
      canManageSettings: false,
    },
  }

  return permissions[role] || permissions.user
}

/**
 * Validate user data
 */
function validateUserData(
  data: UserCreateData,
  isUpdate: boolean = false
): { valid: boolean; errors?: Record<string, string[]> } {
  const errors: Record<string, string[]> = {}

  // Name validation
  if (!isUpdate || data.name !== undefined) {
    if (!data.name || data.name.length < 2) {
      errors.name = ['Name must be at least 2 characters']
    }
  }

  // Email validation
  if (!isUpdate || data.email !== undefined) {
    if (!data.email || !isValidEmail(data.email)) {
      errors.email = ['Invalid email format']
    }
  }

  // Phone validation (optional)
  if (data.profile?.phone && !isValidPhone(data.profile.phone)) {
    errors.phone = ['Invalid phone number format']
  }

  // Password validation (only on create)
  if (!isUpdate && data.security?.password) {
    if (data.security.password.length < 8) {
      errors.password = ['Password must be at least 8 characters']
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors: Object.keys(errors).length > 0 ? errors : undefined,
  }
}

/**
 * Helper function to validate email
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Helper function to validate phone
 */
function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/
  return phoneRegex.test(phone)
}

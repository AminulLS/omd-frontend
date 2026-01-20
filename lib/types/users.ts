import type { Role } from "./roles";

export type UserStatus = "active" | "inactive" | "suspended" | "banned";
export type UserType = "admin" | "partner";
export type PartnerUserRole = "admin" | "billing" | "reporting";

export interface User {
  id: string;
  name: string;
  email: string;
  status?: UserStatus;
  type?: UserType;
  created_at: string;
  updated_at: string;
  role?: string;

  // Add these optional properties to match what API may return
  partners: string[];
  profile?: UserProfile;
  security?: UserSecurity;
  preferences?: UserPreferences;
}

export interface UserWithRoles extends User {
  roles: Role[];
}

export interface UserFormData {
  name: string;
  email: string;
  password?: string;
  status: UserStatus;
  type: UserType;
  roles: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
    links: Array<{
      url: string | null;
      label: string;
      page: number | null;
      active: boolean;
    }>;
    path: string;
  };
  enums?: Record<string, Record<string, EnumValue>>;
}

export interface EnumValue {
  code: string;
  name: string;
  label: string;
  colo: string;
  icon: string;
}

export interface UserResponse {
  data: User | UserWithRoles;
}

export const statusVariantMap: Record<UserStatus, "default" | "secondary" | "destructive" | "outline"> = {
  active: "default",
  inactive: "secondary",
  suspended: "outline",
  banned: "destructive",
};

export const typeVariantMap: Record<UserType, "default" | "secondary"> = {
  admin: "default",
  partner: "secondary",
};

export const statusLabelMap: Record<UserStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  suspended: "Pending",
  banned: "Banned",
};

export const typeLabelMap: Record<UserType, string> = {
  admin: "Admin",
  partner: "Partner",
};

export const partnerUserRoleLabelMap: Record<PartnerUserRole, string> = {
  admin: "Admin",
  billing: "Billing",
  reporting: "Reporting",
};

export function isUserWithRoles(user: User | UserWithRoles): user is UserWithRoles {
  return "roles" in user && Array.isArray(user.roles);
}

// Keeping some previous types till UI is complete

export type SystemRole = "admin" | "manager" | "user" | "viewer";

export type PartnerRole = "main_user" | "manager";

export interface UserProfile {
  department: string;
  location: string;
  avatarUrl: string;
  bio: string;
  phone: string;
}

export interface UserSecurity {
  password?: string;
  twoFactorEnabled: boolean;
  lastLogin?: string;
  passwordChangedAt?: string;
}

export interface UserPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  theme: "light" | "dark" | "system";
  language: string;
}

export interface PartnerAssignment {
  partnerId: string;
  partnerName: string;
  role: PartnerRole;
}

export type UserCreateData = Omit<User, "id" | "createdAt" | "updatedAt">;

export type UserUpdateData = Partial<UserCreateData>;

export interface UserListResponse {
  success: boolean;
  data?: User[];
  message?: string;
  total?: number;
}

export interface UserOperationResponse {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface UserActivityLog {
  id: string;
  timestamp: string;
  level: "info" | "warning" | "error" | "critical";
  eventType: string;
  description: string;
  actor: {
    id: string;
    name: string;
    email: string;
  };
  metadata?: {
    ip?: string;
    browser?: string;
    location?: string;
  };
}

export interface RolePermissions {
  canCreateUsers: boolean;
  canEditUsers: boolean;
  canDeleteUsers: boolean;
  canManagePartners: boolean;
  canViewAuditLogs: boolean;
  canManageSettings: boolean;
}

export interface ExtendedUserFormData {
  // Core fields (currently in API)
  name: string;
  email: string;
  password?: string;
  status: UserStatus;
  type: UserType;
  roles: string[];

  // Extended fields (not in API yet, but shown in UI)
  phone: string;
  department: string;
  location: string;
  avatarUrl: string;
  bio: string;
  twoFactorEnabled: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  theme: "light" | "dark" | "system";
}

export const getDefaultUserFormData = (): ExtendedUserFormData => ({
  name: "",
  email: "",
  password: "",
  status: "active",
  type: "partner",
  roles: [],
  phone: "",
  department: "",
  location: "",
  avatarUrl: "",
  bio: "",
  twoFactorEnabled: false,
  emailNotifications: true,
  pushNotifications: false,
  theme: "system",
});

export const systemRoleVariantMap: Record<SystemRole, "default" | "secondary" | "outline"> = {
  admin: "default",
  manager: "secondary",
  user: "outline",
  viewer: "outline",
};

export const systemRoleLabelMap: Record<SystemRole, string> = {
  admin: "Admin",
  manager: "Manager",
  user: "User",
  viewer: "Viewer",
};

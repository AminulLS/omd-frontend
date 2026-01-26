export interface Permission {
  id: string;
  key: string;
  name: string;
  group: string;
  description?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PermissionFormData {
  key: string;
  name: string;
  group: string;
  description?: string | null;
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

export interface PermissionResponse {
  data: Permission;
}

export const permissionGroups = ["roles", "permissions", "users", "partners", "ads", "campaigns", "syndicates", "xmls", "listicles", "audit_logs"] as const;

export type PermissionGroup = (typeof permissionGroups)[number];

export const permissionActions = ["viewAny", "view", "create", "update", "delete", "restore", "emptyTrash", "forceDelete"] as const;

export type PermissionAction = (typeof permissionActions)[number];

export interface Role {
  id: string;
  key: string;
  name: string;
  abilities: string[];
  description?: string | null;
  created_at: string;
  updated_at: string;
}

export interface RoleFormData {
  key: string;
  name: string;
  description?: string | null;
  abilities: string[];
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

export interface RoleResponse {
  data: Role;
}

export function hasAllAbilities(role: Role): boolean {
  return role.abilities.includes("*");
}

export function hasAbility(role: Role, ability: string): boolean {
  return role.abilities.includes("*") || role.abilities.includes(ability);
}

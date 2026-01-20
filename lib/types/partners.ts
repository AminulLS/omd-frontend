export type PartnerStatus = "active" | "inactive" | "pending" | "suspended";
export type PartnerType = "internal" | "external";
export type ProductType = "sponsored" | "xml" | "publisher" | "syndication";
export type UserRole = "main_user" | "manager";
export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export interface Partner {
  id: string;
  name: string;
  email: string;
  phone: string;
  website: string;
  status: PartnerStatus;
  type: PartnerType;
  created_at: string;
  updated_at: string;

  users?: User[];
  products?: ProductType[];
}

export interface PartnerFormData {
  name: string;
  email: string;
  phone: string;
  website: string;
  type: PartnerType;
  status: PartnerStatus;
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

export interface PartnerResponse {
  data: Partner;
}

export const statusVariantMap: Record<PartnerStatus, "default" | "secondary" | "destructive" | "outline"> = {
  active: "default",
  inactive: "secondary",
  pending: "outline",
  suspended: "destructive",
};

export const typeVariantMap: Record<PartnerType, "default" | "secondary"> = {
  internal: "default",
  external: "secondary",
};

export const statusLabelMap: Record<PartnerStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  pending: "Pending",
  suspended: "Suspended",
};

export const typeLabelMap: Record<PartnerType, string> = {
  internal: "Internal",
  external: "External",
};

export const productLabelMap: Record<ProductType, string> = {
  sponsored: "Sponsored",
  xml: "XML",
  publisher: "Publisher",
  syndication: "Syndication",
};

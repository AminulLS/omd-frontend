import type { Partner } from '@/lib/types/partners'

export type SyndicateStatus = "active" | "inactive";
export type SyndicateType = "external" | "internal";

export interface Syndicate {
  id: string;
  partner_id: string;
  type: SyndicateType;
  status: SyndicateStatus;
  key: string;
  name: string;
  content: string;
  redirect_url: string | null;
  split: number | null;
  cpc: number | null;
  created_at: string;
  updated_at: string;
  partner?: Partner;
}

export interface SyndicateFormData {
  partner_id: string;
  type: SyndicateType;
  status: SyndicateStatus;
  key: string;
  name: string;
  content: string;
  redirect_url: string | null;
  split: number | null;
  cpc: number | null;
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

export interface SyndicateResponse {
  data: Syndicate;
}

export const statusVariantMap: Record<SyndicateStatus, "default" | "secondary"> = {
  active: "default",
  inactive: "secondary",
};

export const typeVariantMap: Record<SyndicateType, "default" | "secondary"> = {
  external: "default",
  internal: "secondary",
};

export const statusLabelMap: Record<SyndicateStatus, string> = {
  active: "Active",
  inactive: "Inactive",
};

export const typeLabelMap: Record<SyndicateType, string> = {
  external: "External",
  internal: "Internal",
};

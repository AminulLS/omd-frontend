export type CampaignStatus = "active" | "inactive" | "paused";

export type CampaignTrafficType = "unknown" | "search" | "display" | "in-path" | "SERP" | "email" | "sms" | "push" | "social" | "xml" | "dtl" | "mixed" | "Other";

export interface Campaign {
  id: string;
  partner_id: string;
  name: string;
  country: string;
  status: CampaignStatus;
  created_at: string;
  updated_at: string;
}

export interface CampaignFormData {
  partner_id: string;
  name: string;
  country: string;
  status: CampaignStatus;
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

export interface CampaignResponse {
  data: Campaign;
}

export const statusVariantMap: Record<CampaignStatus, "default" | "secondary" | "destructive"> = {
  active: "default",
  inactive: "secondary",
  paused: "destructive",
};

export const statusLabelMap: Record<CampaignStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  paused: "Paused",
};

export const trafficTypeLabelMap: Record<CampaignTrafficType, string> = {
  unknown: "Unknown",
  search: "Search",
  display: "Display",
  "in-path": "Path",
  SERP: "SERP",
  email: "Email",
  sms: "SMS",
  push: "Push",
  social: "Social",
  xml: "XML",
  dtl: "DTL",
  mixed: "Mixed",
  Other: "Other",
};

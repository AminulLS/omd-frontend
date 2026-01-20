export type AdStatus = "active" | "paused" | "pending" | "rejected";

export type AdPlacement = "path" | "serp-all" | "serp_offer" | "back_button" | "offer_1" | "offer_2" | "offer_3" | "offer_4" | "offer_5" | "offer_6" | "offer_7" | "medicare" | "health" | "blur" | "listical";

export type AdPricingType = "cpc" | "cpa" | "tcpa" | "rsoc" | "auto";

export type AdImagePriority = "high" | "low" | "any";

export type FilterOperator = "eq" | "neq" | "in" | "nin" | "gt" | "lt" | "gte" | "lte";

export interface AgeRangeRule {
  id: string;
  logic: "=" | "!=" | ">" | ">=" | "<" | "<=";
  value: string;
}

export interface AdFilter {
  key: string;
  op: FilterOperator;
  value: string | number | boolean | string[] | number[];
}

export interface AdMeta {
  company_name?: string | null;
  progress_button?: [string, null] | null;
  skip_button?: string | null;
  show_image?: "yes" | "no" | null;
  show_copy?: "yes" | "no" | null;
  disclaimer?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface AdSchedule {
  type: "default" | "custom";
  active: boolean;
  start: number;
  stop: number;
  cpc?: number | null;
  spend?: number | null;
  balance?: number | null;
}

export interface AdSchedules {
  Default?: AdSchedule[];
  Monday?: AdSchedule[];
  Tuesday?: AdSchedule[];
  Wednesday?: AdSchedule[];
  Thursday?: AdSchedule[];
  Friday?: AdSchedule[];
  Saturday?: AdSchedule[];
  Sunday?: AdSchedule[];
}

export interface Ad {
  id: string;
  partner_id: string;
  copy: string;
  nickname: string;
  title: string;
  public_nickname: string;
  image_url: string | null;
  image_priority: AdImagePriority;
  placement: AdPlacement;
  pricing_type: AdPricingType;
  pricing_type_value: string | null;
  original_url?: string;
  append_reg_ssl?: string | null;
  append_reg_key_ssl: string | null;
  status: AdStatus;
  gtm_tracking?: string;
  conversion_window: string | null;
  newalg: "yes" | "no" | null;
  notes: string | null;
  category: string;
  country: string;
  boards: string[];
  filters: AdFilter[];
  meta: AdMeta;
  schedules?: AdSchedules;
  created_at: string;
  updated_at: string;
  duplicate_window?: number | null;
  no_click_tcpa_alg?: boolean | null;
}

export interface AdFormData {
  partner_id: string;
  copy: string;
  nickname: string;
  title: string;
  public_nickname: string;
  image_url?: string | null;
  image_priority: AdImagePriority;
  placement: AdPlacement;
  pricing_type: AdPricingType;
  pricing_type_value?: string | null;
  original_url?: string;
  append_reg_key?: string | null;
  append_reg_key_ssl?: string | null;
  status: AdStatus;
  gtm_tracking?: string;
  conversion_window?: string | null;
  newalg?: "yes" | "no" | null;
  notes?: string | null;
  category: string;
  country: string;
  boards: string[];
  filters: AdFilter[];
  meta: AdMeta;
  schedules?: AdSchedules;
  prepop?: string | null;
  target_cpa?: number | null;
  org_url?: string;
  duplicate_window?: number | null;
  no_click_tcpa_alg?: boolean | null;
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

export interface AdResponse {
  data: Ad;
}

export const statusVariantMap: Record<AdStatus, "default" | "secondary" | "destructive" | "outline"> = {
  active: "default",
  paused: "secondary",
  pending: "outline",
  rejected: "destructive",
};

export const pricingTypeVariantMap: Record<AdPricingType, "default" | "secondary" | "outline"> = {
  cpc: "default",
  cpa: "secondary",
  tcpa: "outline",
  rsoc: "outline",
  auto: "outline",
};

export const statusLabelMap: Record<AdStatus, string> = {
  active: "Active",
  paused: "Paused",
  pending: "Pending",
  rejected: "Rejected",
};

export const pricingTypeLabelMap: Record<AdPricingType, string> = {
  cpc: "CPC",
  cpa: "True CPA",
  tcpa: "Target CPA",
  rsoc: "RSOC (API Rev)",
  auto: "Auto (Rev Event)",
};

export const placementLabelMap: Partial<Record<AdPlacement, string>> = {
  path: "Path (All)",
  "serp-all": "SERP All",
  serp_offer: "SERP Offers",
  back_button: "Back Button",
  offer_1: "Promo 1",
  offer_2: "Promo 2",
  offer_3: "Promo 3",
  offer_4: "Promo 4",
  offer_5: "Promo 5",
  offer_6: "Promo 6",
  offer_7: "Promo 7",
  medicare: "Medicare",
  health: "Health",
  blur: "Large Image Ad (Blur)",
  listical: "Listical",
};

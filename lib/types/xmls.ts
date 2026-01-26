export type XmlStatus = "active" | "paused";

export interface Xml {
  id: string;
  partner_id: string;
  name: string;
  country: string;
  status: XmlStatus;
  xml_feed_url: string;
  created_at: string;
  updated_at: string;
}

export interface XmlFormData {
  partner_id: string;
  name: string;
  country: string;
  status: XmlStatus;
  xml_feed_url: string;
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

export interface XmlResponse {
  data: Xml;
}

export const statusVariantMap: Record<XmlStatus, "default" | "secondary"> = {
  active: "default",
  paused: "secondary",
};

export const statusLabelMap: Record<XmlStatus, string> = {
  active: "Active",
  paused: "Paused",
};

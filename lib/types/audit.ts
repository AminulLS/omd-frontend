/* eslint-disable @typescript-eslint/no-explicit-any */

export interface AuditLogApiResponse {
  id: string;
  action: "created" | "updated" | "deleted";
  resource_type: string;
  resource_id: string;
  causer_id: string;
  causer_type: string;
  causer_name: string;
  before: Record<string, any> | null;
  after: Record<string, any> | null;
  changes: Record<string, any> | null;
  data: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export type AuditLogLevel = "info" | "warning" | "error" | "critical";
export type AuditAction = "created" | "updated" | "deleted";
export type AuditResourceType = "campaign" | "ad" | "partner" | "user" | "xml" | "syndicate" | "listicle" | "settings" | "acl" | "unknown";

export interface AuditLog {
  id: string;
  timestamp: string;
  action: AuditAction;
  resourceType: AuditResourceType;
  resourceId: string;
  resourceName: string;

  actorId: string;
  actorName: string;
  actorType: string;

  before: Record<string, any> | null;
  after: Record<string, any> | null;
  changes: Record<string, any> | null;

  eventType: string;
  description: string;

  level: AuditLogLevel;
  actorEmail?: string;
  actorIpAddress?: string;
  actorUserAgent?: string;
  metadata?: {
    footprints?: {
      browser?: string;
      os?: string;
      device?: string;
      location?: string;
    };
  };
}

export interface PaginatedAuditLogsResponse {
  data: AuditLogApiResponse[];
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
}

export const actionLabelMap: Record<AuditAction, string> = {
  created: "Created",
  updated: "Updated",
  deleted: "Deleted",
};

export const actionVariantMap: Record<AuditAction, "default" | "secondary" | "destructive"> = {
  created: "default",
  updated: "secondary",
  deleted: "destructive",
};

export const resourceTypeLabelMap: Record<AuditResourceType, string> = {
  campaign: "Campaign",
  ad: "Sponsored Ad",
  partner: "Partner",
  user: "User",
  xml: "XML",
  syndicate: "Syndicate",
  listicle: "Listicle",
  settings: "Settings",
  acl: "Access Control",
  unknown: "Unknown",
};

export const levelVariantMap: Record<AuditLogLevel, "default" | "secondary" | "destructive" | "outline"> = {
  info: "default",
  warning: "outline",
  error: "destructive",
  critical: "destructive",
};

export const levelLabelMap: Record<AuditLogLevel, string> = {
  info: "Info",
  warning: "Warning",
  error: "Error",
  critical: "Critical",
};

export interface AuditLogFilters {
  search?: string;
  action?: AuditAction | "all";
  resourceType?: AuditResourceType | "all";
  level?: AuditLogLevel | "all";
  causerId?: string;
  dateFrom?: string;
  dateTo?: string;
}

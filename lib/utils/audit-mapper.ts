import type { AuditLogApiResponse, AuditLog, AuditResourceType, AuditLogLevel } from "@/lib/types/audit";

/**
 * Extracts clean resource type from Laravel model class path
 * @example "App\\Domain\\Campaigns\\Models\\Campaign" → "campaign"
 */
function extractResourceType(resourceType: string): AuditResourceType {
  const match = resourceType.match(/\\([^\\]+)$/);
  const type = match ? match[1].toLowerCase() : "unknown";

  // Map known types
  const typeMap: Record<string, AuditResourceType> = {
    campaign: "campaign",
    ad: "ad",
    partner: "partner",
    user: "user",
    xml: "xml",
    syndicate: "syndicate",
    listicle: "listicle",
    setting: "settings",
    acl: "acl",
  };

  return typeMap[type] || "unknown";
}

/**
 * Extracts the actual ID string, handling MongoDB $oid wrapper
 */
function extractId(id: string | { $oid: string }): string {
  if (typeof id === "string") return id;
  return id.$oid;
}

/**
 * Extracts resource name from the data object
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractResourceName(data: Record<string, any>, resourceType: AuditResourceType): string {
  // Try common name fields
  if (data.name) return data.name;
  if (data.title) return data.title;
  if (data.nickname) return data.nickname;

  // Fallback to ID or type
  return `${resourceType} ${extractId(data.id || "")}`;
}

/**
 * Generates event type string
 * @example "updated", "campaign" → "campaign.updated"
 */
function generateEventType(action: string, resourceType: AuditResourceType): string {
  return `${resourceType}.${action}`;
}

/**
 * Generates human-readable description
 */
function generateDescription(action: string, resourceType: AuditResourceType, resourceName: string, actorName: string): string {
  const actionMap: Record<string, string> = {
    created: "created",
    updated: "updated",
    deleted: "deleted",
  };

  const verb = actionMap[action] || "modified";
  return `${actorName} ${verb} ${resourceType} "${resourceName}"`;
}

/**
 * Determines log level based on action and resource type
 * (Dummy logic until API provides real levels)
 */
function determineLevel(action: string, resourceType: AuditResourceType): AuditLogLevel {
  if (action === "deleted") {
    // Deletions are more critical
    return ["user", "partner", "acl"].includes(resourceType) ? "critical" : "warning";
  }

  if (action === "created") {
    return "info";
  }

  // Updates
  if (resourceType === "acl" || resourceType === "settings") {
    return "warning";
  }

  return "info";
}

/**
 * Cleans and normalizes the before/after/changes objects
 * Handles MongoDB $oid wrappers in nested objects
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function cleanDataObject(obj: Record<string, any> | null): Record<string, any> | null {
  if (!obj) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cleaned: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (value && typeof value === "object" && "$oid" in value) {
      cleaned[key] = value.$oid;
    } else {
      cleaned[key] = value;
    }
  }

  return cleaned;
}

/**
 * Main mapper function: Converts API response to UI format
 */
export function mapAuditLogApiToUi(apiLog: AuditLogApiResponse): AuditLog {
  const resourceType = extractResourceType(apiLog.resource_type);
  const resourceName = extractResourceName(apiLog.data, resourceType);
  const eventType = generateEventType(apiLog.action, resourceType);
  const description = generateDescription(apiLog.action, resourceType, resourceName, apiLog.causer_name);
  const level = determineLevel(apiLog.action, resourceType);

  return {
    // Core fields
    id: apiLog.id,
    timestamp: apiLog.created_at,
    action: apiLog.action,
    resourceType,
    resourceId: extractId(apiLog.resource_id),
    resourceName,

    // Actor info
    actorId: apiLog.causer_id,
    actorName: apiLog.causer_name,
    actorType: apiLog.causer_type,

    // Change tracking
    before: cleanDataObject(apiLog.before),
    after: cleanDataObject(apiLog.after),
    changes: cleanDataObject(apiLog.changes),

    // Generated fields
    eventType,
    description,
    level,

    // Dummy fields (not in API yet)
    actorEmail: undefined,
    actorIpAddress: undefined,
    actorUserAgent: undefined,
    metadata: undefined,
  };
}

/**
 * Maps array of API logs to UI format
 */
export function mapAuditLogsApiToUi(apiLogs: AuditLogApiResponse[]): AuditLog[] {
  return apiLogs.map(mapAuditLogApiToUi);
}

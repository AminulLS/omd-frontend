import api from "@/lib/config/axios";
import type { AuditLogApiResponse, PaginatedAuditLogsResponse, AuditLogFilters } from "@/lib/types/audit";

const AUDIT_LOGS_ENDPOINT = "/audits/logs";

export interface GetAuditLogsParams extends AuditLogFilters {
  page?: number;
  per_page?: number;
}

export async function getAllAuditLogs(params?: GetAuditLogsParams): Promise<PaginatedAuditLogsResponse> {
  const response = await api.get<PaginatedAuditLogsResponse>(AUDIT_LOGS_ENDPOINT, {
    params,
  });
  return response.data;
}

export async function getAuditLogById(id: string): Promise<AuditLogApiResponse> {
  const response = await api.get<{ data: AuditLogApiResponse }>(`${AUDIT_LOGS_ENDPOINT}/${id}`);
  return response.data.data;
}

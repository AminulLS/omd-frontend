import api from "@/lib/config/axios";
import type { Permission, PermissionFormData, PermissionResponse, PaginatedResponse } from "@/lib/types/permissions";

const PERMISSIONS_ENDPOINT = "/api/v1/permissions";

export interface GetPermissionsParams {
  page?: number;
  per_page?: number;
  search?: string;
  group?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export async function getAllPermissions(params?: GetPermissionsParams): Promise<PaginatedResponse<Permission>> {
  const response = await api.get<PaginatedResponse<Permission>>(PERMISSIONS_ENDPOINT, {
    params,
  });
  return response.data;
}

export async function getPermissionById(id: string): Promise<Permission> {
  const response = await api.get<PermissionResponse>(`${PERMISSIONS_ENDPOINT}/${id}`);
  return response.data.data;
}

export async function createPermission(data: PermissionFormData): Promise<Permission> {
  const response = await api.post<PermissionResponse>(PERMISSIONS_ENDPOINT, data);
  return response.data.data;
}

export async function updatePermission(id: string, data: PermissionFormData): Promise<Permission> {
  const response = await api.put<PermissionResponse>(`${PERMISSIONS_ENDPOINT}/${id}`, data);
  return response.data.data;
}

export async function deletePermission(id: string): Promise<void> {
  await api.delete(`${PERMISSIONS_ENDPOINT}/${id}`);
}

import api from "@/lib/config/axios";
import type { Role, RoleFormData, RoleResponse, PaginatedResponse } from "@/lib/types/roles";

const ROLES_ENDPOINT = "/roles";

export interface GetRolesParams {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export async function getAllRoles(params?: GetRolesParams): Promise<PaginatedResponse<Role>> {
  const response = await api.get<PaginatedResponse<Role>>(ROLES_ENDPOINT, {
    params,
  });
  return response.data;
}

export async function getRoleById(id: string): Promise<Role> {
  const response = await api.get<RoleResponse>(`${ROLES_ENDPOINT}/${id}`);
  return response.data.data;
}

export async function createRole(data: RoleFormData): Promise<Role> {
  const response = await api.post<RoleResponse>(ROLES_ENDPOINT, data);
  return response.data.data;
}

export async function updateRole(id: string, data: RoleFormData): Promise<Role> {
  const response = await api.put<RoleResponse>(`${ROLES_ENDPOINT}/${id}`, data);
  return response.data.data;
}

export async function deleteRole(id: string): Promise<void> {
  await api.delete(`${ROLES_ENDPOINT}/${id}`);
}

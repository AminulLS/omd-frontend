import api from "@/lib/config/axios";
import type { User, UserWithRoles, UserFormData, UserResponse, PaginatedResponse } from "@/lib/types/users";

const USERS_ENDPOINT = "/users";

export interface GetUsersParams {
  page?: number;
  per_page?: number;
  search?: string;
  status?: "active" | "inactive" | "suspended" | "banned";
  type?: "admin" | "partner";
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export async function getAllUsers(params?: GetUsersParams): Promise<PaginatedResponse<User> | PaginatedResponse<UserWithRoles>> {
  const response = await api.get<PaginatedResponse<User> | PaginatedResponse<UserWithRoles>>(USERS_ENDPOINT, {
    params,
  });
  return response.data;
}

export async function getUserById(id: string, withRoles: boolean = false): Promise<User | UserWithRoles> {
  const params = withRoles ? { with: "roles" } : undefined;
  const response = await api.get<UserResponse>(`${USERS_ENDPOINT}/${id}`, { params });
  return response.data.data;
}

export async function createUser(data: UserFormData): Promise<User> {
  const response = await api.post<UserResponse>(USERS_ENDPOINT, data);
  return response.data.data as User;
}

export async function updateUser(id: string, data: Partial<UserFormData>): Promise<User> {
  const response = await api.put<UserResponse>(`${USERS_ENDPOINT}/${id}`, data);
  return response.data.data as User;
}

export async function deleteUser(id: string): Promise<void> {
  await api.delete(`${USERS_ENDPOINT}/${id}`);
}

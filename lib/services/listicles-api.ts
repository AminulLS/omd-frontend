import api from "@/lib/config/axios";
import type { Listicle, ListicleWithAds, ListicleFormData, ListicleResponse, PaginatedResponse } from "@/lib/types/listicles";

const LISTICLES_ENDPOINT = "/listicles";

export interface GetListiclesParams {
  page?: number;
  per_page?: number;
  search?: string;
  design_type?: "style1" | "style2";
  sort_by?: string;
  sort_order?: "asc" | "desc";
  with?: string;
}

export async function getAllListicles(params?: GetListiclesParams): Promise<PaginatedResponse<Listicle> | PaginatedResponse<ListicleWithAds>> {
  const response = await api.get<PaginatedResponse<Listicle> | PaginatedResponse<ListicleWithAds>>(LISTICLES_ENDPOINT, {
    params,
  });
  return response.data;
}

export async function getListicleById(id: string, params: GetListiclesParams): Promise<Listicle | ListicleWithAds> {
  const response = await api.get<ListicleResponse>(`${LISTICLES_ENDPOINT}/${id}`, { params });
  return response.data.data;
}

export async function createListicle(data: ListicleFormData): Promise<Listicle> {
  const response = await api.post<ListicleResponse>(LISTICLES_ENDPOINT, data);
  return response.data.data as Listicle;
}

export async function updateListicle(id: string, data: ListicleFormData): Promise<Listicle> {
  const response = await api.put<ListicleResponse>(`${LISTICLES_ENDPOINT}/${id}`, data);
  return response.data.data as Listicle;
}

export async function deleteListicle(id: string): Promise<void> {
  await api.delete(`${LISTICLES_ENDPOINT}/${id}`);
}

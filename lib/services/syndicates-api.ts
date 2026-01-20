import api from "@/lib/config/axios";
import type { Syndicate, SyndicateFormData, SyndicateResponse, PaginatedResponse } from "@/lib/types/syndicates";

const SYNDICATES_ENDPOINT = "/syndicates";

export interface GetSyndicatesParams {
  page?: number;
  per_page?: number;
  search?: string;
  status?: "active" | "inactive";
  type?: "external" | "internal";
  partner_id?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export async function getAllSyndicates(params?: GetSyndicatesParams): Promise<PaginatedResponse<Syndicate>> {
  const response = await api.get<PaginatedResponse<Syndicate>>(SYNDICATES_ENDPOINT, {
    params,
  });
  return response.data;
}

export async function getSyndicateById(id: string): Promise<Syndicate> {
  const response = await api.get<SyndicateResponse>(`${SYNDICATES_ENDPOINT}/${id}`);
  return response.data.data;
}

export async function createSyndicate(data: SyndicateFormData): Promise<Syndicate> {
  const response = await api.post<SyndicateResponse>(SYNDICATES_ENDPOINT, data);
  return response.data.data;
}

export async function updateSyndicate(id: string, data: SyndicateFormData): Promise<Syndicate> {
  const response = await api.put<SyndicateResponse>(`${SYNDICATES_ENDPOINT}/${id}`, data);
  return response.data.data;
}

export async function deleteSyndicate(id: string): Promise<void> {
  await api.delete(`${SYNDICATES_ENDPOINT}/${id}`);
}

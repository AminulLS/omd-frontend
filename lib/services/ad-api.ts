import api from "@/lib/config/axios";
import type { Ad, AdFormData, AdResponse, PaginatedResponse } from "@/lib/types/ads";

const ADS_ENDPOINT = "/ads";

export interface GetAdsParams {
  page?: number;
  per_page?: number;
  search?: string;
  status?: "active" | "paused" | "pending" | "rejected";
  partner_id?: string;
  placement?: string;
  pricing_type?: "cpc" | "cpa" | "tcpa" | "rsoc" | "auto";
  category?: string;
  country?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export async function getAllAds(params?: GetAdsParams): Promise<PaginatedResponse<Ad>> {
  const response = await api.get<PaginatedResponse<Ad>>(ADS_ENDPOINT, {
    params,
  });
  return response.data;
}

export async function getAdById(id: string): Promise<Ad> {
  const response = await api.get<AdResponse>(`${ADS_ENDPOINT}/${id}`);
  return response.data.data;
}

export async function createAd(data: AdFormData): Promise<Ad> {
  const response = await api.post<AdResponse>(ADS_ENDPOINT, data);
  return response.data.data;
}

export async function updateAd(id: string, data: AdFormData): Promise<Ad> {
  const response = await api.put<AdResponse>(`${ADS_ENDPOINT}/${id}`, data);
  return response.data.data;
}

export async function deleteAd(id: string): Promise<void> {
  await api.delete(`${ADS_ENDPOINT}/${id}`);
}

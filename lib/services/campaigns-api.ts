import api from "@/lib/config/axios";
import type { Campaign, CampaignFormData, CampaignResponse, PaginatedResponse } from "@/lib/types/campaigns";

const CAMPAIGNS_ENDPOINT = "/campaigns";

export interface GetCampaignsParams {
  page?: number;
  per_page?: number;
  search?: string;
  status?: "active" | "inactive" | "paused";
  partner_id?: string;
  country?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export async function getAllCampaigns(params?: GetCampaignsParams): Promise<PaginatedResponse<Campaign>> {
  const response = await api.get<PaginatedResponse<Campaign>>(CAMPAIGNS_ENDPOINT, {
    params,
  });
  return response.data;
}

export async function getCampaignById(id: string): Promise<Campaign> {
  const response = await api.get<CampaignResponse>(`${CAMPAIGNS_ENDPOINT}/${id}`);
  return response.data.data;
}

export async function createCampaign(data: CampaignFormData): Promise<Campaign> {
  const response = await api.post<CampaignResponse>(CAMPAIGNS_ENDPOINT, data);
  return response.data.data;
}

export async function updateCampaign(id: string, data: CampaignFormData): Promise<Campaign> {
  const response = await api.put<CampaignResponse>(`${CAMPAIGNS_ENDPOINT}/${id}`, data);
  return response.data.data;
}

export async function deleteCampaign(id: string): Promise<void> {
  await api.delete(`${CAMPAIGNS_ENDPOINT}/${id}`);
}

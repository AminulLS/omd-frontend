import api from "@/lib/config/axios";
import type { Partner, PartnerFormData, PartnerResponse, PaginatedResponse } from "@/lib/types/partners";

const PARTNERS_ENDPOINT = "/partners";

export interface GetPartnersParams {
  page?: number;
  per_page?: number;
  search?: string;
  status?: "active" | "inactive";
  type?: "internal" | "external";
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export async function getAllPartners(params?: GetPartnersParams): Promise<PaginatedResponse<Partner>> {
  const response = await api.get<PaginatedResponse<Partner>>(PARTNERS_ENDPOINT, {
    params,
  });
  return response.data;
}

export async function getPartnerById(id: string): Promise<Partner> {
  const response = await api.get<PartnerResponse>(`${PARTNERS_ENDPOINT}/${id}`);
  return response.data.data;
}

export async function createPartner(data: PartnerFormData): Promise<Partner> {
  const response = await api.post<PartnerResponse>(PARTNERS_ENDPOINT, data);
  return response.data.data;
}

export async function updatePartner(id: string, data: PartnerFormData): Promise<Partner> {
  const response = await api.put<PartnerResponse>(`${PARTNERS_ENDPOINT}/${id}`, data);
  return response.data.data;
}

export async function deletePartner(id: string): Promise<void> {
  await api.delete(`${PARTNERS_ENDPOINT}/${id}`);
}

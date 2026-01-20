import api from "@/lib/config/axios";
import type { Xml, XmlFormData, XmlResponse, PaginatedResponse } from "@/lib/types/xmls";

const XMLS_ENDPOINT = "/xmls";

export interface GetXmlsParams {
  page?: number;
  per_page?: number;
  search?: string;
  status?: "active" | "paused";
  partner_id?: string;
  country?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export async function getAllXmls(params?: GetXmlsParams): Promise<PaginatedResponse<Xml>> {
  const response = await api.get<PaginatedResponse<Xml>>(XMLS_ENDPOINT, {
    params,
  });
  return response.data;
}

export async function getXmlById(id: string): Promise<Xml> {
  const response = await api.get<XmlResponse>(`${XMLS_ENDPOINT}/${id}`);
  return response.data.data;
}

export async function createXml(data: XmlFormData): Promise<Xml> {
  const response = await api.post<XmlResponse>(XMLS_ENDPOINT, data);
  return response.data.data;
}

export async function updateXml(id: string, data: XmlFormData): Promise<Xml> {
  const response = await api.put<XmlResponse>(`${XMLS_ENDPOINT}/${id}`, data);
  return response.data.data;
}

export async function deleteXml(id: string): Promise<void> {
  await api.delete(`${XMLS_ENDPOINT}/${id}`);
}

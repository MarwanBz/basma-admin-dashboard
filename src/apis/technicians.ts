import {
  ApiResponse,
  GetTechnicianResponse,
  GetTechniciansResponse,
  Technician,
} from "@/types/request";

import { apiClient } from "./client";

/**
 * Get all technicians with optional filtering
 */
export async function getTechnicians(): Promise<GetTechniciansResponse> {
  const response = await apiClient.get<GetTechniciansResponse>(`technicians`);
  return response.data;
}

/**
 * Get single technician by ID
 */
export async function getTechnicianById(
  id: string
): Promise<GetTechnicianResponse> {
  const response = await apiClient.get<GetTechnicianResponse>(
    `technicians/${id}`
  );
  return response.data;
}

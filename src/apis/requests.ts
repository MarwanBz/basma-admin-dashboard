import {
  ApiResponse,
  AssignTechnicianRequest,
  CreateRequestRequest,
  GetRequestsResponse,
  MaintenanceRequest,
  UpdateRequestRequest,
  UpdateStatusRequest,
} from "@/types/request";

import { apiClient } from "./client";

/**
 * Get all requests with optional filtering and pagination
 */
export async function getRequests(params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}): Promise<GetRequestsResponse> {
  const searchParams = new URLSearchParams();

  if (params?.page) searchParams.append("page", params.page.toString());
  if (params?.limit) searchParams.append("limit", params.limit.toString());
  if (params?.status) searchParams.append("status", params.status);
  if (params?.search) searchParams.append("search", params.search);

  const queryString = searchParams.toString();
  const url = queryString ? `requests?${queryString}` : "requests";

  const response = await apiClient.get<GetRequestsResponse>(url);
  return response.data;
}

/**
 * Get single request by ID
 */
export async function getRequestById(
  id: string
): Promise<ApiResponse<MaintenanceRequest>> {
  const response = await apiClient.get<ApiResponse<MaintenanceRequest>>(
    `requests/${id}`
  );
  return response.data;
}

/**
 * Create new request
 */
export async function createRequest(
  data: CreateRequestRequest
): Promise<ApiResponse<MaintenanceRequest>> {
  const response = await apiClient.post<ApiResponse<MaintenanceRequest>>(
    "requests",
    data
  );
  return response.data;
}

/**
 * Update existing request
 */
export async function updateRequest(
  id: string,
  data: UpdateRequestRequest
): Promise<ApiResponse<MaintenanceRequest>> {
  const response = await apiClient.put<ApiResponse<MaintenanceRequest>>(
    `requests/${id}`,
    data
  );
  return response.data;
}

/**
 * Delete request
 */
export async function deleteRequest(id: string): Promise<ApiResponse<null>> {
  const response = await apiClient.delete<ApiResponse<null>>(`requests/${id}`);
  return response.data;
}

/**
 * Assign technician to request
 */
export async function assignTechnician(
  requestId: string,
  data: AssignTechnicianRequest
): Promise<ApiResponse<MaintenanceRequest>> {
  const response = await apiClient.post<ApiResponse<MaintenanceRequest>>(
    `requests/${requestId}/assign`,
    data
  );
  return response.data;
}

/**
 * Update request status
 */
export async function updateRequestStatus(
  requestId: string,
  data: UpdateStatusRequest
): Promise<ApiResponse<MaintenanceRequest>> {
  const response = await apiClient.patch<ApiResponse<MaintenanceRequest>>(
    `requests/${requestId}/status`,
    data
  );
  return response.data;
}

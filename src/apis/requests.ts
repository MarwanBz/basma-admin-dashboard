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
  sortBy?: "status" | "title" | "priority" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
  status?:
    | "DRAFT"
    | "SUBMITTED"
    | "ASSIGNED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CLOSED"
    | "REJECTED";
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  categoryId?: number;
  assignedToId?: string;
  requestedById?: string;
  building?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}): Promise<GetRequestsResponse> {
  const searchParams = new URLSearchParams();

  if (params?.page) searchParams.append("page", params.page.toString());
  if (params?.limit) searchParams.append("limit", params.limit.toString());
  if (params?.sortBy) searchParams.append("sortBy", params.sortBy);
  if (params?.sortOrder) searchParams.append("sortOrder", params.sortOrder);
  if (params?.status) searchParams.append("status", params.status);
  if (params?.priority) searchParams.append("priority", params.priority);
  if (params?.categoryId)
    searchParams.append("categoryId", params.categoryId.toString());
  if (params?.assignedToId)
    searchParams.append("assignedToId", params.assignedToId);
  if (params?.requestedById)
    searchParams.append("requestedById", params.requestedById);
  if (params?.building) searchParams.append("building", params.building);
  if (params?.search) searchParams.append("search", params.search);
  if (params?.dateFrom) searchParams.append("dateFrom", params.dateFrom);
  if (params?.dateTo) searchParams.append("dateTo", params.dateTo);

  const queryString = searchParams.toString();
  const url = queryString ? `maintenance-requests?${queryString}` : "maintenance-requests";

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
    `maintenance-requests/${id}`
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
    "maintenance-requests",
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
    `maintenance-requests/${id}`,
    data
  );
  return response.data;
}

/**
 * Delete request
 */
export async function deleteRequest(id: string): Promise<ApiResponse<null>> {
  const response = await apiClient.delete<ApiResponse<null>>(`maintenance-requests/${id}`);
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
    `maintenance-requests/${requestId}/assign`,
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
    `maintenance-requests/${requestId}/status`,
    data
  );
  return response.data;
}

export type RequestStatus =
  | "pending"
  | "assigned"
  | "in-progress"
  | "completed"
  | "rejected";
export type RequestPriority = "low" | "medium" | "high" | "urgent";
export type RequestCategory =
  | "HVAC"
  | "Electrical"
  | "Plumbing"
  | "Carpentry"
  | "General"
  | "Other";

export interface MaintenanceRequest {
  id: string;
  title: string;
  description: string;
  location: string;
  priority: RequestPriority;
  status: RequestStatus;
  category: RequestCategory;
  assignedTo: string | null;
  assignedToName?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export interface Technician {
  id: string;
  name: string;
  email: string;
  specialization: string;
  status: "available" | "busy" | "on-leave";
  phone?: string;
}

export interface CreateRequestFormData {
  title: string;
  description: string;
  location: string;
  priority: RequestPriority;
  category: RequestCategory;
}

export interface CreateRequestRequest {
  title: string;
  description: string;
  location: string;
  priority: RequestPriority;
  category: RequestCategory;
}

export interface UpdateRequestRequest {
  title?: string;
  description?: string;
  location?: string;
  priority?: RequestPriority;
  category?: RequestCategory;
  status?: RequestStatus;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  requestId: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface RequestsResponse {
  requests: MaintenanceRequest[];
  pagination: Pagination;
}

export interface GetRequestsResponse extends ApiResponse<RequestsResponse> {}

export interface FormErrors {
  [key: string]: string;
}

export interface TabItem {
  id: string;
  label: string;
}

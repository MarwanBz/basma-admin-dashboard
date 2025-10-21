export type RequestStatus =
  | "SUBMITTED"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "REJECTED";
export type RequestPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface Category {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserBasic {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "TECHNICIAN" | "SUPER_ADMIN";
}

export interface MaintenanceRequest {
  id: string;
  title: string;
  description: string;
  priority: RequestPriority;
  status: RequestStatus;
  categoryId: number;
  location: string;
  building: string;
  specificLocation: string;
  requestedById: string;
  assignedToId: string | null;
  assignedById: string | null;
  estimatedCost: string | null;
  actualCost: string | null;
  scheduledDate: string | null;
  completedDate: string | null;
  createdAt: string;
  updatedAt: string;
  category: Category;
  requestedBy: UserBasic;
  assignedTo: UserBasic | null;
  assignedBy: UserBasic | null;
  _count: {
    comments: number;
  };
}

export interface Technician {
  id: string;
  name: string;
  email: string;
  role: "TECHNICIAN";
  createdAt: string;
  updatedAt: string;
}

export interface CreateRequestFormData {
  title: string;
  description: string;
  location: string;
  building: string;
  specificLocation: string;
  priority: RequestPriority;
  categoryId: number;
}

export interface CreateRequestRequest {
  title: string;
  description: string;
  location: string;
  building: string;
  specificLocation: string;
  priority: RequestPriority;
  categoryId: number;
}

export interface UpdateRequestRequest {
  title?: string;
  description?: string;
  location?: string;
  building?: string;
  specificLocation?: string;
  priority?: RequestPriority;
  categoryId?: number;
  status?: RequestStatus;
  estimatedCost?: string;
  actualCost?: string;
  scheduledDate?: string;
  completedDate?: string;
}

export interface AssignTechnicianRequest {
  assignedToId: string;
  reason?: string;
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
  totalPages: number;
}

export interface RequestsResponse {
  requests: MaintenanceRequest[];
  pagination: Pagination;
}

export type GetRequestsResponse = ApiResponse<RequestsResponse>;

export interface FormErrors {
  [key: string]: string;
}

export interface TabItem {
  id: string;
  label: string;
}

// Technician API response types
export interface TechniciansResponse {
  technicians: Technician[];
  pagination: Pagination;
}

export type GetTechniciansResponse = ApiResponse<TechniciansResponse>;
export type GetTechnicianResponse = ApiResponse<Technician>;

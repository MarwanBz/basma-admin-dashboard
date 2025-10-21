// Simple building configuration types

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface BuildingConfig {
  id: string;
  buildingName: string;
  buildingCode: string;
  displayName: string;
  allowCustomId: boolean;
  currentSequence: number;
  lastResetYear: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  creator: User;
}

export interface RequestsByStatus {
  _count: number;
  status: string;
}

export interface RequestsByPriority {
  _count: number;
  priority: string;
}

export interface RecentRequest {
  id: string;
  customIdentifier: string | null;
  title: string;
  status: string;
  priority: string;
  createdAt: string;
}

export interface BuildingStatistics {
  totalRequests: number;
  requestsByStatus: RequestsByStatus[];
  requestsByPriority: RequestsByPriority[];
  recentRequests: RecentRequest[];
}

export interface CreateBuildingConfigRequest {
  buildingName: string;
  buildingCode: string;
  displayName: string;
  allowCustomId: boolean;
}

export interface UpdateBuildingConfigRequest {
  buildingCode?: string;
  displayName?: string;
  allowCustomId?: boolean;
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

export interface BuildingConfigsResponse {
  buildingConfigs: BuildingConfig[];
  pagination?: Pagination;
}

export type GetBuildingConfigsResponse = ApiResponse<BuildingConfig[]>;
export type GetBuildingConfigResponse = ApiResponse<BuildingConfig>;
export type GetBuildingStatisticsResponse = ApiResponse<BuildingStatistics>;
export type GetNextIdentifierResponse = ApiResponse<{ nextIdentifier: string }>;

export interface FormErrors {
  [key: string]: string;
}

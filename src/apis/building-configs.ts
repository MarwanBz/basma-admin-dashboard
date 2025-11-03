import {
  CreateBuildingConfigRequest,
  GetBuildingConfigResponse,
  GetBuildingConfigsResponse,
  GetBuildingStatisticsResponse,
  GetNextIdentifierResponse,
  UpdateBuildingConfigRequest,
} from "@/types/building-config";

import { apiClient } from "./client";

/**
 * Get all building configs
 */
export async function getBuildingConfigs(): Promise<GetBuildingConfigsResponse> {
  const response =
    await apiClient.get<GetBuildingConfigsResponse>(`buildings`);
  return response.data;
}

/**
 * Get single building config by name
 */
export async function getBuildingConfigByName(
  buildingName: string
): Promise<GetBuildingConfigResponse> {
  const response = await apiClient.get<GetBuildingConfigResponse>(
    `buildings/${buildingName}`
  );
  return response.data;
}

/**
 * Create new building config
 */
export async function createBuildingConfig(
  data: CreateBuildingConfigRequest
): Promise<GetBuildingConfigResponse> {
  const response = await apiClient.post<GetBuildingConfigResponse>(
    "buildings",
    data
  );
  return response.data;
}

/**
 * Update existing building config
 */
export async function updateBuildingConfig(
  buildingName: string,
  data: UpdateBuildingConfigRequest
): Promise<GetBuildingConfigResponse> {
  const response = await apiClient.put<GetBuildingConfigResponse>(
    `buildings/${buildingName}`,
    data
  );
  return response.data;
}

/**
 * Delete building config
 */
export async function deleteBuildingConfig(
  buildingName: string
): Promise<{ success: boolean; message: string }> {
  const response = await apiClient.delete<{
    success: boolean;
    message: string;
  }>(`buildings/${buildingName}`);
  return response.data;
}

/**
 * Get building statistics
 */
export async function getBuildingStatistics(): Promise<GetBuildingStatisticsResponse> {
  const response = await apiClient.get<GetBuildingStatisticsResponse>(
    `buildings/statistics`
  );
  return response.data;
}

/**
 * Get next available identifier for a building
 */
export async function getNextIdentifier(
  buildingName: string
): Promise<GetNextIdentifierResponse> {
  const response = await apiClient.get<GetNextIdentifierResponse>(
    `buildings/${buildingName}/next-identifier`
  );
  return response.data;
}

/**
 * Reset sequence for a building
 */
export async function resetSequence(
  buildingName: string
): Promise<{ success: boolean; message: string }> {
  const response = await apiClient.post<{ success: boolean; message: string }>(
    `buildings/${buildingName}/reset-sequence`,
    {}
  );
  return response.data;
}

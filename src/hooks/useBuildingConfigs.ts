"use client";

import {
  CreateBuildingConfigRequest,
  UpdateBuildingConfigRequest,
} from "@/types/building-config";
import {
  createBuildingConfig,
  deleteBuildingConfig,
  getBuildingConfigByName,
  getBuildingConfigs,
  getBuildingStatistics,
  getNextIdentifier,
  resetSequence,
  updateBuildingConfig,
} from "@/apis/building-configs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * Query hook for fetching all building configs
 */
export function useBuildingConfigs() {
  return useQuery({
    queryKey: ["buildingConfigs"],
    queryFn: () => getBuildingConfigs(),
  });
}

/**
 * Query hook for fetching single building config
 */
export function useBuildingConfig(buildingName: string) {
  return useQuery({
    queryKey: ["buildingConfig", buildingName],
    queryFn: () => getBuildingConfigByName(buildingName),
    enabled: !!buildingName,
  });
}

/**
 * Query hook for fetching building statistics
 */
export function useBuildingStatistics() {
  return useQuery({
    queryKey: ["buildingStatistics"],
    queryFn: () => getBuildingStatistics(),
  });
}

/**
 * Query hook for fetching next identifier
 */
export function useNextIdentifier(buildingName: string) {
  return useQuery({
    queryKey: ["nextIdentifier", buildingName],
    queryFn: () => getNextIdentifier(buildingName),
    enabled: !!buildingName,
  });
}

/**
 * Mutation hook for creating building config
 */
export function useCreateBuildingConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBuildingConfigRequest) =>
      createBuildingConfig(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buildingConfigs"] });
      queryClient.invalidateQueries({ queryKey: ["buildingStatistics"] });
    },
  });
}

/**
 * Mutation hook for updating building config
 */
export function useUpdateBuildingConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      buildingName,
      data,
    }: {
      buildingName: string;
      data: UpdateBuildingConfigRequest;
    }) => updateBuildingConfig(buildingName, data),
    onSuccess: (_, { buildingName }) => {
      queryClient.invalidateQueries({ queryKey: ["buildingConfigs"] });
      queryClient.invalidateQueries({
        queryKey: ["buildingConfig", buildingName],
      });
      queryClient.invalidateQueries({ queryKey: ["buildingStatistics"] });
    },
  });
}

/**
 * Mutation hook for deleting building config
 */
export function useDeleteBuildingConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (buildingName: string) => deleteBuildingConfig(buildingName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buildingConfigs"] });
      queryClient.invalidateQueries({ queryKey: ["buildingStatistics"] });
    },
  });
}

/**
 * Mutation hook for resetting sequence
 */
export function useResetSequence() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (buildingName: string) => resetSequence(buildingName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buildingConfigs"] });
      queryClient.invalidateQueries({ queryKey: ["buildingStatistics"] });
    },
  });
}

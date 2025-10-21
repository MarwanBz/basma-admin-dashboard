"use client";

import {
  AssignTechnicianRequest,
  CreateRequestRequest,
  MaintenanceRequest,
  UpdateRequestRequest,
} from "@/types/request";
import {
  assignTechnician,
  createRequest,
  deleteRequest,
  getRequestById,
  getRequests,
  updateRequest,
} from "@/apis/requests";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// API functions - now using real API calls
const getRequestsAsync = async () => {
  const response = await getRequests();
  return response.data.requests;
};

const getRequestByIdAsync = async (id: string) => {
  const response = await getRequestById(id);
  return response.data;
};

const createRequestAsync = async (data: CreateRequestRequest) => {
  const response = await createRequest(data);
  return response.data;
};

const updateRequestAsync = async (id: string, data: UpdateRequestRequest) => {
  const response = await updateRequest(id, data);
  return response.data;
};

const deleteRequestAsync = async (id: string) => {
  await deleteRequest(id);
  return null;
};

const assignTechnicianAsync = async (
  requestId: string,
  data: AssignTechnicianRequest
) => {
  const response = await assignTechnician(requestId, data);
  return response.data;
};

const updateRequestStatusAsync = async (requestId: string, status: string) => {
  const response = await updateRequest(requestId, { status: status as any });
  return response.data;
};

/**
 * Query hook for fetching all requests
 */
export function useRequests() {
  return useQuery({
    queryKey: ["requests"],
    queryFn: () => getRequestsAsync(),
  });
}

/**
 * Query hook for single request
 */
export function useRequest(id: string) {
  return useQuery({
    queryKey: ["request", id],
    queryFn: () => getRequestByIdAsync(id),
    enabled: !!id,
  });
}

/**
 * Mutation hook for creating requests
 */
export function useCreateRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRequestRequest) => createRequestAsync(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });
}

/**
 * Mutation hook for updating requests
 */
export function useUpdateRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRequestRequest }) =>
      updateRequestAsync(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({ queryKey: ["request", id] });
    },
  });
}

/**
 * Mutation hook for deleting requests
 */
export function useDeleteRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRequestAsync(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });
}

/**
 * Mutation hook for assigning technician
 */
export function useAssignTechnician() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requestId,
      assignedToId,
      reason,
    }: {
      requestId: string;
      assignedToId: string;
      reason?: string;
    }) => assignTechnicianAsync(requestId, { assignedToId, reason }),
    onSuccess: (_, { requestId }) => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({ queryKey: ["request", requestId] });
    },
  });
}

/**
 * Mutation hook for updating request status
 */
export function useUpdateRequestStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requestId,
      status,
    }: {
      requestId: string;
      status: string;
    }) => updateRequestStatusAsync(requestId, status),
    onSuccess: (_, { requestId }) => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({ queryKey: ["request", requestId] });
    },
  });
}

"use client";

import {
  CreateRequestRequest,
  MaintenanceRequest,
  UpdateRequestRequest,
} from "@/types/request";
import {
  mockRequests,
  mockTechnicians,
} from "@/app/dashboard/requests/_components/mock-data";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Mock API functions
const getRequestsAsync = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
  return mockRequests;
};

const getRequestByIdAsync = async (id: string) => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const request = mockRequests.find((r) => r.id === id);
  if (!request) throw new Error("Request not found");
  return request;
};

const createRequestAsync = async (data: CreateRequestRequest) => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const newRequest: MaintenanceRequest = {
    id: `REQ-${String(mockRequests.length + 1).padStart(3, "0")}`,
    ...data,
    status: "pending",
    assignedTo: null,
    date: new Date().toISOString().split("T")[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockRequests.push(newRequest);
  return newRequest;
};

const updateRequestAsync = async (id: string, data: UpdateRequestRequest) => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const index = mockRequests.findIndex((r) => r.id === id);
  if (index === -1) throw new Error("Request not found");

  const updated = {
    ...mockRequests[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  mockRequests[index] = updated;
  return updated;
};

const deleteRequestAsync = async (id: string) => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const index = mockRequests.findIndex((r) => r.id === id);
  if (index === -1) throw new Error("Request not found");

  const deleted = mockRequests[index];
  mockRequests.splice(index, 1);
  return deleted;
};

const assignTechnicianAsync = async (
  requestId: string,
  technicianId: string
) => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const request = mockRequests.find((r) => r.id === requestId);
  const technician = mockTechnicians.find((t) => t.id === technicianId);

  if (!request) throw new Error("Request not found");
  if (!technician) throw new Error("Technician not found");

  request.assignedTo = technicianId;
  request.assignedToName = technician.name;
  request.status = "assigned";
  request.updatedAt = new Date().toISOString();

  return request;
};

const updateRequestStatusAsync = async (requestId: string, status: string) => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const request = mockRequests.find((r) => r.id === requestId);

  if (!request) throw new Error("Request not found");

  request.status = status as any;
  request.updatedAt = new Date().toISOString();

  return request;
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
      technicianId,
    }: {
      requestId: string;
      technicianId: string;
    }) => assignTechnicianAsync(requestId, technicianId),
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

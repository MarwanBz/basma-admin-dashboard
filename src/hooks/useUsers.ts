"use client";

import { CreateUserRequest, UpdateUserRequest } from "@/types/user";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "@/apis/users";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * Query hook for fetching users list with pagination
 */
export function useUsers(params?: {
  page?: number;
  limit?: number;
  role?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => getUsers(params),
  });
}

/**
 * Query hook for single user
 */
export function useUser(id: string) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserById(id),
    enabled: !!id,
  });
}

/**
 * Mutation hook for creating users
 */
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserRequest) => createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

/**
 * Mutation hook for updating users
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
      updateUser(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", id] });
    },
  });
}

/**
 * Mutation hook for deleting users
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

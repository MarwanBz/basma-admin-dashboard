"use client";

import { LoginResponse, login } from "@apis/auth";

import { useMutation } from "@tanstack/react-query";

/**
 * Login credentials for authentication
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Custom hook for authentication using TanStack Query
 * Provides mutation state management for login operations
 *
 * @returns Mutation object with mutate, isPending, isError, error, and data
 *
 * @example
 * const { mutate, isPending, isError } = useAuth()
 * mutate({ email: 'user@example.com', password: 'password' })
 */
export function useAuth() {
  return useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: async ({ email, password }) => login(email, password),
  });
}

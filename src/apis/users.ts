import {
  ApiResponse,
  CreateUserRequest,
  UpdateUserRequest,
  User
} from "@/types/user";

import { apiClient } from "./client";

/**
 * Get all users with optional filtering
 */
export async function getUsers(filters?: {
  role?: string;
  search?: string;
}): Promise<ApiResponse<User[]>> {
  const params = new URLSearchParams();
  if (filters?.role) params.append('role', filters.role);
  if (filters?.search) params.append('search', filters.search);
  
  const queryString = params.toString();
  const url = queryString ? `super-admin/users?${queryString}` : 'super-admin/users';
  
  const response = await apiClient.get<ApiResponse<User[]>>(url);
  return response.data;
}

/**
 * Get single user by ID
 */
export async function getUserById(id: string): Promise<ApiResponse<User>> {
  const response = await apiClient.get<ApiResponse<User>>(`super-admin/users/${id}`);
  return response.data;
}

/**
 * Create new user
 */
export async function createUser(data: CreateUserRequest): Promise<ApiResponse<User>> {
  const response = await apiClient.post<ApiResponse<User>>('super-admin/users', data);
  return response.data;
}

/**
 * Update existing user
 */
export async function updateUser(id: string, data: UpdateUserRequest): Promise<ApiResponse<User>> {
  const response = await apiClient.put<ApiResponse<User>>(`super-admin/users/${id}`, data);
  return response.data;
}

/**
 * Delete user
 */
export async function deleteUser(id: string): Promise<ApiResponse<null>> {
  const response = await apiClient.delete<ApiResponse<null>>(`super-admin/users/${id}`);
  return response.data;
}

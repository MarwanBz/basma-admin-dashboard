import {
  ApiResponse,
  CreateUserRequest,
  GetUsersResponse,
  UpdateUserRequest,
  User,
} from "@/types/user";

import { apiClient } from "./client";

/**
 * Get all users with optional filtering and pagination
 */
export async function getUsers(params?: {
  page?: number;
  limit?: number;
  role?: string;
  search?: string;
}): Promise<GetUsersResponse> {
  const searchParams = new URLSearchParams();

  if (params?.page) searchParams.append("page", params.page.toString());
  if (params?.limit) searchParams.append("limit", params.limit.toString());
  if (params?.role) searchParams.append("role", params.role);
  if (params?.search) searchParams.append("search", params.search);

  const queryString = searchParams.toString();
  const url = queryString
    ? `administrators/users?${queryString}`
    : "administrators/users";

  const response = await apiClient.get<GetUsersResponse>(url);
  return response.data;
}

/**
 * Get single user by ID
 */
export async function getUserById(id: string): Promise<ApiResponse<User>> {
  const response = await apiClient.get<ApiResponse<User>>(
    `administrators/users/${id}`
  );
  return response.data;
}

/**
 * Create new user
 */
export async function createUser(
  data: CreateUserRequest
): Promise<ApiResponse<User>> {
  const response = await apiClient.post<ApiResponse<User>>(
    "administrators/users",
    data
  );
  return response.data;
}

/**
 * Update existing user
 */
export async function updateUser(
  id: string,
  data: UpdateUserRequest
): Promise<ApiResponse<User>> {
  const response = await apiClient.put<ApiResponse<User>>(
    `administrators/users/${id}`,
    data
  );
  return response.data;
}

/**
 * Delete user
 */
export async function deleteUser(id: string): Promise<ApiResponse<null>> {
  const response = await apiClient.delete<ApiResponse<null>>(
    `administrators/users/${id}`
  );
  return response.data;
}

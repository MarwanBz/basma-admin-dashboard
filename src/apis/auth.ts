import { apiClient } from "./client";

// User role type
export type UserRole = "SUPER_ADMIN" | "MAINTENANCE_ADMIN" | "BASMA_ADMIN";

// User type definition
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

// Login request payload
export interface LoginRequest {
  email: string;
  password: string;
}

// Login response type
export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
  requestId: string;
}

/**
 * Login user with email and password
 * @param email - User email
 * @param password - User password
 * @returns Promise with login response containing user and tokens
 */
export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>("auth/login", {
    email,
    password,
  });

  return response.data;
}

// Simple user management types

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  emailVerified: string | null;
  createdAt: string;
  updatedAt: string;
}

export type UserRole =
  | "CUSTOMER"
  | "TECHNICIAN"
  | "BASMA_ADMIN"
  | "MAINTENANCE_ADMIN"
  | "SUPER_ADMIN"
  | "USER";

export interface UserFormData {
  name: string;
  email: string;
  role: UserRole;
  password: string;
  confirmPassword: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  requestId: string;
}

// Pagination types
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// Users list response types
export interface UsersResponse {
  users: User[];
  pagination: Pagination;
}

export interface GetUsersResponse extends ApiResponse<UsersResponse> {}

export interface FormErrors {
  [key: string]: string;
}

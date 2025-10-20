// Simple user management types

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = "CUSTOMER" | "TECHNICIAN" | "BASMA_ADMIN";

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

export interface FormErrors {
  [key: string]: string;
}

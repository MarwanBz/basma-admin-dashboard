import { UserRole } from "@/types/user";

// functions for role permissions
export const canEdit = (userRole: UserRole): boolean => {
  return userRole === "MAINTENANCE_ADMIN" || userRole === "SUPER_ADMIN";
};

export const canDelete = (userRole: UserRole): boolean => {
  return userRole === "MAINTENANCE_ADMIN" || userRole === "SUPER_ADMIN";
};

export const canAssign = (userRole: UserRole): boolean => {
  return userRole === "MAINTENANCE_ADMIN" || userRole === "SUPER_ADMIN";
};

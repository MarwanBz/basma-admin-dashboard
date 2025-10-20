// Utility functions for user management

export function getRoleText(role: string): string {
  switch (role) {
    case "CUSTOMER":
      return "عميل";
    case "TECHNICIAN":
      return "فني";
    case "BASMA_ADMIN":
      return "مدير بسمة";
    case "MAINTENANCE_ADMIN":
      return "مدير الصيانة";
    case "SUPER_ADMIN":
      return "مدير عام";
    case "USER":
      return "مستخدم";
    default:
      return "غير معروف";
  }
}

export function getRoleColor(role: string): string {
  switch (role) {
    case "CUSTOMER":
      return "bg-blue-100 text-blue-800";
    case "TECHNICIAN":
      return "bg-green-100 text-green-800";
    case "BASMA_ADMIN":
      return "bg-purple-100 text-purple-800";
    case "MAINTENANCE_ADMIN":
      return "bg-orange-100 text-orange-800";
    case "SUPER_ADMIN":
      return "bg-red-100 text-red-800";
    case "USER":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

"use client";

import {
  CheckCircle,
  Mail,
  Shield,
  User as UserIcon,
  XCircle,
} from "lucide-react";
import { getRoleColor, getRoleText } from "./user-utils";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { DataTableActions } from "@/components/ui/data-table-actions";
import { User } from "@/types/user";

interface UsersTableProps {
  users: User[];
  onEditUser: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
  // Pagination props
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  isLoading?: boolean;
}

export function UsersTable({
  users,
  onEditUser,
  onDeleteUser,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  onPageChange,
  isLoading = false,
}: UsersTableProps) {
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "id",
      header: "رقم المستخدم",
      cell: ({ row }) => <div>{row.getValue("id")}</div>,
    },
    {
      accessorKey: "name",
      header: "الاسم",
      cell: ({ row }) => (
        <div className="flex items-center">
          {/* <div className="w-4 h-4 bg-primary text-white rounded-full flex items-center justify-center ml-2">
            <UserIcon size={12} />
          </div> */}
          {row.getValue("name")}
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "البريد الإلكتروني",
      cell: ({ row }) => (
        <div className="flex items-center">
          {/* <Mail size={16} className="text-gray-400 ml-2" /> */}
          {row.getValue("email")}
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "الدور",
      cell: ({ row }) => {
        const role = row.getValue("role") as string;
        return (
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(
              role
            )}`}
          >
            <Shield size={12} />
            {getRoleText(role)}
          </span>
        );
      },
    },
    {
      accessorKey: "emailVerified",
      header: "حالة التحقق",
      cell: ({ row }) => {
        const emailVerified = row.getValue("emailVerified") as string | null;
        return (
          <div className="flex items-center gap-1">
            {emailVerified ? (
              <>
                <CheckCircle size={16} className="text-green-500" />
                <span className="text-green-700 text-xs">متحقق</span>
              </>
            ) : (
              <>
                <XCircle size={16} className="text-red-500" />
                <span className="text-red-700 text-xs">غير متحقق</span>
              </>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "تاريخ الإنشاء",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return <div>{date.toLocaleDateString("ar-SA")}</div>;
      },
    },
    {
      id: "actions",
      header: "الإجراءات",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <DataTableActions
            onEdit={() => onEditUser(user.id)}
            onDelete={() => onDeleteUser(user.id)}
            canEdit={true}
            canDelete={true}
            canAssign={false}
          />
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={users}
      emptyMessage="لا يوجد مستخدمين مطابقين للبحث"
      currentPage={currentPage}
      totalPages={totalPages}
      totalItems={totalItems}
      onPageChange={onPageChange}
      isLoading={isLoading}
    />
  );
}

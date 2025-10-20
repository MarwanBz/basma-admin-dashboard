"use client";

import {
  CheckCircle,
  Edit,
  Mail,
  Shield,
  Trash,
  User as UserIcon,
  XCircle,
} from "lucide-react";
import { getRoleColor, getRoleText } from "./user-utils";

import { User } from "@/types/user";

interface UsersTableProps {
  users: User[];
  onEditUser: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
}

export function UsersTable({
  users,
  onEditUser,
  onDeleteUser,
}: UsersTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-right font-medium text-gray-500">
                رقم المستخدم
              </th>
              <th className="px-4 py-3 text-right font-medium text-gray-500">
                الاسم
              </th>
              <th className="px-4 py-3 text-right font-medium text-gray-500">
                البريد الإلكتروني
              </th>
              <th className="px-4 py-3 text-right font-medium text-gray-500">
                الدور
              </th>
              <th className="px-4 py-3 text-right font-medium text-gray-500">
                حالة التحقق
              </th>
              <th className="px-4 py-3 text-right font-medium text-gray-500">
                تاريخ الإنشاء
              </th>
              <th className="px-4 py-3 text-right font-medium text-gray-500">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{user.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center ml-2">
                        <UserIcon size={16} />
                      </div>
                      {user.name}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <Mail size={16} className="text-gray-400 ml-2" />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(
                        user.role
                      )}`}
                    >
                      <Shield size={12} />
                      {getRoleText(user.role)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {user.emailVerified ? (
                        <>
                          <CheckCircle size={16} className="text-green-500" />
                          <span className="text-green-700 text-xs">متحقق</span>
                        </>
                      ) : (
                        <>
                          <XCircle size={16} className="text-red-500" />
                          <span className="text-red-700 text-xs">
                            غير متحقق
                          </span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {new Date(user.createdAt).toLocaleDateString("ar-SA")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEditUser(user.id)}
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <Edit size={14} />
                        تعديل
                      </button>
                      <button
                        onClick={() => onDeleteUser(user.id)}
                        className="text-red-600 hover:underline flex items-center gap-1"
                      >
                        <Trash size={14} />
                        حذف
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  لا يوجد مستخدمين مطابقين للبحث
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

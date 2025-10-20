"use client";

import {
  AddUserModal,
  DeleteUserModal,
  EditUserModal,
  Loading,
  UserFilters,
  UsersTable,
} from "./_components";
import {
  FormErrors,
  UpdateUserRequest,
  User,
  UserFormData,
} from "@/types/user";
import {
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
  useUsers,
} from "@/hooks/useUsers";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Unauthorized } from "@/components/Unauthorized";
import { useRoleGuard } from "@/hooks/useRoleGuard";

export default function UsersManagement() {
  const { hasAccess, isLoading: roleLoading } = useRoleGuard([
    "SUPER_ADMIN",
    "MAINTENANCE_ADMIN",
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState<UserFormData>({
    name: "",
    email: "",
    role: "CUSTOMER",
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const { data: usersResponse, isLoading, error } = useUsers();
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  const usersData = usersResponse?.data.users || [];

  if (roleLoading) {
    return <Loading />;
  }

  if (!hasAccess) {
    return <Unauthorized />;
  }

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">حدث خطأ في تحميل البيانات</p>
          <Button onClick={() => window.location.reload()}>
            إعادة المحاولة
          </Button>
        </div>
      </div>
    );
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const errors: FormErrors = {};

    if (!userForm.name.trim()) {
      errors.name = "الاسم مطلوب";
    }

    if (!userForm.email.trim()) {
      errors.email = "البريد الإلكتروني مطلوب";
    } else if (!/\S+@\S+\.\S+/.test(userForm.email)) {
      errors.email = "البريد الإلكتروني غير صالح";
    }

    if (!userForm.password) {
      errors.password = "كلمة المرور مطلوبة";
    } else if (userForm.password.length < 6) {
      errors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
    }

    if (userForm.password !== userForm.confirmPassword) {
      errors.confirmPassword = "كلمة المرور غير متطابقة";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Clear errors
    setFormErrors({});

    try {
      await createUserMutation.mutateAsync({
        name: userForm.name,
        email: userForm.email,
        password: userForm.password,
        role: userForm.role,
      });

      // Reset form and close modal
      setUserForm({
        name: "",
        email: "",
        role: "CUSTOMER",
        password: "",
        confirmPassword: "",
      });
      setShowAddModal(false);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUser) return;

    // Validate form
    const errors: FormErrors = {};

    if (!userForm.name.trim()) {
      errors.name = "الاسم مطلوب";
    }

    if (!userForm.email.trim()) {
      errors.email = "البريد الإلكتروني مطلوب";
    } else if (!/\S+@\S+\.\S+/.test(userForm.email)) {
      errors.email = "البريد الإلكتروني غير صالح";
    }

    // Password is optional when editing
    if (userForm.password && userForm.password.length < 6) {
      errors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
    }

    if (userForm.password && userForm.password !== userForm.confirmPassword) {
      errors.confirmPassword = "كلمة المرور غير متطابقة";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Clear errors
    setFormErrors({});

    try {
      const updateData: UpdateUserRequest = {
        name: userForm.name,
        email: userForm.email,
        role: userForm.role,
      };

      if (userForm.password) {
        updateData.password = userForm.password;
      }

      await updateUserMutation.mutateAsync({
        id: selectedUser.id,
        data: updateData,
      });

      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const confirmDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      await deleteUserMutation.mutateAsync(selectedUser.id);
      setShowDeleteModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserForm((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleOpenAddModal = () => {
    setUserForm({
      name: "",
      email: "",
      role: "CUSTOMER",
      password: "",
      confirmPassword: "",
    });
    setFormErrors({});
    setShowAddModal(true);
  };

  const handleOpenEditModal = (userId: string) => {
    const user = usersData.find((u: User) => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setUserForm({
        name: user.name,
        email: user.email,
        role: user.role,
        password: "",
        confirmPassword: "",
      });
      setFormErrors({});
      setShowEditModal(true);
    }
  };

  const handleOpenDeleteModal = (userId: string) => {
    const user = usersData.find((u: User) => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setShowDeleteModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">
              إدارة المستخدمين
            </h1>
            <Button
              onClick={handleOpenAddModal}
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              إضافة مستخدم
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="space-y-6">
          {/* Filters and Search */}
          <UserFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />

          {/* Users Table */}
          <UsersTable
            users={usersData}
            onEditUser={handleOpenEditModal}
            onDeleteUser={handleOpenDeleteModal}
          />

          {/* Add User Modal */}
          <AddUserModal
            showModal={showAddModal}
            setShowModal={setShowAddModal}
            userForm={userForm}
            formErrors={formErrors}
            handleInputChange={handleInputChange}
            handleAddUser={handleAddUser}
          />

          {/* Edit User Modal */}
          {selectedUser && (
            <EditUserModal
              showModal={showEditModal}
              setShowModal={setShowEditModal}
              userForm={userForm}
              formErrors={formErrors}
              handleInputChange={handleInputChange}
              handleUpdateUser={handleUpdateUser}
            />
          )}

          {/* Delete User Modal */}
          {selectedUser && (
            <DeleteUserModal
              showModal={showDeleteModal}
              setShowModal={setShowDeleteModal}
              selectedUser={selectedUser}
              confirmDeleteUser={confirmDeleteUser}
            />
          )}
        </div>
      </main>
    </div>
  );
}

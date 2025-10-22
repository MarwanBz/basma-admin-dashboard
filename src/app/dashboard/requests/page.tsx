"use client";

import {
  AddRequestModal,
  AssignTechnicianModal,
  DeleteRequestModal,
  EditRequestModal,
  RequestDetailsModal,
  RequestFilters,
  RequestsTable,
} from "./_components";
import {
  useAssignTechnician,
  useCreateRequest,
  useDeleteRequest,
  useRequests,
  useUpdateRequest,
} from "@/hooks/useRequests";

import { Button } from "@/components/ui/button";
import { Loading } from "./_components/loading";
import { MaintenanceRequest } from "@/types/request";
import { Plus } from "lucide-react";
import { REQUEST_PRIORITY } from "@/constants/app-constants";
import { UserRole } from "@/types/user";
import { toast } from "sonner";
import { useRoleGuard } from "@/hooks/useRoleGuard";
import { useState } from "react";
import { useTechnicians } from "@/hooks/useTechnicians";

export default function MaintenanceRequests() {
  // Get user role
  const { user } = useRoleGuard([]);

  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedRequest, setSelectedRequest] =
    useState<MaintenanceRequest | null>(null);

  // Advanced filter states
  const [priority, setPriority] = useState("all");
  const [building, setBuilding] = useState("all");
  const [assignedToId, setAssignedToId] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // API hooks
  const { data: requestsResponse, isLoading } = useRequests({
    page: currentPage,
    limit: 10,
    status:
      activeFilter !== "all"
        ? (activeFilter as
            | "DRAFT"
            | "SUBMITTED"
            | "ASSIGNED"
            | "IN_PROGRESS"
            | "COMPLETED"
            | "CLOSED"
            | "REJECTED")
        : undefined,
    search: searchQuery || undefined,
    priority:
      priority !== "all"
        ? (priority as "LOW" | "MEDIUM" | "HIGH" | "URGENT")
        : undefined,
    building: building !== "all" ? building : undefined,
    assignedToId: assignedToId !== "all" ? assignedToId : undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    sortBy: sortBy as
      | "status"
      | "title"
      | "priority"
      | "createdAt"
      | "updatedAt",
    sortOrder: sortOrder as "asc" | "desc",
  });
  const { data: techniciansData, isLoading: isLoadingTechnicians } =
    useTechnicians();
  const createRequestMutation = useCreateRequest();
  const updateRequestMutation = useUpdateRequest();
  const deleteRequestMutation = useDeleteRequest();
  const assignTechnicianMutation = useAssignTechnician();

  // Extract data from response
  const requestsData = requestsResponse?.data?.requests || [];
  const pagination = requestsResponse?.data?.pagination;

  // Event handlers
  const handleCreateRequest = async (newRequest: {
    title: string;
    description: string;
    location: string;
    building: string;
    specificLocation: string;
    priority: string;
    categoryId: number;
  }) => {
    try {
      await createRequestMutation.mutateAsync({
        title: newRequest.title,
        description: newRequest.description,
        location: newRequest.location,
        building: newRequest.building,
        specificLocation: newRequest.specificLocation,
        priority: newRequest.priority as keyof typeof REQUEST_PRIORITY,
        categoryId: newRequest.categoryId,
      });
      toast.success("تم إنشاء الطلب بنجاح", {
        description: `تم إنشاء طلب الصيانة: ${newRequest.title}`,
      });
      setShowAddModal(false);
    } catch (error) {
      console.error("Failed to create request:", error);
      toast.error("حدث خطأ في إنشاء الطلب", {
        description: "يرجى المحاولة مرة أخرى",
      });
    }
  };

  const handleUpdateRequest = async (
    requestId: string,
    data: {
      title: string;
      description: string;
      location: string;
      building: string;
      specificLocation: string;
      priority: string;
      categoryId: number;
    }
  ) => {
    try {
      await updateRequestMutation.mutateAsync({
        id: requestId,
        data: {
          title: data.title,
          description: data.description,
          location: data.location,
          building: data.building,
          specificLocation: data.specificLocation,
          priority: data.priority as keyof typeof REQUEST_PRIORITY,
          categoryId: data.categoryId,
        },
      });
      toast.success("تم تحديث الطلب بنجاح", {
        description: `تم تحديث طلب الصيانة: ${data.title}`,
      });
      setShowEditModal(false);
      setSelectedRequest(null);
    } catch (error) {
      console.error("Failed to update request:", error);
      toast.error("حدث خطأ في تحديث الطلب", {
        description: "يرجى المحاولة مرة أخرى",
      });
    }
  };

  const handleDeleteRequest = (requestId: string) => {
    const request = requestsData?.find((r) => r.id === requestId);
    if (request) {
      setSelectedRequest(request);
      setShowDeleteModal(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedRequest) {
      try {
        await deleteRequestMutation.mutateAsync(selectedRequest.id);
        toast.success("تم حذف الطلب بنجاح", {
          description: `تم حذف طلب الصيانة: ${selectedRequest.title}`,
          id: `delete-${selectedRequest.id}`,
        });
        setShowDeleteModal(false);
        setSelectedRequest(null);
      } catch (error) {
        console.error("Failed to delete request:", error);
        toast.error("حدث خطأ في حذف الطلب", {
          description: "يرجى المحاولة مرة أخرى",
          id: `delete-${selectedRequest.id}`,
        });
      }
    }
  };

  const handleEditRequest = (requestId: string) => {
    const request = requestsData?.find((r) => r.id === requestId);
    if (request) {
      setSelectedRequest(request);
      setShowEditModal(true);
    }
  };

  const handleViewRequest = (requestId: string) => {
    const request = requestsData?.find((r) => r.id === requestId);
    if (request) {
      setSelectedRequest(request);
      setShowDetailsModal(true);
    }
  };

  const handleAssignRequest = (requestId: string) => {
    const request = requestsData?.find((r) => r.id === requestId);
    if (request) {
      setSelectedRequest(request);
      setShowAssignModal(true);
    }
  };

  const handleAssignTechnician = async (technicianId: string) => {
    if (selectedRequest) {
      try {
        await assignTechnicianMutation.mutateAsync({
          requestId: selectedRequest.id,
          assignedToId: technicianId,
        });
        const technician = techniciansData?.data?.technicians?.find(
          (t) => t.id === technicianId
        );
        toast.success("تم تعيين الفني بنجاح", {
          description: `تم تعيين ${technician?.name} للطلب: ${selectedRequest.title}`,
        });
        setShowAssignModal(false);
        setSelectedRequest(null);
      } catch (error) {
        console.error("Failed to assign technician:", error);
        toast.error("حدث خطأ في تعيين الفني", {
          description: "يرجى المحاولة مرة أخرى",
        });
      }
    }
  };

  const handleStatusChange = (requestId: string, status: string) => {
    // TODO: Implement status change functionality
    console.log("Change status:", requestId, status);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery("");
    setActiveFilter("all");
    setPriority("all");
    setBuilding("all");
    setAssignedToId("all");
    setDateFrom("");
    setDateTo("");
    setSortBy("createdAt");
    setSortOrder("desc");
    setCurrentPage(1);
  };

  if (isLoading || isLoadingTechnicians) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">
              إدارة طلبات الصيانة
            </h1>
            <Button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              إضافة طلب صيانة
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="space-y-6">
          {/* Filters and Search */}
          <RequestFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            priority={priority}
            setPriority={setPriority}
            building={building}
            setBuilding={setBuilding}
            assignedToId={assignedToId}
            setAssignedToId={setAssignedToId}
            dateFrom={dateFrom}
            setDateFrom={setDateFrom}
            dateTo={dateTo}
            setDateTo={setDateTo}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            onClearFilters={handleClearFilters}
          />

          {/* Requests Table */}
          <RequestsTable
            requests={requestsData}
            userRole={(user?.roles?.[0] as UserRole) || "BASMA_ADMIN"}
            onAssign={handleAssignRequest}
            onView={handleViewRequest}
            onEdit={handleEditRequest}
            onDelete={handleDeleteRequest}
            onStatusChange={handleStatusChange}
            currentPage={pagination?.page || 1}
            totalPages={pagination?.totalPages || 1}
            totalItems={pagination?.total || 0}
            onPageChange={setCurrentPage}
            isLoading={isLoading}
          />

          {/* Add Request Modal */}
          <AddRequestModal
            showModal={showAddModal}
            setShowModal={setShowAddModal}
            onSubmit={handleCreateRequest}
            isLoading={createRequestMutation.isPending}
          />

          {/* Edit Request Modal */}
          {selectedRequest && (
            <EditRequestModal
              open={showEditModal}
              onOpenChange={setShowEditModal}
              request={selectedRequest}
              onSubmit={(data) => handleUpdateRequest(selectedRequest.id, data)}
              isLoading={updateRequestMutation.isPending}
            />
          )}

          {/* Request Details Modal */}
          {selectedRequest && (
            <RequestDetailsModal
              open={showDetailsModal}
              onOpenChange={setShowDetailsModal}
              request={selectedRequest}
              userRole={(user?.roles?.[0] as UserRole) || "BASMA_ADMIN"}
              onEdit={() => {
                setShowDetailsModal(false);
                setShowEditModal(true);
              }}
              onDelete={() => {
                setShowDetailsModal(false);
                setShowDeleteModal(true);
              }}
              onAssign={() => {
                setShowDetailsModal(false);
                handleAssignRequest(selectedRequest.id);
              }}
              onStatusChange={handleStatusChange}
            />
          )}

          {/* Delete Request Modal */}
          {selectedRequest && (
            <DeleteRequestModal
              open={showDeleteModal}
              onOpenChange={setShowDeleteModal}
              request={selectedRequest}
              onConfirm={handleConfirmDelete}
              isLoading={deleteRequestMutation.isPending}
            />
          )}

          {/* Assign Technician Modal */}
          <AssignTechnicianModal
            open={showAssignModal}
            onOpenChange={setShowAssignModal}
            technicians={techniciansData?.data?.technicians || []}
            onSubmit={handleAssignTechnician}
            isLoading={assignTechnicianMutation.isPending}
          />
        </div>
      </main>
    </div>
  );
}

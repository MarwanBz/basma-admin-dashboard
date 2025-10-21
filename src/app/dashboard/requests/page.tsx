"use client";

import {
  AddRequestModal,
  DeleteRequestModal,
  EditRequestModal,
  RequestDetailsModal,
  RequestsTable,
} from "./_components";
import {
  useCreateRequest,
  useDeleteRequest,
  useRequests,
  useUpdateRequest,
} from "@/hooks/useRequests";

import { Button } from "@/components/ui/button";
import { Loading } from "./_components/loading";
import { MaintenanceRequest } from "@/types/request";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function MaintenanceRequests() {
  // State management
  const [searchQuery] = useState("");
  const [activeFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRequest, setSelectedRequest] =
    useState<MaintenanceRequest | null>(null);

  // API hooks
  const { data: requestsData, isLoading } = useRequests();
  const createRequestMutation = useCreateRequest();
  const updateRequestMutation = useUpdateRequest();
  const deleteRequestMutation = useDeleteRequest();

  // Filter requests based on active filter and search query
  const filteredRequests = (requestsData || []).filter((request) => {
    // Filter by status
    if (activeFilter !== "all" && request.status !== activeFilter) {
      return false;
    }

    // Filter by search query
    if (
      searchQuery &&
      !request.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !request.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !request.location.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

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
        priority: newRequest.priority as "LOW" | "MEDIUM" | "HIGH" | "URGENT",
        categoryId: newRequest.categoryId,
      });
      setShowAddModal(false);
    } catch (error) {
      console.error("Failed to create request:", error);
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
          priority: data.priority as "LOW" | "MEDIUM" | "HIGH" | "URGENT",
          categoryId: data.categoryId,
        },
      });
      setShowEditModal(false);
      setSelectedRequest(null);
    } catch (error) {
      console.error("Failed to update request:", error);
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
        setShowDeleteModal(false);
        setSelectedRequest(null);
      } catch (error) {
        console.error("Failed to delete request:", error);
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
    // TODO: Implement assign functionality
    console.log("Assign request:", requestId);
  };

  const handleStatusChange = (requestId: string, status: string) => {
    // TODO: Implement status change functionality
    console.log("Change status:", requestId, status);
  };

  if (isLoading) {
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
          {/* <RequestFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          /> */}

          {/* Requests Table */}
          <RequestsTable
            requests={filteredRequests}
            onAssign={handleAssignRequest}
            onView={handleViewRequest}
            onEdit={handleEditRequest}
            onDelete={handleDeleteRequest}
            onStatusChange={handleStatusChange}
          />

          {/* Add Request Modal */}
          <AddRequestModal
            showModal={showAddModal}
            setShowModal={setShowAddModal}
            onSubmit={handleCreateRequest}
          />

          {/* Edit Request Modal */}
          {selectedRequest && (
            <EditRequestModal
              open={showEditModal}
              onOpenChange={setShowEditModal}
              request={selectedRequest}
              onSubmit={(data) => handleUpdateRequest(selectedRequest.id, data)}
            />
          )}

          {/* Request Details Modal */}
          {selectedRequest && (
            <RequestDetailsModal
              open={showDetailsModal}
              onOpenChange={setShowDetailsModal}
              request={selectedRequest}
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
            />
          )}

          {/* Delete Request Modal */}
          {selectedRequest && (
            <DeleteRequestModal
              open={showDeleteModal}
              onOpenChange={setShowDeleteModal}
              request={selectedRequest}
              onConfirm={handleConfirmDelete}
            />
          )}
        </div>
      </main>
    </div>
  );
}

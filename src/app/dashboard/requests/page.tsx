"use client";

import {
  AddRequestModal,
  DeleteRequestModal,
  EditRequestModal,
  Loading,
  RequestFilters,
  RequestsTable,
} from "./_components";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { MaintenanceRequest } from "@/types/request";
import { Plus } from "lucide-react";
import { useRequests } from "@/hooks/useRequests";

export default function MaintenanceRequests() {
  // State management
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRequest, setSelectedRequest] =
    useState<MaintenanceRequest | null>(null);

  // Load data
  const { data: requestsData, isLoading } = useRequests();

  useEffect(() => {
    if (requestsData) {
      setRequests(requestsData);
    }
  }, [requestsData]);

  // Filter requests based on active filter and search query
  const filteredRequests = requests.filter((request) => {
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
  const handleCreateRequest = (newRequest: {
    title: string;
    description: string;
    location: string;
    priority: string;
    category: string;
  }) => {
    const newRequestId = `REQ-${String(requests.length + 1).padStart(3, "0")}`;
    const newMaintenanceRequest: MaintenanceRequest = {
      id: newRequestId,
      title: newRequest.title,
      description: newRequest.description,
      location: newRequest.location,
      priority: newRequest.priority as "low" | "medium" | "high" | "urgent",
      category: newRequest.category as
        | "HVAC"
        | "Electrical"
        | "Plumbing"
        | "Carpentry"
        | "General"
        | "Other",
      status: "pending",
      assignedTo: null,
      assignedToName: undefined,
      date: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setRequests([...requests, newMaintenanceRequest]);
    setShowAddModal(false);
  };

  const handleUpdateRequest = (
    requestId: string,
    data: {
      title: string;
      description: string;
      location: string;
      priority: string;
      category: string;
    }
  ) => {
    setRequests(
      requests.map((request) =>
        request.id === requestId
          ? {
              ...request,
              title: data.title,
              description: data.description,
              location: data.location,
              priority: data.priority as "low" | "medium" | "high" | "urgent",
              category: data.category as
                | "HVAC"
                | "Electrical"
                | "Plumbing"
                | "Carpentry"
                | "General"
                | "Other",
              updatedAt: new Date().toISOString(),
            }
          : request
      )
    );
    setShowEditModal(false);
    setSelectedRequest(null);
  };

  const handleDeleteRequest = (requestId: string) => {
    const request = requests.find((r) => r.id === requestId);
    if (request) {
      setSelectedRequest(request);
      setShowDeleteModal(true);
    }
  };

  const handleConfirmDelete = () => {
    if (selectedRequest) {
      setRequests(requests.filter((r) => r.id !== selectedRequest.id));
      setShowDeleteModal(false);
      setSelectedRequest(null);
    }
  };

  const handleEditRequest = (requestId: string) => {
    const request = requests.find((r) => r.id === requestId);
    if (request) {
      setSelectedRequest(request);
      setShowEditModal(true);
    }
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
          <RequestFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />

          {/* Requests Table */}
          <RequestsTable
            requests={filteredRequests}
            onEditRequest={handleEditRequest}
            onDeleteRequest={handleDeleteRequest}
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

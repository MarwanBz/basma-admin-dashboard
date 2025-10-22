"use client";

import { MaintenanceRequest, Technician } from "@/types/request";

import { AssignTechnicianModal } from "./assign-technician-modal";
import { CreateRequestModal } from "./create-request-modal";
import { DeleteRequestModal } from "./delete-request-modal";
import { EditRequestModal } from "./edit-request-modal";
import { RequestDetailsModal } from "./request-details-modal";

interface RequestModalsProps {
  technicians: Technician[];
  selectedRequest: MaintenanceRequest | null;
  showCreateModal: boolean;
  showEditModal: boolean;
  showAssignModal: boolean;
  showDetailsModal: boolean;
  showDeleteModal: boolean;
  setShowCreateModal: (open: boolean) => void;
  setShowEditModal: (open: boolean) => void;
  setShowAssignModal: (open: boolean) => void;
  setShowDetailsModal: (open: boolean) => void;
  setShowDeleteModal: (open: boolean) => void;
  onCreateRequest: (data: {
    title: string;
    description: string;
    location: string;
    priority: string;
    category: string;
  }) => void;
  onEditRequest: (requestId: string, data: any) => void;
  onAssignTechnician: (technicianId: string) => void;
  onDeleteRequest: () => void;
  isCreateLoading?: boolean;
}

export function RequestModals({
  technicians,
  selectedRequest,
  showCreateModal,
  showEditModal,
  showAssignModal,
  showDetailsModal,
  showDeleteModal,
  setShowCreateModal,
  setShowEditModal,
  setShowAssignModal,
  setShowDetailsModal,
  setShowDeleteModal,
  onCreateRequest,
  onEditRequest,
  onAssignTechnician,
  onDeleteRequest,
  isCreateLoading = false,
}: RequestModalsProps) {
  return (
    <>
      <CreateRequestModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSubmit={onCreateRequest}
        isLoading={isCreateLoading}
      />

      {selectedRequest && (
        <>
          <EditRequestModal
            open={showEditModal}
            onOpenChange={setShowEditModal}
            request={selectedRequest}
            onSubmit={(data) => onEditRequest(selectedRequest.id, data)}
          />

          <AssignTechnicianModal
            open={showAssignModal}
            onOpenChange={setShowAssignModal}
            technicians={technicians}
            onSubmit={onAssignTechnician}
          />

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
              setShowAssignModal(true);
            }}
          />

          <DeleteRequestModal
            open={showDeleteModal}
            onOpenChange={setShowDeleteModal}
            request={selectedRequest}
            onConfirm={onDeleteRequest}
          />
        </>
      )}
    </>
  );
}

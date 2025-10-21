"use client";

import {
  AddBuildingModal,
  BuildingStatsModal,
  BuildingsTable,
  DeleteBuildingModal,
  EditBuildingModal,
  Loading,
} from "./_components";
import {
  useBuildingConfigs,
  useBuildingStatistics,
  useCreateBuildingConfig,
  useDeleteBuildingConfig,
  useUpdateBuildingConfig,
} from "@/hooks/useBuildingConfigs";

import { BuildingConfig } from "@/types/building-config";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Unauthorized } from "@/components/Unauthorized";
import { useRoleGuard } from "@/hooks/useRoleGuard";
import { useState } from "react";

export default function BuildingsManagement() {
  const { hasAccess, isLoading: roleLoading } = useRoleGuard(["SUPER_ADMIN"]);

  // State management
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [selectedBuilding, setSelectedBuilding] =
    useState<BuildingConfig | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // API hooks
  const { data: buildingsResponse, isLoading } = useBuildingConfigs();
  const { data: statsResponse } = useBuildingStatistics();
  const createMutation = useCreateBuildingConfig();
  const updateMutation = useUpdateBuildingConfig();
  const deleteMutation = useDeleteBuildingConfig();

  const buildings = buildingsResponse?.data || [];
  const statistics = statsResponse?.data;

  // Filter buildings based on search
  const filteredBuildings = buildings.filter(
    (building) =>
      building.buildingName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      building.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (roleLoading) {
    return <Loading />;
  }

  if (!hasAccess) {
    return <Unauthorized />;
  }

  if (isLoading) {
    return <Loading />;
  }

  // Handlers
  const handleAddBuilding = async (data: {
    buildingName: string;
    buildingCode: string;
    displayName: string;
    allowCustomId: boolean;
  }) => {
    try {
      await createMutation.mutateAsync(data);
      setShowAddModal(false);
    } catch (error) {
      console.error("Error creating building:", error);
    }
  };

  const handleEditBuilding = async (data: {
    buildingCode: string;
    displayName: string;
    allowCustomId: boolean;
  }) => {
    if (!selectedBuilding) return;

    try {
      await updateMutation.mutateAsync({
        buildingName: selectedBuilding.buildingName,
        data,
      });
      setShowEditModal(false);
      setSelectedBuilding(null);
    } catch (error) {
      console.error("Error updating building:", error);
    }
  };

  const handleDeleteBuilding = async () => {
    if (!selectedBuilding) return;

    try {
      await deleteMutation.mutateAsync(selectedBuilding.buildingName);
      setShowDeleteModal(false);
      setSelectedBuilding(null);
    } catch (error) {
      console.error("Error deleting building:", error);
    }
  };

  const handleOpenEditModal = (buildingName: string) => {
    const building = buildings.find((b) => b.buildingName === buildingName);
    if (building) {
      setSelectedBuilding(building);
      setShowEditModal(true);
    }
  };

  const handleOpenDeleteModal = (buildingName: string) => {
    const building = buildings.find((b) => b.buildingName === buildingName);
    if (building) {
      setSelectedBuilding(building);
      setShowDeleteModal(true);
    }
  };

  const handleOpenStatsModal = (buildingName: string) => {
    const building = buildings.find((b) => b.buildingName === buildingName);
    if (building) {
      setSelectedBuilding(building);
      setShowStatsModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">إدارة المنشآت</h1>
            <Button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              إضافة منشأ
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="space-y-6">
          {/* Search Section */}
          <div className="bg-white p-4 rounded-lg border">
            <input
              type="text"
              placeholder="بحث عن منشأة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Buildings Table */}
          {filteredBuildings.length > 0 ? (
            <BuildingsTable
              buildings={filteredBuildings}
              onView={handleOpenStatsModal}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteModal}
            />
          ) : (
            <div className="bg-white p-8 rounded-lg border text-center">
              <p className="text-gray-500">لا توجد منشآت متاحة</p>
            </div>
          )}

          {/* Modals */}
          <AddBuildingModal
            showModal={showAddModal}
            setShowModal={setShowAddModal}
            onSubmit={handleAddBuilding}
            isLoading={createMutation.isPending}
          />

          {selectedBuilding && (
            <>
              <EditBuildingModal
                showModal={showEditModal}
                setShowModal={setShowEditModal}
                building={selectedBuilding}
                onSubmit={handleEditBuilding}
                isLoading={updateMutation.isPending}
              />

              <DeleteBuildingModal
                showModal={showDeleteModal}
                setShowModal={setShowDeleteModal}
                building={selectedBuilding}
                onConfirm={handleDeleteBuilding}
                isLoading={deleteMutation.isPending}
              />

              <BuildingStatsModal
                showModal={showStatsModal}
                setShowModal={setShowStatsModal}
                stats={statistics}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}

"use client";

import { BuildingConfig } from "@/types/building-config";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { DataTableActions } from "@/components/ui/data-table-actions";

interface BuildingsTableProps {
  buildings: BuildingConfig[];
  onView: (buildingName: string) => void;
  onEdit: (buildingName: string) => void;
  onDelete: (buildingName: string) => void;
}

export function BuildingsTable({
  buildings,
  onView,
  onEdit,
  onDelete,
}: BuildingsTableProps) {
  const columns: ColumnDef<BuildingConfig>[] = [
    {
      accessorKey: "buildingName",
      header: "اسم المنشأ",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("buildingName")}</div>
      ),
    },
    {
      accessorKey: "buildingCode",
      header: "الكود",
      cell: ({ row }) => <div>{row.getValue("buildingCode")}</div>,
    },
    {
      accessorKey: "displayName",
      header: "الاسم بالعربية",
      cell: ({ row }) => <div>{row.getValue("displayName")}</div>,
    },
    {
      accessorKey: "allowCustomId",
      header: "معرف مخصص",
      cell: ({ row }) => {
        const allowCustomId = row.getValue("allowCustomId") as boolean;
        return (
          <span
            className={
              allowCustomId ? "text-green-600 font-semibold" : "text-gray-400"
            }
          >
            {allowCustomId ? "مفعّل" : "معطّل"}
          </span>
        );
      },
    },
    {
      accessorKey: "currentSequence",
      header: "الرقم التسلسلي",
      cell: ({ row }) => <div>{row.getValue("currentSequence")}</div>,
    },
    {
      id: "actions",
      header: "الإجراءات",
      cell: ({ row }) => {
        const building = row.original;
        return (
          <DataTableActions
            onView={() => onView(building.buildingName)}
            onEdit={() => onEdit(building.buildingName)}
            onDelete={() => onDelete(building.buildingName)}
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
      data={buildings}
      emptyMessage="لا يوجد منشآت مطابقة للبحث"
    />
  );
}

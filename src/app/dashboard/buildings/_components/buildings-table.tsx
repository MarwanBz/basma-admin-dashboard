"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { BuildingConfig } from "@/types/building-config";
import { Button } from "@/components/ui/button";

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
  return (
    <div className="rounded-lg border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-right">اسم المنشأ</TableHead>
            <TableHead className="text-right">الكود</TableHead>
            <TableHead className="text-right">الاسم بالعربية</TableHead>
            <TableHead className="text-right">معرف مخصص</TableHead>
            <TableHead className="text-right">الرقم التسلسلي</TableHead>
            <TableHead className="text-right">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {buildings.map((building) => (
            <TableRow key={building.buildingName}>
              <TableCell className="font-medium">
                {building.buildingName}
              </TableCell>
              <TableCell>{building.buildingCode}</TableCell>
              <TableCell>{building.displayName}</TableCell>
              <TableCell>
                {building.allowCustomId ? (
                  <span className="text-green-600 font-semibold">مفعّل</span>
                ) : (
                  <span className="text-gray-400">معطّل</span>
                )}
              </TableCell>
              <TableCell>{building.currentSequence}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onView(building.buildingName)}
                    title="عرض الإحصائيات"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(building.buildingName)}
                    title="تعديل"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(building.buildingName)}
                    title="حذف"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, X } from "lucide-react";
// import { REQUEST_PRIORITY, REQUEST_STATUS } from "@/constants/app-constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SearchFilter } from "@/components/ui/search-filter";
import { useBuildingConfigs } from "@/hooks/useBuildingConfigs";
import { useState } from "react";
import { useTechnicians } from "@/hooks/useTechnicians";

interface RequestFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  // New filter props
  priority?: string;
  setPriority: (priority: string) => void;
  building?: string;
  setBuilding: (building: string) => void;
  assignedToId?: string;
  setAssignedToId: (assignedToId: string) => void;
  dateFrom?: string;
  setDateFrom: (dateFrom: string) => void;
  dateTo?: string;
  setDateTo: (dateTo: string) => void;
  sortBy?: string;
  setSortBy: (sortBy: string) => void;
  sortOrder?: string;
  setSortOrder: (sortOrder: string) => void;
  onClearFilters: () => void;
}

const statusOptions = [
  { value: "all", label: "الكل" },
  { value: "DRAFT", label: "مسودة" },
  { value: "SUBMITTED", label: "مُرسل" },
  { value: "ASSIGNED", label: "مُعيّن" },
  { value: "IN_PROGRESS", label: "قيد التنفيذ" },
  { value: "COMPLETED", label: "مكتمل" },
  { value: "CLOSED", label: "مغلق" },
  { value: "REJECTED", label: "مرفوض" },
];

const priorityOptions = [
  { value: "all", label: "جميع الأولويات" },
  { value: "LOW", label: "منخفض" },
  { value: "MEDIUM", label: "متوسط" },
  { value: "HIGH", label: "عالي" },
  { value: "URGENT", label: "عاجل" },
];

const sortOptions = [
  { value: "createdAt", label: "تاريخ الإنشاء" },
  { value: "updatedAt", label: "تاريخ التحديث" },
  { value: "status", label: "الحالة" },
  { value: "priority", label: "الأولوية" },
  { value: "title", label: "العنوان" },
];

const sortOrderOptions = [
  { value: "desc", label: "تنازلي" },
  { value: "asc", label: "تصاعدي" },
];

export function RequestFilters({
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
  priority,
  setPriority,
  building,
  setBuilding,
  assignedToId,
  setAssignedToId,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  onClearFilters,
}: RequestFiltersProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Fetch technicians and buildings for dropdowns
  const { data: techniciansData } = useTechnicians();
  const { data: buildingsData } = useBuildingConfigs();

  const technicians = techniciansData?.data?.technicians || [];
  const buildings = buildingsData?.data || [];

  const hasActiveFilters =
    activeFilter !== "all" ||
    priority !== "all" ||
    building ||
    assignedToId ||
    dateFrom ||
    dateTo ||
    sortBy !== "createdAt" ||
    sortOrder !== "desc";

  return (
    <div className="space-y-4">
      {/* Main Search and Status Filter */}
      <SearchFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholder="البحث في العنوان، الوصف، الموقع، أو المعرف المخصص..."
      >
        <div className="flex gap-2 flex-wrap">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setActiveFilter(option.value)}
              className={`px-3 py-2 rounded-lg text-sm whitespace-nowrap ${
                activeFilter === option.value
                  ? "bg-primary text-white"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </SearchFilter>

      {/* Advanced Filters Toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="flex items-center gap-2"
        >
          <Filter size={16} />
          فلاتر متقدمة
          {hasActiveFilters && (
            <span className="bg-primary text-white text-xs rounded-full px-2 py-1">
              {
                [
                  activeFilter !== "all" && "الحالة",
                  priority !== "all" && "الأولوية",
                  building && "المبنى",
                  assignedToId && "الفني",
                  dateFrom && "التاريخ",
                  dateTo && "التاريخ",
                  sortBy !== "createdAt" && "الترتيب",
                  sortOrder !== "desc" && "الترتيب",
                ].filter(Boolean).length
              }
            </span>
          )}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-red-600 hover:text-red-700"
          >
            <X size={16} />
            مسح الفلاتر
          </Button>
        )}
      </div>

      {/* Advanced Filters Panel */}
      {showAdvancedFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">فلاتر متقدمة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Priority Filter */}
              <div className="space-y-2">
                <Label htmlFor="priority">الأولوية</Label>
                <Select value={priority || "all"} onValueChange={setPriority}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الأولوية" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Building Filter */}
              <div className="space-y-2">
                <Label htmlFor="building">المبنى</Label>
                <Select value={building || "all"} onValueChange={setBuilding}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المبنى" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع المباني</SelectItem>
                    {buildings.map((building) => (
                      <SelectItem
                        key={building.id}
                        value={building.buildingName}
                      >
                        {building.buildingName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Assigned Technician Filter */}
              <div className="space-y-2">
                <Label htmlFor="assignedTo">الفني المُعيّن</Label>
                <Select
                  value={assignedToId || "all"}
                  onValueChange={setAssignedToId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الفني" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الفنيين</SelectItem>
                    {technicians.map((technician) => (
                      <SelectItem key={technician.id} value={technician.id}>
                        {technician.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date From Filter */}
              <div className="space-y-2">
                <Label htmlFor="dateFrom">من تاريخ</Label>
                <Input
                  id="dateFrom"
                  type="date"
                  value={dateFrom || ""}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>

              {/* Date To Filter */}
              <div className="space-y-2">
                <Label htmlFor="dateTo">إلى تاريخ</Label>
                <Input
                  id="dateTo"
                  type="date"
                  value={dateTo || ""}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>

              {/* Sort By Filter */}
              <div className="space-y-2">
                <Label htmlFor="sortBy">ترتيب حسب</Label>
                <Select value={sortBy || "createdAt"} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر معيار الترتيب" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Order Filter */}
              <div className="space-y-2">
                <Label htmlFor="sortOrder">اتجاه الترتيب</Label>
                <Select
                  value={sortOrder || "desc"}
                  onValueChange={setSortOrder}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر اتجاه الترتيب" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOrderOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

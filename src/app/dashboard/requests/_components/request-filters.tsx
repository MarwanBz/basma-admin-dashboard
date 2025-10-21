"use client";

import { SearchFilter } from "@/components/ui/search-filter";

interface RequestFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

export function RequestFilters({
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
}: RequestFiltersProps) {
  return (
    <SearchFilter
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      placeholder="البحث عن طلب صيانة..."
    >
      <div className="flex gap-2">
        <button
          onClick={() => setActiveFilter("all")}
          className={`px-3 py-2 rounded-lg text-sm ${
            activeFilter === "all"
              ? "bg-primary text-white"
              : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
          }`}
        >
          الكل
        </button>
        <button
          onClick={() => setActiveFilter("pending")}
          className={`px-3 py-2 rounded-lg text-sm ${
            activeFilter === "pending"
              ? "bg-primary text-white"
              : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
          }`}
        >
          في الانتظار
        </button>
        <button
          onClick={() => setActiveFilter("assigned")}
          className={`px-3 py-2 rounded-lg text-sm ${
            activeFilter === "assigned"
              ? "bg-primary text-white"
              : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
          }`}
        >
          مُعيّن
        </button>
        <button
          onClick={() => setActiveFilter("in-progress")}
          className={`px-3 py-2 rounded-lg text-sm ${
            activeFilter === "in-progress"
              ? "bg-primary text-white"
              : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
          }`}
        >
          قيد التنفيذ
        </button>
        <button
          onClick={() => setActiveFilter("completed")}
          className={`px-3 py-2 rounded-lg text-sm ${
            activeFilter === "completed"
              ? "bg-primary text-white"
              : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
          }`}
        >
          مكتمل
        </button>
      </div>
    </SearchFilter>
  );
}

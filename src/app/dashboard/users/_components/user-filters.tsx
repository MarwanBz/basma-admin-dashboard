"use client"

import { SearchFilter } from "@/components/ui/search-filter"

interface UserFiltersProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  activeFilter: string
  setActiveFilter: (filter: string) => void
}

export function UserFilters({
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
}: UserFiltersProps) {
  return (
    <SearchFilter 
      searchQuery={searchQuery} 
      setSearchQuery={setSearchQuery} 
      placeholder="البحث عن مستخدم..."
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
          onClick={() => setActiveFilter("CUSTOMER")}
          className={`px-3 py-2 rounded-lg text-sm ${
            activeFilter === "CUSTOMER"
              ? "bg-primary text-white"
              : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
          }`}
        >
          عميل
        </button>
        <button
          onClick={() => setActiveFilter("TECHNICIAN")}
          className={`px-3 py-2 rounded-lg text-sm ${
            activeFilter === "TECHNICIAN"
              ? "bg-primary text-white"
              : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
          }`}
        >
          فني
        </button>
        <button
          onClick={() => setActiveFilter("BASMA_ADMIN")}
          className={`px-3 py-2 rounded-lg text-sm ${
            activeFilter === "BASMA_ADMIN"
              ? "bg-primary text-white"
              : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
          }`}
        >
          مدير بسمة
        </button>
      </div>
    </SearchFilter>
  )
}

"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import type { ReactNode } from "react"

interface SearchFilterProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  placeholder?: string
  children?: ReactNode
}

export function SearchFilter({ 
  searchQuery, 
  setSearchQuery, 
  placeholder = "البحث...", 
  children 
}: SearchFilterProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder={placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-3 pr-10"
            />
          </div>
          {children}
        </div>
      </CardContent>
    </Card>
  )
}

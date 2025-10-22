"use client";

import * as React from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  ColumnDef,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { UserRole } from "@/types/user";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  userRole?: UserRole;
  emptyMessage?: string;
  pageSize?: number;
  // Server-side pagination props
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  isLoading?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  userRole,
  emptyMessage = "لا يوجد بيانات",
  pageSize = 10,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  onPageChange,
  isLoading = false,
}: DataTableProps<TData, TValue>) {
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  // Filter columns based on user role
  const filteredColumns = React.useMemo(() => {
    return columns.filter((column) => {
      const meta = column.meta as { roles?: UserRole[] } | undefined;
      if (!meta?.roles) return true; // Show if no role restriction
      return userRole ? meta.roles.includes(userRole) : false;
    });
  }, [columns, userRole]);

  const table = useReactTable({
    data,
    columns: filteredColumns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true, // Use server-side pagination
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnVisibility,
      pagination: {
        pageIndex: currentPage - 1, // TanStack Table uses 0-based indexing
        pageSize,
      },
    },
  });

  return (
    <div className="w-full" dir="rtl">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-right">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-right">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={filteredColumns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          عرض {(currentPage - 1) * pageSize + 1} إلى{" "}
          {Math.min(currentPage * pageSize, totalItems)} من {totalItems} عنصر
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange?.(currentPage - 1)}
            disabled={currentPage <= 1 || isLoading}
            className="flex items-center gap-2"
          >
            <ChevronRight className="h-4 w-4" />
            السابق
          </Button>
          <span className="text-sm text-muted-foreground">
            صفحة {currentPage} من {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange?.(currentPage + 1)}
            disabled={currentPage >= totalPages || isLoading}
            className="flex items-center gap-2"
          >
            التالي
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

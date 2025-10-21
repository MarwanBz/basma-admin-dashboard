import { Skeleton } from "@/components/ui/skeleton";

export function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <header className="bg-white border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="space-y-6">
          {/* Filter Section Skeleton */}
          <div className="flex gap-4">
            <Skeleton className="h-10 w-64" />
          </div>

          {/* Table Skeleton */}
          <div className="rounded-lg border bg-white">
            <div className="p-4 space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-6 flex-1" />
                  <Skeleton className="h-6 flex-1" />
                  <Skeleton className="h-6 flex-1" />
                  <Skeleton className="h-6 w-32" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

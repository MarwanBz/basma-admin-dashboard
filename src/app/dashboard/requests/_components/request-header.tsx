"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface RequestHeaderProps {
  onAddRequest: () => void;
}

export function RequestHeader({ onAddRequest }: RequestHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Maintenance Requests
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage and track all maintenance requests
        </p>
      </div>
      <Button onClick={onAddRequest} className="gap-2">
        <Plus className="h-4 w-4" />
        New Request
      </Button>
    </div>
  );
}

"use client";

import { MaintenanceRequest, TabItem } from "@/types/request";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RequestTable } from "./request-table";

interface RequestTabsProps {
  tabs: TabItem[];
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  requests: MaintenanceRequest[];
  onAssign: (requestId: string) => void;
  onView: (requestId: string) => void;
  onEdit: (requestId: string) => void;
  onDelete: (requestId: string) => void;
  onStatusChange: (requestId: string, status: string) => void;
}

export function RequestTabs({
  tabs,
  activeTab,
  setActiveTab,
  requests,
  onAssign,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
}: RequestTabsProps) {
  return (
    <Card className="overflow-hidden">
      <div className="border-b">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium text-sm border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <RequestTable
        requests={requests}
        onAssign={onAssign}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
        onStatusChange={onStatusChange}
      />

      {requests.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No requests found</p>
        </div>
      )}
    </Card>
  );
}

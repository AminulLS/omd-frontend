"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { DataTable, ColumnDef } from "@/components/common/DataTable";
import { PaginationControls } from "@/components/common/pagination-controls";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserIcon, EyeIcon } from "lucide-react";

import { actionVariantMap, actionLabelMap, resourceTypeLabelMap, type AuditLog, type AuditLogFilters } from "@/lib/types/audit";
import { getAllAuditLogs } from "@/lib/services/audit";
import { mapAuditLogsApiToUi } from "@/lib/utils/audit-mapper";

interface AuditLogsTableProps {
  filters?: AuditLogFilters;
  onViewDetails?: (log: AuditLog) => void;
}

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AuditLogsTable({ filters, onViewDetails }: AuditLogsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["audit-logs", currentPage, itemsPerPage, filters],
    queryFn: () =>
      getAllAuditLogs({
        page: currentPage,
        per_page: itemsPerPage,
        ...filters,
      }),
  });

  // Transform API data to UI format
  const auditLogs = useMemo(() => {
    if (!data?.data) return [];
    return mapAuditLogsApiToUi(data.data);
  }, [data]);

  const columns: ColumnDef<AuditLog>[] = [
    {
      key: "timestamp",
      header: "Time",
      sortable: true,
      sortValue: (row) => new Date(row.timestamp),
      cell: (row) => <div className="text-xs text-muted-foreground whitespace-nowrap">{formatTimestamp(row.timestamp)}</div>,
    },
    {
      key: "action",
      header: "Action",
      sortable: true,
      cell: (row) => <Badge variant={actionVariantMap[row.action]}>{actionLabelMap[row.action]}</Badge>,
    },
    {
      key: "resourceType",
      header: "Resource",
      sortable: true,
      cell: (row) => (
        <div>
          <div className="font-medium text-sm">{resourceTypeLabelMap[row.resourceType]}</div>
          <div className="text-xs text-muted-foreground truncate max-w-50">{row.resourceName}</div>
        </div>
      ),
    },
    {
      key: "actorName",
      header: "Actor",
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <UserIcon className="size-3 text-muted-foreground shrink-0" />
          <div className="min-w-0">
            <div className="text-sm font-medium truncate">{row.actorName}</div>
            {row.actorEmail && <div className="text-xs text-muted-foreground truncate">{row.actorEmail}</div>}
          </div>
        </div>
      ),
    },
    {
      key: "description",
      header: "Description",
      cell: (row) => <div className="text-sm text-muted-foreground max-w-75 truncate">{row.description}</div>,
    },
    {
      key: "changes",
      header: "Changes",
      cell: (row) => {
        const hasChanges = row.changes && Object.keys(row.changes).length > 0;

        if (!hasChanges) {
          return <span className="text-xs text-muted-foreground">-</span>;
        }

        const changeCount = Object.keys(row.changes!).length;
        return (
          <Badge variant="outline" className="text-[10px]">
            {changeCount} field{changeCount > 1 ? "s" : ""}
          </Badge>
        );
      },
    },
    {
      key: "actions",
      header: "",
      cell: (row) => (
        <Button variant="ghost" size="icon-sm" onClick={() => onViewDetails?.(row)} title="View details">
          <EyeIcon className="size-4" />
        </Button>
      ),
    },
  ];

  const { startIndex, endIndex, totalPages, totalItems } = useMemo(() => {
    if (!data?.meta) {
      return {
        startIndex: 0,
        endIndex: 0,
        totalPages: 0,
        totalItems: 0,
      };
    }

    return {
      startIndex: (data.meta.from || 1) - 1,
      endIndex: data.meta.to || 1,
      totalPages: data.meta.last_page,
      totalItems: data.meta.total,
    };
  }, [data]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  if (isError) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-destructive">Error loading audit logs: {error?.message || "Unknown error"}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <DataTable columns={columns} data={auditLogs} isLoading={isLoading} emptyMessage="No audit logs found" exportFileName="audit-logs" />

      {auditLogs.length > 0 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          startIndex={startIndex}
          endIndex={endIndex}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          name="audit logs"
        />
      )}
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import { DataTable, ColumnDef, DataTableActions } from "@/components/common/DataTable";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { statusVariantMap, statusLabelMap, typeVariantMap, typeLabelMap } from "@/lib/types/syndicates";
import type { Syndicate, SyndicateStatus, SyndicateType } from "@/lib/types/syndicates";
import { getAllSyndicates } from "@/lib/services/syndicates-api";

import { PaginationControls } from "@/components/common/pagination-controls";

interface SyndicatesTableProps {
  partner_id?: string;
  onEdit?: (syndicate: Syndicate) => void;
  onDelete?: (id: string) => void;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function SyndicatesTable({ onEdit, onDelete, partner_id }: SyndicatesTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [searchQuery, setSearchQuery] = useState("");
  const [partnerIdFilter, setPartnerIdFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["syndicates", currentPage, itemsPerPage, searchQuery, partnerIdFilter, statusFilter, typeFilter],
    queryFn: () =>
      getAllSyndicates({
        page: currentPage,
        per_page: itemsPerPage,
        search: searchQuery || undefined,
        partner_id: partner_id ? partner_id || undefined : partnerIdFilter || undefined,
        status: statusFilter !== "all" ? (statusFilter as SyndicateStatus) : undefined,
        type: typeFilter !== "all" ? (typeFilter as SyndicateType) : undefined,
      }),
  });

  const columns: ColumnDef<Syndicate>[] = [
    {
      key: "name",
      header: "Name",
      sortable: true,
      cell: (row) => (
        <Link href={`/dashboard/syndicates/${row.id}`} className="hover:underline font-medium">
          {row.name}
        </Link>
      ),
    },
    {
      key: "key",
      header: "Key",
      sortable: true,
      cell: (row) => <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{row.key}</code>,
    },
    {
      key: "partner_id",
      header: "Partner",
      cell: (row) => (
        <Link href={`/dashboard/partners/${row.partner_id}`} className="hover:underline text-primary">
          {row.partner_id}
        </Link>
      ),
    },
    {
      key: "type",
      header: "Type",
      sortable: true,
      cell: (row) => <Badge variant={typeVariantMap[row.type]}>{typeLabelMap[row.type]}</Badge>,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      cell: (row) => <Badge variant={statusVariantMap[row.status]}>{statusLabelMap[row.status]}</Badge>,
    },
    {
      key: "split",
      header: "Split %",
      sortable: true,
      cell: (row) => (row.split !== null ? <span className="text-sm">{row.split.toFixed(2)}%</span> : <span className="text-muted-foreground text-sm">—</span>),
    },
    {
      key: "cpc",
      header: "CPC",
      sortable: true,
      cell: (row) => (row.cpc !== null ? <span className="text-sm">${row.cpc.toFixed(4)}</span> : <span className="text-muted-foreground text-sm">—</span>),
    },
    {
      key: "content",
      header: "Content",
      cell: (row) => <span className="text-sm text-muted-foreground truncate max-w-xs block">{row.content}</span>,
    },
    {
      key: "created_at",
      header: "Created At",
      sortable: true,
      sortValue: (row) => new Date(row.created_at),
      cell: (row) => formatDate(row.created_at),
    },
  ];

  const actions: DataTableActions<Syndicate> = {
    onEdit: onEdit,
    onDelete: onDelete ? (syndicate) => onDelete(syndicate.id) : undefined,
  };

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
      startIndex: data?.meta?.from || 1 - 1,
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

  const handleFilterChange = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    setCurrentPage(1);
  };

  if (isError) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-destructive">Error loading syndicates: {error?.message || "Unknown error"}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col gap-2">
              <Label>Search</Label>
              <Input
                placeholder="Search syndicates..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-62.5"
              />
            </div>

            {!partner_id && (
              <div className="flex flex-col gap-2">
                <Label>Partner ID</Label>
                <Input
                  placeholder="Filter by Partner ID..."
                  value={partnerIdFilter}
                  onChange={(e) => {
                    setPartnerIdFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-62.5"
                />
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Label>Type</Label>
              <Select value={typeFilter} onValueChange={handleFilterChange(setTypeFilter)}>
                <SelectTrigger className="w-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {Object.entries(typeLabelMap).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={handleFilterChange(setStatusFilter)}>
                <SelectTrigger className="w-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {Object.entries(statusLabelMap).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable columns={columns} data={data?.data || []} actions={actions} isLoading={isLoading} emptyMessage="No syndicates found" exportFileName="syndicates" />
        </CardContent>
      </Card>

      {data?.data && data.data.length > 0 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          startIndex={startIndex}
          endIndex={endIndex}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      )}
    </div>
  );
}

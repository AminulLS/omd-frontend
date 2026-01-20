"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import { DataTable, ColumnDef, DataTableActions } from "@/components/common/DataTable";
import { PaginationControls } from "@/components/common/pagination-controls";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserIcon } from "lucide-react";

import { statusVariantMap, typeVariantMap, typeLabelMap, productLabelMap, statusLabelMap } from "@/lib/types/partners";
import type { Partner } from "@/lib/types/partners";
import { getAllPartners } from "@/lib/services/partners-api";

interface PartnersTableProps {
  onEdit?: (partner: Partner) => void;
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

export function PartnersTable({ onEdit, onDelete }: PartnersTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["partners", currentPage, itemsPerPage],
    queryFn: () =>
      getAllPartners({
        page: currentPage,
        per_page: itemsPerPage,
      }),
  });

  const columns: ColumnDef<Partner>[] = [
    {
      key: "name",
      header: "Name",
      sortable: true,
      cell: (row) => (
        <Link href={`/dashboard/partners/${row.id}/sponsored`} className="hover:underline font-medium">
          {row.name}
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
      key: "email",
      header: "Email",
    },
    {
      key: "phone",
      header: "Phone",
    },
    {
      key: "users",
      header: "Users",
      cell: (row) => {
        const mainUser = row?.users?.find((u) => u.role === "main_user");
        const managerCount = row?.users?.filter((u) => u.role === "manager").length || 0;

        if (!row?.users || row.users.length === 0) {
          return <span className="text-muted-foreground text-sm">No users</span>;
        }

        return (
          <div className="space-y-1">
            {mainUser && (
              <div className="flex items-center gap-1 text-sm">
                <UserIcon className="size-3 text-muted-foreground" />
                <span className="font-medium">{mainUser.name}</span>
                <Badge variant="secondary" className="text-[10px] px-1">
                  Main
                </Badge>
              </div>
            )}
            {managerCount > 0 && (
              <div className="text-xs text-muted-foreground">
                +{managerCount} manager{managerCount > 1 ? "s" : ""}
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: "products",
      header: "Products",
      cell: (row) => {
        if (!row?.products || row.products.length === 0) {
          return <span className="text-muted-foreground text-sm">No products</span>;
        }

        return (
          <div className="flex gap-1 flex-wrap">
            {row.products.map((product) => (
              <Badge key={product} variant="outline" className="text-[10px]">
                {productLabelMap[product]}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      key: "created_at",
      header: "Created At",
      sortable: true,
      sortValue: (row) => new Date(row.created_at),
      cell: (row) => formatDate(row.created_at),
    },
  ];

  const actions: DataTableActions<Partner> = {
    onEdit: onEdit,
    onDelete: onDelete ? (partner) => onDelete(partner.id) : undefined,
  };

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
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
  }, [data?.meta]);

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
          <div className="text-center text-destructive">Error loading partners: {error?.message || "Unknown error"}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <DataTable columns={columns} data={data?.data || []} actions={actions} isLoading={isLoading} emptyMessage="No partners found" exportFileName="partners" />

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
          name="partners"
        />
      )}
    </div>
  );
}

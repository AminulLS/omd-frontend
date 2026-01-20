"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import { DataTable, ColumnDef, DataTableActions } from "@/components/common/DataTable";
import { PaginationControls } from "@/components/common/pagination-controls";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserIcon, MailIcon, ShieldIcon } from "lucide-react";
import { getAllUsers } from "@/lib/services/user-api";
import { isUserWithRoles, type User, type UserWithRoles, statusVariantMap, typeVariantMap, statusLabelMap, typeLabelMap } from "@/lib/types/users";
import type { UserStatus, UserType } from "@/lib/types/users";
interface UsersTableProps {
  searchQuery?: string;
  statusFilter?: UserStatus | "all";
  typeFilter?: UserType | "all";
  onEdit?: (user: User | UserWithRoles) => void;
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

export function UsersTable({ onEdit, onDelete }: UsersTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users", currentPage, itemsPerPage],
    queryFn: () =>
      getAllUsers({
        page: currentPage,
        per_page: itemsPerPage,
      }),
  });

  const columns: ColumnDef<User | UserWithRoles>[] = [
    {
      key: "name",
      header: "Name",
      sortable: true,
      cell: (row) => (
        <Link href={`/dashboard/users/${row.id}`} className="hover:underline font-medium">
          <div className="flex items-center gap-2">
            <UserIcon className="size-4 text-muted-foreground" />
            {row.name}
          </div>
        </Link>
      ),
    },
    {
      key: "email",
      header: "Email",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <MailIcon className="size-3 text-muted-foreground" />
          {row.email}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      cell: (row) => (row.status ? <Badge variant={statusVariantMap[row.status]}>{statusLabelMap[row.status]}</Badge> : <span className="text-muted-foreground text-sm">N/A</span>),
    },
    {
      key: "type",
      header: "Type",
      sortable: true,
      cell: (row) => (row.type ? <Badge variant={typeVariantMap[row.type]}>{typeLabelMap[row.type]}</Badge> : <span className="text-muted-foreground text-sm">N/A</span>),
    },
    {
      key: "roles",
      header: "Roles",
      cell: (row) => {
        if (!isUserWithRoles(row) || !row.roles || row.roles.length === 0) {
          return <span className="text-muted-foreground text-sm">No roles</span>;
        }

        return (
          <div className="flex gap-1 flex-wrap">
            {row.roles.slice(0, 2).map((role) => (
              <Badge key={role.id} variant="outline" className="text-[10px]">
                <div className="flex items-center gap-1">
                  <ShieldIcon className="size-3" />
                  {role.name}
                </div>
              </Badge>
            ))}
            {row.roles.length > 2 && (
              <Badge variant="outline" className="text-[10px]">
                +{row.roles.length - 2}
              </Badge>
            )}
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

  const actions: DataTableActions<User | UserWithRoles> = {
    onEdit: onEdit,
    onDelete: onDelete ? (user) => onDelete(user.id) : undefined,
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
      startIndex: data.meta.from || 1 - 1,
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
          <div className="text-center text-destructive">Error loading users: {error?.message || "Unknown error"}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <DataTable columns={columns} data={data?.data || []} actions={actions} isLoading={isLoading} emptyMessage="No users found" exportFileName="users" />

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
          name="users"
        />
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVerticalIcon, UserIcon } from "lucide-react";
import { DeletePartnerDialog } from "./delete-partner-dialog";
import type { Partner } from "@/lib/types/partners";
import { statusVariantMap, typeVariantMap, typeLabelMap, productLabelMap, statusLabelMap } from "@/lib/types/partners";

interface PartnerRowProps {
  partner: Partner;
  onEdit: (partner: Partner) => void;
  onDelete: (id: string) => void;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function PartnerRow({ partner, onEdit, onDelete }: PartnerRowProps) {
  const mainUser = partner?.users?.find((u) => u.role === "main_user");
  const managerCount = partner?.users?.filter((u) => u.role === "manager").length;

  return (
    <TableRow>
      <TableCell className="font-medium">
        <Link href={`/dashboard/partners/${partner.id}/sponsored`} className="hover:underline">
          {partner.name}
        </Link>
      </TableCell>
      <TableCell>
        <Badge variant={typeVariantMap[partner.type]}>{typeLabelMap[partner.type]}</Badge>
      </TableCell>
      <TableCell>
        <Badge variant={statusVariantMap[partner.status]}>{statusLabelMap[partner.status]}</Badge>
      </TableCell>
      <TableCell>{partner.email}</TableCell>
      <TableCell>{partner.phone}</TableCell>
      <TableCell>
        {partner?.users?.length === 0 ? (
          <span className="text-muted-foreground text-sm">No users</span>
        ) : (
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
            {managerCount && managerCount > 0 && (
              <div className="text-xs text-muted-foreground">
                +{managerCount} manager{managerCount > 1 ? "s" : ""}
              </div>
            )}
          </div>
        )}
      </TableCell>
      <TableCell>
        {partner?.products?.length === 0 ? (
          <span className="text-muted-foreground text-sm">No products</span>
        ) : (
          <div className="flex gap-1 flex-wrap">
            {partner?.products?.map((product) => (
              <Badge key={product} variant="outline" className="text-[10px]">
                {productLabelMap[product]}
              </Badge>
            ))}
          </div>
        )}
      </TableCell>
      <TableCell>{formatDate(partner.created_at)}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-xs">
              <MoreVerticalIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(partner)}>Edit</DropdownMenuItem>
            <DeletePartnerDialog partnerName={partner.name} onConfirm={() => onDelete(partner.id)} />
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

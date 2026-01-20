"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

interface PartnersHeaderProps {
  onAddClick: () => void;
}

export function PartnersHeader({ onAddClick }: PartnersHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4 border-b pb-2">
      <div>
        <h2 className="text-lg font-semibold">Partners</h2>
        <p className="text-sm text-muted-foreground">Manage all partner relationships and their associated products</p>
      </div>
      <Button size="sm" onClick={onAddClick}>
        <PlusIcon className="size-4" />
        Add Partner
      </Button>
    </div>
  );
}

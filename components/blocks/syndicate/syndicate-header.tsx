"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

interface SyndicatesHeaderProps {
  onAddClick: () => void;
}

export function SyndicatesHeader({ onAddClick }: SyndicatesHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4 border-b pb-2">
      <div>
        <h2 className="text-lg font-semibold">Syndicates</h2>
        <p className="text-sm text-muted-foreground">Manage syndicate feeds and their configurations</p>
      </div>
      <Button size="sm" onClick={onAddClick}>
        <PlusIcon className="size-4" />
        Add Syndicate
      </Button>
    </div>
  );
}

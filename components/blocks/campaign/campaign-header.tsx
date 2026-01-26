"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

interface CampaignsHeaderProps {
  onAddClick: () => void;
}

export function CampaignsHeader({ onAddClick }: CampaignsHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4 border-b pb-2">
      <div>
        <h2 className="text-lg font-semibold">Campaigns</h2>
        <p className="text-sm text-muted-foreground">Manage all campaigns and their configurations</p>
      </div>
      <Button size="sm" onClick={onAddClick}>
        <PlusIcon className="size-4" />
        Add Campaign
      </Button>
    </div>
  );
}

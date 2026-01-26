"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import type { AdStatus } from "@/lib/types/ads";
import { statusVariantMap } from "@/lib/types/ads";

interface AdDetailsHeaderProps {
  adName: string;
  uniqueId: string;
  partner: string;
  status: AdStatus;
  isDirty: boolean;
  isSaving: boolean;
}

export function AdDetailsHeader({ adName, uniqueId, partner, status, isDirty, isSaving }: AdDetailsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/ads/sponsored">
          <Button variant="ghost" size="icon" type="button">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-lg font-semibold">{adName}</h1>
          <p className="text-sm text-muted-foreground">
            ID: {uniqueId} • Partner: {partner}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant={statusVariantMap[status]}>{status}</Badge>
        <Button type="submit" disabled={!isDirty || isSaving} variant={isDirty ? "default" : "secondary"}>
          {isSaving ? "Saving..." : isDirty ? "Save Changes" : "No Changes"}
        </Button>
      </div>
    </div>
  );
}

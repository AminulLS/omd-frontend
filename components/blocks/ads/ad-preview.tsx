"use client";

import { UseFormWatch } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { format } from "date-fns";
import { COUNTRIES } from "@/lib/constants/countries";
import { statusVariantMap } from "@/lib/types/ads";
import type { AdFormData } from "@/lib/types/ads";

interface AdPreviewSidebarProps {
  watch: UseFormWatch<AdFormData>;
  createdAt: string;
  updatedAt: string;
}

export function AdPreviewSidebar({ watch, createdAt, updatedAt }: AdPreviewSidebarProps) {
  const title = watch("title");
  const copy = watch("copy");
  const imageUrl = watch("image_url");
  const originalUrl = watch("original_url");
  const companyName = watch("meta.company_name");
  const status = watch("status");
  const country = watch("country");
  const placement = watch("placement");
  const nickname = watch("nickname");

  return (
    <div className="sticky top-4 space-y-4">
      {/* Ad Preview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Ad Preview
          </CardTitle>
          <CardDescription>See how your ad will appear</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border p-6 bg-muted/50 space-y-4">
            {imageUrl && (
              <div className="aspect-video bg-background overflow-hidden flex items-center justify-center rounded">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt="Ad preview" className="max-w-full max-h-full object-contain" />
              </div>
            )}
            <div className="text-lg font-bold text-center">{title || "Ad Title"}</div>
            {companyName && <div className="text-sm text-center text-muted-foreground">{companyName}</div>}
            {copy && <div className="text-sm text-center text-muted-foreground">{copy}</div>}
            <Button className="w-full" size="sm" type="button">
              Click Here
            </Button>
            {originalUrl && (
              <div className="pt-4 border-t">
                <div className="text-xs text-muted-foreground mb-1">Destination URL:</div>
                <div className="text-xs font-mono text-muted-foreground break-all">{originalUrl}</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Settings Overview</CardTitle>
          <CardDescription>Quick summary of current configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nickname:</span>
              <span className="font-medium">{nickname || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <Badge variant={statusVariantMap[status]}>{status}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Country:</span>
              <span className="font-medium">{COUNTRIES[country] || country}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Placement:</span>
              <span className="font-medium">{placement}</span>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created:</span>
                <span className="font-medium">{format(new Date(createdAt), "MMM dd, yyyy")}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-muted-foreground">Last Updated:</span>
                <span className="font-medium">{format(new Date(updatedAt), "MMM dd, yyyy")}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

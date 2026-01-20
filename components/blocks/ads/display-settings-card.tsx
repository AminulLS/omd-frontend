"use client";

import { UseFormWatch, UseFormSetValue } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import type { AdFormData } from "@/lib/types/ads";

interface AdDisplayCardProps {
  watch: UseFormWatch<AdFormData>;
  setValue: UseFormSetValue<AdFormData>;
}

export function AdDisplayCard({ watch, setValue }: AdDisplayCardProps) {
  const disclaimer = watch("meta.disclaimer");
  const showImage = watch("meta.show_image");
  const showCopy = watch("meta.show_copy");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Display Settings</CardTitle>
        <CardDescription>Control how your ad is displayed</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Field>
              <FieldLabel>Ad Disclaimer</FieldLabel>
              <FieldContent>
                <Textarea value={disclaimer || ""} onChange={(e) => setValue("meta.disclaimer", e.target.value, { shouldDirty: true })} placeholder="Enter disclaimer text" rows={3} />
              </FieldContent>
            </Field>
          </div>

          <div className="space-y-4">
            <Field>
              <FieldLabel>Show Image on Offer</FieldLabel>
              <FieldContent>
                <div className="flex items-center gap-2">
                  <Switch checked={showImage === "yes"} onCheckedChange={(checked) => setValue("meta.show_image", checked ? "yes" : "no", { shouldDirty: true })} />
                  <span className="text-sm text-muted-foreground">{showImage === "yes" ? "Enabled" : "Disabled"}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Display ad image on the offer page</p>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Show Ad Description/Copy</FieldLabel>
              <FieldContent>
                <div className="flex items-center gap-2">
                  <Switch checked={showCopy === "yes"} onCheckedChange={(checked) => setValue("meta.show_copy", checked ? "yes" : "no", { shouldDirty: true })} />
                  <span className="text-sm text-muted-foreground">{showCopy === "yes" ? "Enabled" : "Disabled"}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Show ad copy in the listing</p>
              </FieldContent>
            </Field>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

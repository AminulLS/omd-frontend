"use client";

import { UseFormWatch, UseFormSetValue, FieldErrors } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { AdFormData } from "@/lib/types/ads";

interface AdButtonsCardProps {
  watch: UseFormWatch<AdFormData>;
  setValue: UseFormSetValue<AdFormData>;
  errors?: FieldErrors<AdFormData>;
}

export function AdButtonsCard({ watch, setValue }: AdButtonsCardProps) {
  const progressButton = watch("meta.progress_button");
  const skipButton = watch("meta.skip_button");

  // Extract values from progress_button tuple [string, null]
  const progressButtonPrimary = progressButton?.[0] || "";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Buttons</CardTitle>
        <CardDescription>Custom button labels for your ad</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Progress Button</FieldLabel>
            <FieldContent>
              <Input value={progressButtonPrimary} onChange={(e) => setValue("meta.progress_button", [e.target.value, null], { shouldDirty: true })} placeholder="e.g., Continue, Next Step" />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Skip Button</FieldLabel>
            <FieldContent>
              <Input value={skipButton || ""} onChange={(e) => setValue("meta.skip_button", e.target.value, { shouldDirty: true })} placeholder="e.g., Skip" />
            </FieldContent>
          </Field>
        </div>
      </CardContent>
    </Card>
  );
}

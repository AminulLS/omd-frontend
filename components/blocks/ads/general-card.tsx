"use client";

import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { AdFormData, AdStatus } from "@/lib/types/ads";

interface AdGeneralCardProps {
  register: UseFormRegister<AdFormData>;
  errors: FieldErrors<AdFormData>;
  watch: UseFormWatch<AdFormData>;
  setValue: UseFormSetValue<AdFormData>;
}

const adStatuses = [
  { value: "pending", label: "Pending" },
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
  { value: "rejected", label: "Rejected" },
] as const;

const categoryOptions = [
  { value: "employment", label: "Employment" },
  { value: "education", label: "Education" },
  { value: "finance", label: "Finance" },
  { value: "health", label: "Health" },
  { value: "technology", label: "Technology" },
  { value: "travel", label: "Travel" },
  { value: "automotive", label: "Automotive" },
  { value: "retail", label: "Retail" },
  { value: "real-estate", label: "Real Estate" },
  { value: "other", label: "Other" },
];

export function AdGeneralCard({ register, errors, watch, setValue }: AdGeneralCardProps) {
  const status = watch("status");
  const category = watch("category");

  return (
    <Card>
      <CardHeader>
        <CardTitle>General</CardTitle>
        <CardDescription>Status, Tracking, Category, Notes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Field>
              <FieldLabel>Status</FieldLabel>
              <FieldContent>
                <Select value={status} onValueChange={(value: AdStatus) => setValue("status", value, { shouldDirty: true })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {adStatuses.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.status && <p className="text-sm text-destructive mt-1">{errors.status.message}</p>}
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Tracking ID</FieldLabel>
              <FieldContent>
                <Input {...register("gtm_tracking")} placeholder="Enter tracking ID" />
                {errors.gtm_tracking && <p className="text-sm text-destructive mt-1">{errors.gtm_tracking.message}</p>}
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Category</FieldLabel>
              <FieldContent>
                <Select value={category} onValueChange={(value) => setValue("category", value, { shouldDirty: true })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-sm text-destructive mt-1">{errors.category.message}</p>}
              </FieldContent>
            </Field>
          </div>

          <div className="space-y-4">
            <Field>
              <FieldLabel>Nickname</FieldLabel>
              <FieldContent>
                <Input {...register("nickname")} placeholder="Enter internal nickname" />
                {errors.nickname && <p className="text-sm text-destructive mt-1">{errors.nickname.message}</p>}
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Public Nickname</FieldLabel>
              <FieldContent>
                <Input {...register("public_nickname")} placeholder="Enter public nickname" />
                {errors.public_nickname && <p className="text-sm text-destructive mt-1">{errors.public_nickname.message}</p>}
              </FieldContent>
            </Field>
          </div>
        </div>

        <div className="mt-6">
          <Field>
            <FieldLabel>Notes</FieldLabel>
            <FieldContent>
              <Textarea {...register("notes")} placeholder="Enter notes" rows={3} />
              {errors.notes && <p className="text-sm text-destructive mt-1">{errors.notes.message}</p>}
            </FieldContent>
          </Field>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Variable } from "lucide-react";
import type { AdFormData, AdImagePriority } from "@/lib/types/ads";

interface AdDetailsCardProps {
  register: UseFormRegister<AdFormData>;
  errors: FieldErrors<AdFormData>;
  watch: UseFormWatch<AdFormData>;
  setValue: UseFormSetValue<AdFormData>;
  onOpenVariablesModal: () => void;
}

const imagePriorities = [
  { value: "high", label: "High" },
  { value: "low", label: "Low" },
  { value: "any", label: "Any" },
] as const;

export function AdDetailsCard({ register, errors, watch, setValue, onOpenVariablesModal }: AdDetailsCardProps) {
  const imagePriority = watch("image_priority");
  const companyName = watch("meta.company_name");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Details</CardTitle>
        <CardDescription>Title, Copy, Image, URL</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel>Title</FieldLabel>
                <Button variant="ghost" size="icon" onClick={onOpenVariablesModal} title="View available variables" type="button">
                  <Variable className="h-4 w-4" />
                </Button>
              </div>
              <FieldContent>
                <Input {...register("title")} placeholder="Enter ad title" />
                {errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}
              </FieldContent>
            </Field>

            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel>Copy</FieldLabel>
                <Button variant="ghost" size="icon" onClick={onOpenVariablesModal} title="View available variables" type="button">
                  <Variable className="h-4 w-4" />
                </Button>
              </div>
              <FieldContent>
                <Textarea {...register("copy")} placeholder="Enter ad copy" rows={3} />
                {errors.copy && <p className="text-sm text-destructive mt-1">{errors.copy.message}</p>}
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Company Name</FieldLabel>
              <FieldContent>
                <Input value={companyName || ""} onChange={(e) => setValue("meta.company_name", e.target.value, { shouldDirty: true })} placeholder="Enter company name" />
              </FieldContent>
            </Field>

            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel>Original URL</FieldLabel>
                <Button variant="ghost" size="icon" onClick={onOpenVariablesModal} title="View available variables" type="button">
                  <Variable className="h-4 w-4" />
                </Button>
              </div>
              <FieldContent>
                <Input {...register("original_url")} placeholder="https://example.com" />
                {errors.original_url && <p className="text-sm text-destructive mt-1">{errors.original_url.message}</p>}
              </FieldContent>
            </Field>
          </div>

          <div className="space-y-4">
            <Field>
              <FieldLabel>Ad Image URL</FieldLabel>
              <FieldContent>
                <Input {...register("image_url")} placeholder="https://example.com/image.jpg" className="font-mono text-xs" />
                <p className="text-xs text-muted-foreground mt-1">Enter a valid image URL</p>
                {errors.image_url && <p className="text-sm text-destructive mt-1">{errors.image_url.message}</p>}
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Image Priority</FieldLabel>
              <FieldContent>
                <Select value={imagePriority} onValueChange={(value: AdImagePriority) => setValue("image_priority", value, { shouldDirty: true })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {imagePriorities.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        {priority.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.image_priority && <p className="text-sm text-destructive mt-1">{errors.image_priority.message}</p>}
              </FieldContent>
            </Field>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

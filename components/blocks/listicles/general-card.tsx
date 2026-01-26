"use client";

import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { designTypeLabelMap } from "@/lib/types/listicles";
import type { ListicleFormData, ListicleDesignType } from "@/lib/types/listicles";

interface ListicleGeneralCardProps {
  register: UseFormRegister<ListicleFormData>;
  errors: FieldErrors<ListicleFormData>;
  watch: UseFormWatch<ListicleFormData>;
  setValue: UseFormSetValue<ListicleFormData>;
}

export function ListicleGeneralCard({ register, errors, watch, setValue }: ListicleGeneralCardProps) {
  const designType = watch("design_type");

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>General</CardTitle>
        <CardDescription>Basic information for the listicle</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Field>
          <FieldLabel>Title *</FieldLabel>
          <FieldContent>
            <Input {...register("title")} placeholder="Enter listicle title" />
            {errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Slug *</FieldLabel>
          <FieldContent>
            <Input {...register("slug")} placeholder="listicle-url-slug" className="font-mono" />
            {errors.slug && <p className="text-sm text-destructive mt-1">{errors.slug.message}</p>}
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Design Type *</FieldLabel>
          <FieldContent>
            <Select value={designType} onValueChange={(value: ListicleDesignType) => setValue("design_type", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(designTypeLabelMap).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.design_type && <p className="text-sm text-destructive mt-1">{errors.design_type.message}</p>}
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Copy *</FieldLabel>
          <FieldContent>
            <Textarea {...register("copy")} placeholder="Enter listicle copy/description..." rows={4} />
            {errors.copy && <p className="text-sm text-destructive mt-1">{errors.copy.message}</p>}
          </FieldContent>
        </Field>
      </CardContent>
    </Card>
  );
}

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldContent, FieldGroup, FieldLabel } from "@/components/ui/field";
import { partnerFormSchema, type PartnerFormData } from "@/lib/schemas/partner-schema";
import type { Partner } from "@/lib/types/partners";

interface PartnerFormProps {
  defaultValues?: Partner;
  onSubmit: (data: PartnerFormData) => void;
  isSubmitting?: boolean;
}

export function PartnerForm({ defaultValues, onSubmit, isSubmitting }: PartnerFormProps) {
  const form = useForm<PartnerFormData>({
    resolver: zodResolver(partnerFormSchema),
    defaultValues: defaultValues
      ? {
          name: defaultValues.name,
          email: defaultValues.email,
          phone: defaultValues.phone,
          website: defaultValues.website,
          type: defaultValues.type,
          status: defaultValues.status,
        }
      : {
          name: "",
          email: "",
          phone: "",
          website: "",
          type: "external",
          status: "active",
        },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} id="partner-form">
      <FieldGroup>
        <Field>
          <FieldLabel>Name</FieldLabel>
          <FieldContent>
            <Input {...form.register("name")} placeholder="Partner name" disabled={isSubmitting} />
            {form.formState.errors.name && <p className="text-sm text-destructive mt-1">{form.formState.errors.name.message}</p>}
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Email</FieldLabel>
          <FieldContent>
            <Input {...form.register("email")} type="email" placeholder="email@example.com" disabled={isSubmitting} />
            {form.formState.errors.email && <p className="text-sm text-destructive mt-1">{form.formState.errors.email.message}</p>}
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Phone</FieldLabel>
          <FieldContent>
            <Input {...form.register("phone")} type="tel" placeholder="+1234567890" disabled={isSubmitting} />
            {form.formState.errors.phone && <p className="text-sm text-destructive mt-1">{form.formState.errors.phone.message}</p>}
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Website</FieldLabel>
          <FieldContent>
            <Input {...form.register("website")} type="url" placeholder="https://example.com" disabled={isSubmitting} />
            {form.formState.errors.website && <p className="text-sm text-destructive mt-1">{form.formState.errors.website.message}</p>}
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Type</FieldLabel>
          <FieldContent>
            {/* eslint-disable-next-line react-hooks/incompatible-library */}
            <Select value={form.watch("type")} onValueChange={(value) => form.setValue("type", value as PartnerFormData["type"])} disabled={isSubmitting}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="internal">Internal</SelectItem>
                <SelectItem value="external">External</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.type && <p className="text-sm text-destructive mt-1">{form.formState.errors.type.message}</p>}
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Status</FieldLabel>
          <FieldContent>
            <Select value={form.watch("status")} onValueChange={(value) => form.setValue("status", value as "active" | "inactive" | "pending" | "suspended")} disabled={isSubmitting}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.status && <p className="text-sm text-destructive mt-1">{form.formState.errors.status.message}</p>}
          </FieldContent>
        </Field>
      </FieldGroup>
    </form>
  );
}

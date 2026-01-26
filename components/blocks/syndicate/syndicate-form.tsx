"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldContent, FieldGroup, FieldLabel } from "@/components/ui/field";
import { syndicateFormSchema, type SyndicateFormData } from "@/lib/schemas/syndicate-schema";
import type { Syndicate } from "@/lib/types/syndicates";

interface SyndicateFormProps {
  defaultValues?: Syndicate;
  onSubmit: (data: SyndicateFormData) => void;
  isSubmitting?: boolean;
  partners?: Array<{ id: string; name: string }>;
}

export function SyndicateForm({ defaultValues, onSubmit, isSubmitting, partners = [] }: SyndicateFormProps) {
  const form = useForm<SyndicateFormData>({
    resolver: zodResolver(syndicateFormSchema),
    defaultValues: defaultValues
      ? {
          partner_id: defaultValues.partner_id,
          type: defaultValues.type,
          status: defaultValues.status,
          key: defaultValues.key,
          name: defaultValues.name,
          content: defaultValues.content,
          redirect_url: defaultValues.redirect_url,
          split: defaultValues.split,
          cpc: defaultValues.cpc,
        }
      : {
          partner_id: "",
          type: "external",
          status: "active",
          key: "",
          name: "",
          content: "",
          redirect_url: null,
          split: null,
          cpc: null,
        },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} id="syndicate-form">
      <FieldGroup>
        <Field>
          <FieldLabel>Partner *</FieldLabel>
          <FieldContent>
            {/* eslint-disable-next-line react-hooks/incompatible-library */}
            <Select value={form.watch("partner_id")} onValueChange={(value) => form.setValue("partner_id", value)} disabled={isSubmitting}>
              <SelectTrigger>
                <SelectValue placeholder="Select partner" />
              </SelectTrigger>
              <SelectContent>
                {partners.map((partner) => (
                  <SelectItem key={partner.id} value={partner.id}>
                    {partner.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.partner_id && <p className="text-sm text-destructive mt-1">{form.formState.errors.partner_id.message}</p>}
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Key *</FieldLabel>
          <FieldContent>
            <Input {...form.register("key")} placeholder="PARTNER-KEY-123" disabled={isSubmitting} />
            <p className="text-xs text-muted-foreground mt-1">Uppercase letters, numbers, and hyphens only</p>
            {form.formState.errors.key && <p className="text-sm text-destructive mt-1">{form.formState.errors.key.message}</p>}
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Name *</FieldLabel>
          <FieldContent>
            <Input {...form.register("name")} placeholder="Syndicate name" disabled={isSubmitting} />
            {form.formState.errors.name && <p className="text-sm text-destructive mt-1">{form.formState.errors.name.message}</p>}
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Content *</FieldLabel>
          <FieldContent>
            <Textarea {...form.register("content")} placeholder="Syndicate content" disabled={isSubmitting} rows={4} />
            {form.formState.errors.content && <p className="text-sm text-destructive mt-1">{form.formState.errors.content.message}</p>}
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Type</FieldLabel>
          <FieldContent>
            <Select value={form.watch("type")} onValueChange={(value) => form.setValue("type", value as SyndicateFormData["type"])} disabled={isSubmitting}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="external">External</SelectItem>
                <SelectItem value="internal">Internal</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.type && <p className="text-sm text-destructive mt-1">{form.formState.errors.type.message}</p>}
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Status</FieldLabel>
          <FieldContent>
            <Select value={form.watch("status")} onValueChange={(value) => form.setValue("status", value as SyndicateFormData["status"])} disabled={isSubmitting}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.status && <p className="text-sm text-destructive mt-1">{form.formState.errors.status.message}</p>}
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Redirect URL</FieldLabel>
          <FieldContent>
            <Input {...form.register("redirect_url")} type="url" placeholder="https://example.com" disabled={isSubmitting} />
            {form.formState.errors.redirect_url && <p className="text-sm text-destructive mt-1">{form.formState.errors.redirect_url.message}</p>}
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Split (%)</FieldLabel>
          <FieldContent>
            <Input
              {...form.register("split", {
                setValueAs: (v) => (v === "" ? null : parseFloat(v)),
              })}
              type="number"
              step="0.01"
              min="0"
              max="100"
              placeholder="50"
              disabled={isSubmitting}
            />
            {form.formState.errors.split && <p className="text-sm text-destructive mt-1">{form.formState.errors.split.message}</p>}
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>CPC</FieldLabel>
          <FieldContent>
            <Input
              {...form.register("cpc", {
                setValueAs: (v) => (v === "" ? null : parseFloat(v)),
              })}
              type="number"
              step="0.01"
              min="0"
              placeholder="0.50"
              disabled={isSubmitting}
            />
            {form.formState.errors.cpc && <p className="text-sm text-destructive mt-1">{form.formState.errors.cpc.message}</p>}
          </FieldContent>
        </Field>
      </FieldGroup>
    </form>
  );
}

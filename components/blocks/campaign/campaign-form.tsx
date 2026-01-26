"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldContent, FieldGroup, FieldLabel } from "@/components/ui/field";
import { campaignFormSchema, type CampaignFormData } from "@/lib/schemas/campaign-schema";
import type { Campaign } from "@/lib/types/campaigns";
import { COUNTRIES } from "@/lib/constants/countries";

interface CampaignFormProps {
  defaultValues?: Campaign;
  onSubmit: (data: CampaignFormData) => void;
  isSubmitting?: boolean;
  partners?: Array<{ id: string; name: string }>;
}

export function CampaignForm({ defaultValues, onSubmit, isSubmitting, partners = [] }: CampaignFormProps) {
  const form = useForm<CampaignFormData>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: defaultValues
      ? {
          partner_id: defaultValues.partner_id,
          name: defaultValues.name,
          country: defaultValues.country,
          status: defaultValues.status,
        }
      : {
          partner_id: "",
          name: "",
          country: "",
          status: "active",
        },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} id="campaign-form">
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
          <FieldLabel>Campaign Name *</FieldLabel>
          <FieldContent>
            <Input {...form.register("name")} placeholder="Campaign name" disabled={isSubmitting} />
            {form.formState.errors.name && <p className="text-sm text-destructive mt-1">{form.formState.errors.name.message}</p>}
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Country *</FieldLabel>
          <FieldContent>
            <Select value={form.watch("country")} onValueChange={(value) => form.setValue("country", value)} disabled={isSubmitting}>
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(COUNTRIES).map(([code, name]) => (
                  <SelectItem key={code} value={code}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.country && <p className="text-sm text-destructive mt-1">{form.formState.errors.country.message}</p>}
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Status</FieldLabel>
          <FieldContent>
            <Select value={form.watch("status")} onValueChange={(value) => form.setValue("status", value as CampaignFormData["status"])} disabled={isSubmitting}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.status && <p className="text-sm text-destructive mt-1">{form.formState.errors.status.message}</p>}
          </FieldContent>
        </Field>
      </FieldGroup>
    </form>
  );
}

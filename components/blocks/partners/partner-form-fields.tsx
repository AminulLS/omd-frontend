"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import type { FormData, PartnerStatus, PartnerType } from "@/lib/types/partners";

interface PartnerFormFieldsProps {
  formData: FormData;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (field: keyof FormData, value: any) => void;
}

export function PartnerFormFields({ formData, onChange }: PartnerFormFieldsProps) {
  return (
    <>
      <Field>
        <FieldLabel>Name</FieldLabel>
        <FieldContent>
          <Input value={formData.name} onChange={(e) => onChange("name", e.target.value)} placeholder="Partner name" />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>Type</FieldLabel>
        <FieldContent>
          <Select value={formData.type} onValueChange={(value: PartnerType) => onChange("type", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="internal">Internal</SelectItem>
              <SelectItem value="external">External</SelectItem>
            </SelectContent>
          </Select>
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>Status</FieldLabel>
        <FieldContent>
          <Select value={formData.status} onValueChange={(value: PartnerStatus) => onChange("status", value)}>
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
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>Email</FieldLabel>
        <FieldContent>
          <Input type="email" value={formData.email} onChange={(e) => onChange("email", e.target.value)} placeholder="email@example.com" />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>Phone</FieldLabel>
        <FieldContent>
          <Input type="tel" value={formData.phone} onChange={(e) => onChange("phone", e.target.value)} placeholder="+1 (555) 000-0000" />
        </FieldContent>
      </Field>
    </>
  );
}

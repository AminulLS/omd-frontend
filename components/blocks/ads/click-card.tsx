"use client";

import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { AdFormData, AdPricingType } from "@/lib/types/ads";

interface AdClicksCardProps {
  register: UseFormRegister<AdFormData>;
  errors: FieldErrors<AdFormData>;
  watch: UseFormWatch<AdFormData>;
  setValue: UseFormSetValue<AdFormData>;
}

const pricingTypes = [
  { value: "cpc", label: "CPC (Cost Per Click)" },
  { value: "tcpa", label: "TCPA (Target CPA)" },
  { value: "cpa", label: "CPA (True CPA)" },
  { value: "rsoc", label: "RSOC (API Rev)" },
  { value: "auto", label: "Auto (Rev Event)" },
] as const;

export function AdClicksCard({ register, errors, watch, setValue }: AdClicksCardProps) {
  const pricingType = watch("pricing_type");
  const noClickTcpaAlg = watch("no_click_tcpa_alg");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Clicks</CardTitle>
        <CardDescription>Pricing, TCPA Algorithm, Duplicate Window</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Field>
              <FieldLabel>Pricing Type</FieldLabel>
              <FieldContent>
                <Select value={pricingType} onValueChange={(value: AdPricingType) => setValue("pricing_type", value, { shouldDirty: true })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {pricingTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.pricing_type && <p className="text-sm text-destructive mt-1">{errors.pricing_type.message}</p>}
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Conversion Window</FieldLabel>
              <FieldContent>
                <Input type="string" {...register("conversion_window")} placeholder="24" />
                <p className="text-xs text-muted-foreground mt-1">Hours to consider clicks as duplicates</p>
                {errors.duplicate_window && <p className="text-sm text-destructive mt-1">{errors.duplicate_window.message}</p>}
              </FieldContent>
            </Field>
          </div>

          <div className="space-y-4">
            <Field>
              <FieldLabel>No Click TCPA Algorithm</FieldLabel>
              <FieldContent>
                <div className="flex items-center gap-2">
                  <Switch checked={noClickTcpaAlg || false} onCheckedChange={(checked) => setValue("no_click_tcpa_alg", checked, { shouldDirty: true })} />
                  <span className="text-sm text-muted-foreground">{noClickTcpaAlg ? "Active" : "Not Active"}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Enable/disable TCPA algorithm for non-click conversions</p>
              </FieldContent>
            </Field>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

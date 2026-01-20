"use client";

import { UseFormRegister, UseFormWatch, UseFormSetValue, FieldErrors } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { AdFormData } from "@/lib/types/ads";

interface AdPrepopCardProps {
  register: UseFormRegister<AdFormData>;
  watch: UseFormWatch<AdFormData>;
  setValue: UseFormSetValue<AdFormData>;
  errors: FieldErrors<AdFormData>;
}

export function AdPrepopCard({ register, watch, setValue, errors }: AdPrepopCardProps) {
  const appendRegKey = watch("append_reg_key");
  const appendRegKeySsl = watch("append_reg_key_ssl");

  const hasAppendRegKey = !!appendRegKey;
  const hasAppendRegKeySsl = !!appendRegKeySsl;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prepop Data</CardTitle>
        <CardDescription>Hashed User Data, OpenSSL</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Field>
              <FieldLabel>Append Hashed User Data (OpenSSL)</FieldLabel>
              <FieldContent>
                <div className="flex items-center gap-2">
                  <Switch checked={hasAppendRegKey} onCheckedChange={(checked) => setValue("append_reg_key", checked ? "" : null, { shouldDirty: true })} />
                  <span className="text-sm text-muted-foreground">{hasAppendRegKey ? "Enabled" : "Disabled"}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Automatically append hashed user data to URLs</p>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Append Hashed User Data (SSL)</FieldLabel>
              <FieldContent>
                <div className="flex items-center gap-2">
                  <Switch checked={hasAppendRegKeySsl} onCheckedChange={(checked) => setValue("append_reg_key_ssl", checked ? "" : null, { shouldDirty: true })} />
                  <span className="text-sm text-muted-foreground">{hasAppendRegKeySsl ? "Enabled" : "Disabled"}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">SSL data hashing for user data</p>
              </FieldContent>
            </Field>
          </div>

          <div className="space-y-4">
            {hasAppendRegKey && (
              <Field>
                <FieldLabel>Hashed Key</FieldLabel>
                <FieldContent>
                  <Input {...register("append_reg_key")} placeholder="Enter hashed key" type="password" />
                  <p className="text-xs text-muted-foreground mt-1">OpenSSL key for hashing user data</p>
                  {errors.append_reg_key && <p className="text-sm text-destructive mt-1">{errors.append_reg_key.message}</p>}
                </FieldContent>
              </Field>
            )}

            {hasAppendRegKeySsl && (
              <Field>
                <FieldLabel>Hashed Key (SSL)</FieldLabel>
                <FieldContent>
                  <Input {...register("append_reg_key_ssl")} placeholder="Enter SSL hashed key" type="password" />
                  <p className="text-xs text-muted-foreground mt-1">SSL key for hashing user data</p>
                  {errors.append_reg_key_ssl && <p className="text-sm text-destructive mt-1">{errors.append_reg_key_ssl.message}</p>}
                </FieldContent>
              </Field>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

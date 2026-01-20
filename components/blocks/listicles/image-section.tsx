"use client";

import { UseFormRegister, FieldErrors, UseFormWatch } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ImageIcon } from "lucide-react";
import type { ListicleFormData } from "@/lib/types/listicles";

interface ListicleImageCardProps {
  register: UseFormRegister<ListicleFormData>;
  errors: FieldErrors<ListicleFormData>;
  watch: UseFormWatch<ListicleFormData>;
}

export function ListicleImageCard({ register, errors, watch }: ListicleImageCardProps) {
  const watchedImage = watch("image");
  const watchedImageAlt = watch("image_alt");
  const watchedTitle = watch("title");

  return (
    <Card className="w-full space-y-4">
      <CardHeader>
        <CardTitle>Image</CardTitle>
        <CardDescription>Featured image and metadata</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Field>
          <FieldLabel>Image URL *</FieldLabel>
          <FieldContent>
            <div className="space-y-3">
              {watchedImage ? (
                <div className="relative overflow-hidden border bg-muted rounded">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={watchedImage} alt={watchedImageAlt || watchedTitle || "Listicle image"} className="" />
                </div>
              ) : (
                <div className="aspect-video border-2 border-dashed rounded flex flex-col items-center justify-center text-muted-foreground">
                  <ImageIcon className="size-8 mb-2" />
                  <span className="text-sm">No image selected</span>
                </div>
              )}
              <Input {...register("image")} placeholder="https://example.com/image.jpg" className="font-mono text-xs" />
              {errors.image && <p className="text-sm text-destructive mt-1">{errors.image.message}</p>}
            </div>
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Alt Text</FieldLabel>
          <FieldContent>
            <Input {...register("image_alt")} placeholder="Image alt text for accessibility" />
            {errors.image_alt && <p className="text-sm text-destructive mt-1">{errors.image_alt.message}</p>}
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Caption</FieldLabel>
          <FieldContent>
            <Input {...register("image_caption")} placeholder="Image caption" />
            {errors.image_caption && <p className="text-sm text-destructive mt-1">{errors.image_caption.message}</p>}
          </FieldContent>
        </Field>
      </CardContent>
    </Card>
  );
}

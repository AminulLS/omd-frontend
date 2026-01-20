import { z } from "zod";

export const listicleFormSchema = z.object({
  contents: z.array(z.string()),
  blurs: z.array(z.string()),
  copy: z.string().min(1, "Copy is required"),
  design_type: z.enum(["style1", "style2"]),
  image: z
    .union([z.string().url("Invalid image URL"), z.literal(""), z.null()])
    .optional()
    .transform((val) => (val === "" ? null : val)),
  image_alt: z.string().nullable().optional(),
  image_caption: z.string().nullable().optional(),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(255, "Slug is too long")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  title: z.string().min(1, "Title is required").max(255, "Title is too long"),
});

export type ListicleFormData = z.infer<typeof listicleFormSchema>;

import { z } from "zod";

export const syndicateFormSchema = z.object({
  partner_id: z.string().min(1, "Partner is required"),
  type: z.enum(["external", "internal"]),
  status: z.enum(["active", "inactive"]),
  key: z
    .string()
    .min(1, "Key is required")
    .max(255, "Key is too long")
    .regex(/^[A-Z0-9-]+$/, "Key must contain only uppercase letters, numbers, and hyphens"),
  name: z.string().min(3, "Name must be at least 3 characters").max(255, "Name is too long"),
  content: z.string().min(1, "Content is required"),
  redirect_url: z
    .union([z.string().url("Invalid redirect URL"), z.literal(""), z.null()])
    .transform((val) => (val === "" ? null : val))
    .nullable(),
  split: z.union([z.number().min(0).max(100, "Split must be between 0 and 100"), z.null()]).nullable(),
  cpc: z.union([z.number().min(0, "CPC must be positive"), z.null()]).nullable(),
});

export type SyndicateFormData = z.infer<typeof syndicateFormSchema>;

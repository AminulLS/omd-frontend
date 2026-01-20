import { z } from "zod";

export const roleFormSchema = z.object({
  key: z
    .string()
    .min(1, "Key is required")
    .max(255, "Key is too long")
    .regex(/^[a-z0-9_-]+$/, "Key must contain only lowercase letters, numbers, underscores, and hyphens"),
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  description: z.string().max(500, "Description is too long").nullable().optional(),
  abilities: z.array(z.string()).min(1, "At least one ability is required"),
});

export type RoleFormData = z.infer<typeof roleFormSchema>;

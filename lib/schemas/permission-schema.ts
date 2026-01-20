import { z } from "zod";

export const permissionFormSchema = z.object({
  key: z
    .string()
    .min(1, "Key is required")
    .max(255, "Key is too long")
    .regex(/^[a-z0-9_:]+$/, "Key must contain only lowercase letters, numbers, underscores, and colons"),
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  group: z.string().min(1, "Group is required").max(255, "Group is too long"),
  description: z.string().max(500, "Description is too long").nullable().optional(),
});

export type PermissionFormData = z.infer<typeof permissionFormSchema>;

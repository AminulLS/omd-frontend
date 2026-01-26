import { z } from "zod";

export const userCreateSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  email: z.string().email("Invalid email address").max(255, "Email is too long"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  status: z.enum(["active", "inactive", "suspended", "banned"]),
  type: z.enum(["admin", "partner"]),
  roles: z.array(z.string()).min(1, "At least one role is required"),
});

export const userUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  email: z.string().email("Invalid email address").max(255, "Email is too long"),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
  status: z.enum(["active", "inactive", "suspended", "banned"]),
  type: z.enum(["admin", "partner"]),
  roles: z.array(z.string()).min(1, "At least one role is required"),
});

export type UserCreateFormData = z.infer<typeof userCreateSchema>;
export type UserUpdateFormData = z.infer<typeof userUpdateSchema>;

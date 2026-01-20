import { z } from "zod";

export const partnerFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(255, "Name is too long"),
  email: z.string().email("Invalid email address").max(255, "Email is too long"),
  phone: z.string().min(10, "Phone must be at least 10 characters").max(20, "Phone is too long"),
  website: z.string().url("Invalid website URL").max(255, "Website URL is too long"),
  type: z.enum(["internal", "external"]),
  status: z.enum(["active", "inactive", "pending", "suspended"]),
});

export type PartnerFormData = z.infer<typeof partnerFormSchema>;

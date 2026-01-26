import { z } from "zod";

export const campaignFormSchema = z.object({
  partner_id: z.string().min(1, "Partner is required"),
  name: z.string().min(3, "Name must be at least 3 characters").max(255, "Name is too long"),
  country: z.string().length(2, "Country code must be 2 characters (e.g., US, DE, FR)"),
  status: z.enum(["active", "inactive", "paused"]),
});

export type CampaignFormData = z.infer<typeof campaignFormSchema>;

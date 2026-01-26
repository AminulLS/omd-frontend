import { z } from "zod";

export const xmlFormSchema = z.object({
  partner_id: z.string().min(1, "Partner is required"),
  name: z.string().min(3, "Name must be at least 3 characters").max(255, "Name is too long"),
  country: z.string().length(2, "Country code must be 2 characters (e.g., US, DE, FR)"),
  status: z.enum(["active", "paused"]),
  xml_feed_url: z.string().url("Invalid XML feed URL").max(255, "URL is too long"),
});

export type XmlFormData = z.infer<typeof xmlFormSchema>;

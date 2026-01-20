import { z } from "zod";

const filterSchema = z.object({
  key: z.string(),
  op: z.enum(["eq", "neq", "in", "nin", "gt", "lt", "gte", "lte"]),
  value: z.union([z.string(), z.number(), z.boolean(), z.array(z.string()), z.array(z.number())]),
});

// Some Previous data still have meta as array.
const metaSchema = z
  .union([
    z
      .object({
        company_name: z.string().optional().nullable(),
        progress_button: z.tuple([z.string(), z.null()]).optional().nullable(),
        skip_button: z.string().optional().nullable(),
        show_image: z.enum(["yes", "no"]).optional().nullable(),
        show_copy: z.enum(["yes", "no"]).optional().nullable(),
        disclaimer: z.string().optional().nullable(),
      })
      .catchall(z.any()),
    z.array(z.any()),
  ])
  .transform((val) => (Array.isArray(val) ? {} : val));

const scheduleSchema = z.object({
  type: z.enum(["default", "custom"]),
  active: z.boolean(),
  start: z.number().min(0).max(86400),
  stop: z.number().min(0).max(86400),
  cpc: z.number().nullable().optional(),
  spend: z.number().nullable().optional(),
  balance: z.number().nullable().optional(),
});

const schedulesSchema = z
  .object({
    Default: z.array(scheduleSchema).optional(),
    Monday: z.array(scheduleSchema).optional(),
    Tuesday: z.array(scheduleSchema).optional(),
    Wednesday: z.array(scheduleSchema).optional(),
    Thursday: z.array(scheduleSchema).optional(),
    Friday: z.array(scheduleSchema).optional(),
    Saturday: z.array(scheduleSchema).optional(),
    Sunday: z.array(scheduleSchema).optional(),
  })
  .optional();

export const adFormSchema = z.object({
  partner_id: z.string().min(1, "Partner is required"),
  copy: z.string().min(1, "Copy is required"),
  nickname: z.string().min(1, "Nickname is required").max(255, "Nickname is too long"),
  title: z.string().min(1, "Title is required").max(255, "Title is too long"),
  public_nickname: z.string().min(1, "Public nickname is required").max(255, "Public nickname is too long"),
  image_url: z.string().url("Invalid image URL").nullable().optional(),
  image_priority: z.enum(["high", "low", "any"]),
  placement: z.enum(["path", "serp-all", "serp_offer", "back_button", "offer_1", "offer_2", "offer_3", "offer_4", "offer_5", "offer_6", "offer_7", "medicare", "health", "blur", "listical"]),
  pricing_type: z.enum(["cpc", "cpa", "tcpa", "rsoc", "auto"]),
  pricing_type_value: z.string().nullable().optional(),
  original_url: z.string().url("Invalid original URL").optional(),
  append_reg_key: z.string().nullable().optional(),
  append_reg_key_ssl: z.string().nullable().optional(),
  status: z.enum(["active", "paused", "pending", "rejected"]),
  gtm_tracking: z.string().optional(),
  conversion_window: z.string().nullable().optional(),
  newalg: z.enum(["yes", "no"]).nullable().optional(),
  notes: z.string().nullable().optional(),
  category: z.string().min(1, "Category is required"),
  country: z.string().length(2, "Country code must be 2 characters"),
  boards: z.array(z.string()),
  filters: z.array(filterSchema),
  meta: metaSchema,
  schedules: schedulesSchema,
  prepop: z.string().nullable().optional(),
  target_cpa: z.number().nullable().optional(),
  org_url: z.string().url("Invalid org URL").optional(),
  duplicate_window: z.number().min(0).optional().nullable(),
  no_click_tcpa_alg: z.boolean().optional().nullable(),
});

export type FilterFormData = z.infer<typeof filterSchema>;
export type MetaFormData = z.infer<typeof metaSchema>;
export type ScheduleFormData = z.infer<typeof scheduleSchema>;
export type SchedulesFormData = z.infer<typeof schedulesSchema>;
export type AdFormData = z.infer<typeof adFormSchema>;

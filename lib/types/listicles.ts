import type { Ad } from "./ads";

export type ListicleDesignType = "style1" | "style2";

export interface Listicle {
  id: string;
  copy: string;
  design_type: ListicleDesignType;
  image: string | null;
  image_alt: string | null;
  image_caption: string | null;
  slug: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ListicleWithAds extends Listicle {
  contents?: Ad[];
  blurs?: Ad[];
}

export interface ListicleFormData {
  contents: string[];
  blurs: string[];
  copy: string;
  design_type: ListicleDesignType;
  image?: string | null;
  image_alt?: string | null;
  image_caption?: string | null;
  slug: string;
  title: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
    links: Array<{
      url: string | null;
      label: string;
      page: number | null;
      active: boolean;
    }>;
    path: string;
  };
  enums?: Record<string, Record<string, EnumValue>>;
}

export interface EnumValue {
  code: string;
  name: string;
  label: string;
  colo: string;
  icon: string;
}

export interface ListicleResponse {
  data: Listicle | ListicleWithAds;
}

export const designTypeVariantMap: Record<ListicleDesignType, "default" | "secondary"> = {
  style1: "default",
  style2: "secondary",
};

export const designTypeLabelMap: Record<ListicleDesignType, string> = {
  style1: "Style 1",
  style2: "Style 2",
};

export function isListicleWithAds(listicle: Listicle | ListicleWithAds): listicle is ListicleWithAds {
  return "contents" in listicle && "blurs" in listicle;
}

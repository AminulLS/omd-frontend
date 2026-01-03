export type PlacementSlug =
  | 'redirect'
  | 'serp-top'
  | 'return'
  | 'external-sms'
  | 'serp-mid'
  | 'serp-bottom'
  | 'bb'
  | 'flow'
  | 'return-2'
  | 'path'
  | 'flow-2'
  | 'pec'
  | 'pec-return'
  | 'offer-1'
  | 'serp'
  | 'pec-2'
  | 'pec-return-2'
  | 'serp-all'
  | 'internal-sms'
  | 'external-nonbillable-sms'
  | 'sponsored-serp'
  | 'sponsored-bb'
  | 'serp-large'
  | 'offer-2'
  | 'offer-3'
  | 'offer-4'
  | 'serp-offer'
  | 'offer-6'
  | 'offer-5'
  | 'offer-7'
  | 'medicare'
  | 'blur'
  | 'listical'
  | 'internal-email'

export type Placement = {
  label: string
  slug: PlacementSlug
}

export const PLACEMENTS: readonly Placement[] = [
  { label: 'Redirect', slug: 'redirect' },
  { label: 'SERP Top', slug: 'serp-top' },
  { label: 'Return', slug: 'return' },
  { label: 'External SMS', slug: 'external-sms' },
  { label: 'SERP Middle', slug: 'serp-mid' },
  { label: 'SERP Bottom', slug: 'serp-bottom' },
  { label: 'BB', slug: 'bb' },
  { label: 'Flow', slug: 'flow' },
  { label: 'Return 2', slug: 'return-2' },
  { label: 'Path', slug: 'path' },
  { label: 'Flow 2', slug: 'flow-2' },
  { label: 'PEC', slug: 'pec' },
  { label: 'PEC Return', slug: 'pec-return' },
  { label: 'Offer 1', slug: 'offer-1' },
  { label: 'SERP', slug: 'serp' },
  { label: 'PEC 2', slug: 'pec-2' },
  { label: 'PEC Return 2', slug: 'pec-return-2' },
  { label: 'SERP All', slug: 'serp-all' },
  { label: 'Internal SMS', slug: 'internal-sms' },
  { label: 'External Non-Billable SMS', slug: 'external-nonbillable-sms' },
  { label: 'Sponsored SERP', slug: 'sponsored-serp' },
  { label: 'Sponsored BB', slug: 'sponsored-bb' },
  { label: 'SERP Large', slug: 'serp-large' },
  { label: 'Offer 2', slug: 'offer-2' },
  { label: 'Offer 3', slug: 'offer-3' },
  { label: 'Offer 4', slug: 'offer-4' },
  { label: 'SERP Offer', slug: 'serp-offer' },
  { label: 'Offer 6', slug: 'offer-6' },
  { label: 'Offer 5', slug: 'offer-5' },
  { label: 'Offer 7', slug: 'offer-7' },
  { label: 'Medicare', slug: 'medicare' },
  { label: 'Blur', slug: 'blur' },
  { label: 'Listical', slug: 'listical' },
  { label: 'Internal email', slug: 'internal-email' },
] as const

// Helper function to get placement label by slug
export function getPlacementLabel(slug: PlacementSlug): string {
  const placement = PLACEMENTS.find((p) => p.slug === slug)
  return placement?.label || slug
}

// Helper function to get placement slug by label
export function getPlacementSlug(label: string): PlacementSlug | undefined {
  const placement = PLACEMENTS.find((p) => p.label === label)
  return placement?.slug
}

// Create a map for easy lookup
export const PLACEMENT_MAP: Record<PlacementSlug, string> = PLACEMENTS.reduce(
  (acc, placement) => {
    acc[placement.slug] = placement.label
    return acc
  },
  {} as Record<PlacementSlug, string>
)

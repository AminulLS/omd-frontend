import { redirect, notFound } from 'next/navigation'

type ProductType = 'sponsored-ads' | 'xml-direct-listing' | 'publisher' | 'syndication'

type Partner = {
  id: string
  name: string
  products: ProductType[]
}

// Mock partner data - in a real app, this would come from an API based on the ID
const partnersData: Record<string, Partner> = {
  '1': {
    id: '1',
    name: 'TechGlobal Inc.',
    products: ['sponsored-ads', 'xml-direct-listing'],
  },
  '2': {
    id: '2',
    name: 'MediaFlow Partners',
    products: ['publisher', 'syndication'],
  },
  '3': {
    id: '3',
    name: 'AdNetwork Pro',
    products: ['sponsored-ads', 'xml-direct-listing', 'publisher', 'syndication'],
  },
  '4': {
    id: '4',
    name: 'Digital Reach Ltd.',
    products: ['sponsored-ads'],
  },
  '5': {
    id: '5',
    name: 'PublisherHub',
    products: ['publisher', 'syndication'],
  },
  '6': {
    id: '6',
    name: 'Internal Media Team',
    products: ['xml-direct-listing', 'syndication'],
  },
  '7': {
    id: '7',
    name: 'Global Ads Media',
    products: ['sponsored-ads', 'xml-direct-listing'],
  },
  '8': {
    id: '8',
    name: 'ContentStream AI',
    products: ['publisher', 'syndication', 'xml-direct-listing'],
  },
}

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function PartnerDetailsPage({ params }: PageProps) {
  const { id } = await params
  const partner = partnersData[id]

  if (!partner || partner.products.length === 0) {
    notFound()
  }

  // Redirect to the first product
  redirect(`/dashboard/partners/${id}/${partner.products[0]}`)
}
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { HourlyChart } from '@/components/blocks/dashboard/hourly-chart'
import SnapshotTable from '@/components/blocks/dashboard/snapshot-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

type PartnerStatus = 'active' | 'inactive' | 'pending' | 'suspended'
type PartnerType = 'internal' | 'external'

type ProductType = 'sponsored_ads' | 'xml_direct_listing' | 'publisher' | 'syndication'

type Partner = {
  id: string
  name: string
  type: PartnerType
  status: PartnerStatus
  email: string
  phone: string
  created_at: string
  number_users: number
  products: ProductType[]
}

// Mock partner data - in a real app, this would come from an API based on the ID
const partnersData: Record<string, Partner> = {
  '1': {
    id: '1',
    name: 'TechGlobal Inc.',
    type: 'external',
    status: 'active',
    email: 'contact@techglobal.com',
    phone: '+1 (555) 123-4567',
    created_at: '2024-01-15',
    number_users: 1240,
    products: ['sponsored_ads', 'xml_direct_listing'],
  },
  '2': {
    id: '2',
    name: 'MediaFlow Partners',
    type: 'external',
    status: 'active',
    email: 'partners@mediaflow.io',
    phone: '+1 (555) 234-5678',
    created_at: '2024-02-20',
    number_users: 856,
    products: ['publisher', 'syndication'],
  },
  '3': {
    id: '3',
    name: 'AdNetwork Pro',
    type: 'external',
    status: 'active',
    email: 'info@adnetworkpro.com',
    phone: '+1 (555) 345-6789',
    created_at: '2024-03-10',
    number_users: 2341,
    products: ['sponsored_ads', 'xml_direct_listing', 'publisher', 'syndication'],
  },
  '4': {
    id: '4',
    name: 'Digital Reach Ltd.',
    type: 'external',
    status: 'pending',
    email: 'hello@digitalreach.co',
    phone: '+1 (555) 456-7890',
    created_at: '2024-06-05',
    number_users: 0,
    products: ['sponsored_ads'],
  },
  '5': {
    id: '5',
    name: 'PublisherHub',
    type: 'external',
    status: 'inactive',
    email: 'team@publisherhub.net',
    phone: '+1 (555) 567-8901',
    created_at: '2023-11-28',
    number_users: 423,
    products: ['publisher', 'syndication'],
  },
  '6': {
    id: '6',
    name: 'Internal Media Team',
    type: 'internal',
    status: 'active',
    email: 'team@internal.company',
    phone: '+1 (555) 678-9012',
    created_at: '2024-04-12',
    number_users: 1567,
    products: ['xml_direct_listing', 'syndication'],
  },
  '7': {
    id: '7',
    name: 'Global Ads Media',
    type: 'external',
    status: 'suspended',
    email: 'support@globaladsmedia.com',
    phone: '+1 (555) 789-0123',
    created_at: '2023-12-01',
    number_users: 89,
    products: ['sponsored_ads', 'xml_direct_listing'],
  },
  '8': {
    id: '8',
    name: 'ContentStream AI',
    type: 'external',
    status: 'active',
    email: 'business@contentstream.ai',
    phone: '+1 (555) 890-1234',
    created_at: '2024-05-18',
    number_users: 678,
    products: ['publisher', 'syndication', 'xml_direct_listing'],
  },
}

const data = (hours = 24) => {
    return [...Array(hours)].map((_, h) => {
        const format = (h: number) => `${h % 12 || 12}${h < 12 ? 'am' : 'pm'}`
        return {
            key: format(h),
            fields: {
                today_revenue: Math.floor(Math.random() * 1000) + 200,
                today_clicks: Math.floor(Math.random() * 1000) + 200,
                yesterday_revenue: Math.floor(Math.random() * 1000) + 200,
                yesterday_clicks: Math.floor(Math.random() * 1000) + 200,
                sdlw_revenue: Math.floor(Math.random() * 1000) + 200,
                sdlw_clicks: Math.floor(Math.random() * 1000) + 200,
            },
        }
    })
}

const config = {
    today_revenue: {
        color: '#F96E5B',
        label: 'Today Revenue',
    },
    today_clicks: {
        color: '#FFE2AF',
        label: 'Today Clicks',
    },
    yesterday_revenue: {
        color: '#79C9C5',
        label: 'Yesterday Revenue',
    },
    yesterday_clicks: {
        color: '#3F9AE',
        label: 'Yesterday Clicks',
    },
    sdlw_revenue: {
        color: '#BDE8F5',
        label: 'SDLW Revenue',
    },
    sdlw_clicks: {
        color: '#4988C4',
        label: 'SDLW Clicks',
    },
}

const snapshotData = {
    today: {
        revenue: '26,070.66',
        clicks: '72,955',
        cpc: '0.357',
        cbh: '72,955Total',
        total_revenue: '26,070.66',
    },
    yesterday: {
        revenue: '26,070.66',
        clicks: '72,955',
        cpc: '0.357',
        cbh: '72,955Total',
        total_revenue: '26,070.66',
    },
    sdlw: {
        revenue: '26,070.66',
        clicks: '72,955',
        cpc: '0.357',
        cbh: '72,955Total',
        total_revenue: '26,070.66',
    },
}

const statusVariantMap: Record<PartnerStatus, "default" | "secondary" | "destructive" | "outline"> = {
  active: 'default',
  inactive: 'secondary',
  pending: 'outline',
  suspended: 'destructive',
}

const typeVariantMap: Record<PartnerType, "default" | "secondary" | "outline"> = {
  internal: 'secondary',
  external: 'outline',
}

const productLabelMap: Record<ProductType, string> = {
  sponsored_ads: 'Sponsored Ads',
  xml_direct_listing: 'XML Direct',
  publisher: 'Publisher',
  syndication: 'Syndication',
}

const typeLabelMap: Record<PartnerType, string> = {
  internal: 'Internal',
  external: 'External',
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function PartnerDetailsPage({ params }: PageProps) {
  const { id } = await params
  const partner = partnersData[id]

  if (!partner) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12">
        <h2 className="text-2xl font-semibold">Partner Not Found</h2>
        <p className="text-muted-foreground">The partner you're looking for doesn't exist.</p>
        <Button asChild variant="outline">
          <Link href="/dashboard/partners">
            <ArrowLeft className="mr-2 size-4" />
            Back to Partners
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-y-4">
      {/* Partner Info Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" size="icon">
                <Link href="/dashboard/partners">
                  <ArrowLeft className="size-4" />
                </Link>
              </Button>
              <div>
                <CardTitle className="flex items-center gap-3">
                  {partner.name}
                  <Badge variant={typeVariantMap[partner.type]}>
                    {typeLabelMap[partner.type]}
                  </Badge>
                  <Badge variant={statusVariantMap[partner.status]}>
                    {partner.status.charAt(0).toUpperCase() + partner.status.slice(1)}
                  </Badge>
                </CardTitle>
                <CardDescription className="mt-2">
                  {partner.email} • {partner.phone} • {partner.number_users.toLocaleString()} users • Created {formatDate(partner.created_at)}
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {partner.products.map((product) => (
                <Badge key={product} variant="outline">
                  {productLabelMap[product]}
                </Badge>
              ))}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Sections */}
      {partner.products.includes('sponsored_ads') && (
        <Card>
          <CardHeader>
            <CardTitle>Sponsored Ads</CardTitle>
            <CardDescription>Ad Revenue / Clicks By Hours</CardDescription>
          </CardHeader>
          <div className="flex gap-2">
            <div className="w-4/6">
              <HourlyChart data={data()} config={config} />
            </div>
            <div className="w-2/6">
              <SnapshotTable data={snapshotData} />
            </div>
          </div>
        </Card>
      )}

      {partner.products.includes('publisher') && (
        <Card>
          <CardHeader>
            <CardTitle>Traffic Publisher</CardTitle>
            <CardDescription>Ad Revenue / Clicks By Hours</CardDescription>
          </CardHeader>
          <div className="flex gap-2">
            <div className="w-4/6">
              <HourlyChart data={data()} config={config} />
            </div>
            <div className="w-2/6">
              <SnapshotTable data={snapshotData} />
            </div>
          </div>
        </Card>
      )}

      {partner.products.includes('xml_direct_listing') && (
        <Card>
          <CardHeader>
            <CardTitle>XML Direct Listings</CardTitle>
            <CardDescription>Ad Revenue / Clicks By Hours</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <div className="w-4/6">
              <HourlyChart data={data()} config={config} />
            </div>
            <div className="w-2/6">
              <SnapshotTable data={snapshotData} />
            </div>
          </CardContent>
        </Card>
      )}

      {partner.products.includes('syndication') && (
        <Card>
          <CardHeader>
            <CardTitle>Syndication</CardTitle>
            <CardDescription>Ad Revenue / Clicks By Hours</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <div className="w-4/6">
              <HourlyChart data={data()} config={config} />
            </div>
            <div className="w-2/6">
              <SnapshotTable data={snapshotData} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

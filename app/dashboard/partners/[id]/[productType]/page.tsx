"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { HourlyChart } from '@/components/blocks/dashboard/hourly-chart'
import SnapshotTable from '@/components/blocks/dashboard/snapshot-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Field, FieldGroup, FieldLabel, FieldContent } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { ArrowLeft, EditIcon, UserIcon, TrashIcon, SearchIcon } from 'lucide-react'
import Link from 'next/link'
import { useState, use } from 'react'
import { TabNavigation } from '@/components/dashboard/tab-navigation'
import { notFound } from 'next/navigation'

type PartnerStatus = 'active' | 'inactive' | 'pending' | 'suspended'
type PartnerType = 'internal' | 'external'

type ProductType = 'sponsored-ads' | 'xml-direct-listing' | 'publisher' | 'syndication'

type UserRole = 'main_user' | 'manager'

type User = {
  id: string
  name: string
  email: string
  role: UserRole
}

type Partner = {
  id: string
  name: string
  type: PartnerType
  status: PartnerStatus
  email: string
  phone: string
  created_at: string
  users: User[]
  products: ProductType[]
}

// Predefined list of users available to be assigned to partners
const availableUsers: User[] = [
  { id: 'u1', name: 'John Smith', email: 'john@company.com', role: 'main_user' },
  { id: 'u2', name: 'Sarah Johnson', email: 'sarah@company.com', role: 'main_user' },
  { id: 'u3', name: 'Mike Chen', email: 'mike@company.com', role: 'main_user' },
  { id: 'u4', name: 'Lisa Park', email: 'lisa@company.com', role: 'main_user' },
  { id: 'u5', name: 'Tom Wilson', email: 'tom@company.com', role: 'main_user' },
  { id: 'u6', name: 'Emily Davis', email: 'emily@company.com', role: 'manager' },
  { id: 'u7', name: 'Alex Brown', email: 'alex@company.com', role: 'manager' },
  { id: 'u8', name: 'Jessica Lee', email: 'jessica@company.com', role: 'manager' },
  { id: 'u9', name: 'David Kim', email: 'david@company.com', role: 'manager' },
  { id: 'u10', name: 'Rachel Green', email: 'rachel@company.com', role: 'manager' },
]

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
    users: [{ ...availableUsers[0], role: 'main_user' }, { ...availableUsers[5], role: 'manager' }],
    products: ['sponsored-ads', 'xml-direct-listing'],
  },
  '2': {
    id: '2',
    name: 'MediaFlow Partners',
    type: 'external',
    status: 'active',
    email: 'partners@mediaflow.io',
    phone: '+1 (555) 234-5678',
    created_at: '2024-02-20',
    users: [{ ...availableUsers[1], role: 'main_user' }, { ...availableUsers[6], role: 'manager' }],
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
    users: [{ ...availableUsers[2], role: 'main_user' }, { ...availableUsers[7], role: 'manager' }, { ...availableUsers[8], role: 'manager' }],
    products: ['sponsored-ads', 'xml-direct-listing', 'publisher', 'syndication'],
  },
  '4': {
    id: '4',
    name: 'Digital Reach Ltd.',
    type: 'external',
    status: 'pending',
    email: 'hello@digitalreach.co',
    phone: '+1 (555) 456-7890',
    created_at: '2024-06-05',
    users: [],
    products: ['sponsored-ads'],
  },
  '5': {
    id: '5',
    name: 'PublisherHub',
    type: 'external',
    status: 'inactive',
    email: 'team@publisherhub.net',
    phone: '+1 (555) 567-8901',
    created_at: '2023-11-28',
    users: [],
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
    users: [],
    products: ['xml-direct-listing', 'syndication'],
  },
  '7': {
    id: '7',
    name: 'Global Ads Media',
    type: 'external',
    status: 'suspended',
    email: 'support@globaladsmedia.com',
    phone: '+1 (555) 789-0123',
    created_at: '2023-12-01',
    users: [],
    products: ['sponsored-ads', 'xml-direct-listing'],
  },
  '8': {
    id: '8',
    name: 'ContentStream AI',
    type: 'external',
    status: 'active',
    email: 'business@contentstream.ai',
    phone: '+1 (555) 890-1234',
    created_at: '2024-05-18',
    users: [],
    products: ['publisher', 'syndication', 'xml-direct-listing'],
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
    cbh: '72,955',
    total_revenue: '26,070.66',
  },
  yesterday: {
    revenue: '26,070.66',
    clicks: '72,955',
    cpc: '0.357',
    cbh: '72,955',
    total_revenue: '26,070.66',
  },
  sdlw: {
    revenue: '26,070.66',
    clicks: '72,955',
    cpc: '0.357',
    cbh: '72,955',
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
  'sponsored-ads': 'Sponsored Ads',
  'xml-direct-listing': 'XML Direct',
  'publisher': 'Publisher',
  'syndication': 'Syndication',
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

type FormData = {
  name: string
  type: PartnerType
  status: PartnerStatus
  email: string
  phone: string
  users: User[]
  products: ProductType[]
}

interface PageProps {
  params: Promise<{
    id: string
    productType: ProductType
  }>
}

export default function PartnerProductPage({ params }: PageProps) {
  const { id, productType } = use(params)
  const partner = partnersData[id]

  const [sheetOpen, setSheetOpen] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: partner?.name || '',
    type: partner?.type || 'external',
    status: partner?.status || 'active',
    email: partner?.email || '',
    phone: partner?.phone || '',
    users: partner?.users || [],
    products: partner?.products || [],
  })
  const [userSearchQuery, setUserSearchQuery] = useState('')

  if (!partner) {
    notFound()
  }

  // Validate product type
  if (!partner.products.includes(productType)) {
    notFound()
  }

  const tabs = partner.products.map((product) => ({
    value: product,
    label: productLabelMap[product],
    href: `/dashboard/partners/${id}/${product}`,
  }))

  const productTitle = {
    'sponsored-ads': 'Sponsored Ads',
    'xml-direct-listing': 'XML Direct Listings',
    'publisher': 'Traffic Publisher',
    'syndication': 'Syndication',
  }[productType]

  const handleEdit = () => {
    setFormData({
      name: partner.name,
      type: partner.type,
      status: partner.status,
      email: partner.email,
      phone: partner.phone,
      users: partner.users,
      products: partner.products,
    })
    setSheetOpen(true)
  }

  const handleSubmit = () => {
    // In a real app, this would make an API call to update the partner
    console.log('Updating partner:', formData)
    setSheetOpen(false)
  }

  const toggleProduct = (product: ProductType) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.includes(product)
        ? prev.products.filter(p => p !== product)
        : [...prev.products, product],
    }))
  }

  const addUser = (userId: string) => {
    const selectedUser = availableUsers.find(u => u.id === userId)
    if (!selectedUser) return

    // Check if user is already added
    if (formData.users.some(u => u.id === userId)) return

    const defaultRole: UserRole = formData.users.length === 0 ? 'main_user' : 'manager'
    const newUser: User = {
      ...selectedUser,
      role: defaultRole,
    }
    setFormData(prev => ({
      ...prev,
      users: [...prev.users, newUser],
    }))
  }

  const getAvailableUsersToAdd = () => {
    const assignedUserIds = formData.users.map(u => u.id)
    return availableUsers.filter(u => !assignedUserIds.includes(u.id))
  }

  const removeUser = (userId: string) => {
    setFormData(prev => ({
      ...prev,
      users: prev.users.filter(u => u.id !== userId),
    }))
  }

  const updateUser = (userId: string, field: keyof User, value: string) => {
    setFormData(prev => ({
      ...prev,
      users: prev.users.map(u =>
        u.id === userId ? { ...u, [field]: value } : u
      ),
    }))
  }

  const getMainUser = (users: User[]) => {
    return users.find(u => u.role === 'main_user')
  }

  const getManagerCount = (users: User[]) => {
    return users.filter(u => u.role === 'manager').length
  }

  return (
    <div className="flex flex-col gap-y-4">
      {/* Partner Info Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" size="icon">
                <Link href={`/dashboard/partners/${id}`}>
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
                  {partner.email} • {partner.phone} • {partner.users.length > 0 ? (
                    <span>
                      {getMainUser(partner.users)?.name}
                      {getManagerCount(partner.users) > 0 && ` +${getManagerCount(partner.users)} manager${getManagerCount(partner.users) > 1 ? 's' : ''}`}
                    </span>
                  ) : (
                    <span>No users</span>
                  )} • Created {formatDate(partner.created_at)}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-2 flex-wrap">
                {partner.products.map((product) => (
                  <Badge key={product} variant="outline">
                    {productLabelMap[product]}
                  </Badge>
                ))}
              </div>
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                  <Button size="sm" onClick={handleEdit}>
                    <EditIcon className="size-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:max-w-md">
                  <SheetHeader>
                    <SheetTitle>Edit Partner</SheetTitle>
                    <SheetDescription>
                      Update partner information below.
                    </SheetDescription>
                  </SheetHeader>
                  <FieldGroup className="mt-4 px-4">
                    <Field>
                      <FieldLabel>Name</FieldLabel>
                      <FieldContent>
                        <Input
                          value={formData.name}
                          onChange={e => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Partner name"
                        />
                      </FieldContent>
                    </Field>

                    <Field>
                      <FieldLabel>Type</FieldLabel>
                      <FieldContent>
                        <Select
                          value={formData.type}
                          onValueChange={(value: PartnerType) => setFormData({ ...formData, type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="internal">Internal</SelectItem>
                            <SelectItem value="external">External</SelectItem>
                          </SelectContent>
                        </Select>
                      </FieldContent>
                    </Field>

                    <Field>
                      <FieldLabel>Status</FieldLabel>
                      <FieldContent>
                        <Select
                          value={formData.status}
                          onValueChange={(value: PartnerStatus) => setFormData({ ...formData, status: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="suspended">Suspended</SelectItem>
                          </SelectContent>
                        </Select>
                      </FieldContent>
                    </Field>

                    <Field>
                      <FieldLabel>Email</FieldLabel>
                      <FieldContent>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={e => setFormData({ ...formData, email: e.target.value })}
                          placeholder="email@example.com"
                        />
                      </FieldContent>
                    </Field>

                    <Field>
                      <FieldLabel>Phone</FieldLabel>
                      <FieldContent>
                        <Input
                          type="tel"
                          value={formData.phone}
                          onChange={e => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+1 (555) 000-0000"
                        />
                      </FieldContent>
                    </Field>

                    <Field>
                      <FieldLabel>Users</FieldLabel>
                      <FieldContent>
                        <div className="space-y-2">
                          {formData.users.length === 0 ? (
                            <div className="text-sm text-muted-foreground p-3 border rounded-md border-dashed flex items-center justify-center gap-2">
                              <UserIcon className="size-4" />
                              No users added yet
                            </div>
                          ) : (
                            formData.users.map((user) => (
                              <div key={user.id} className="flex items-center gap-2 p-3 border rounded-md bg-muted/20">
                                <div className="flex-1">
                                  <div className="font-medium text-sm">{user.name}</div>
                                  <div className="text-xs text-muted-foreground">{user.email}</div>
                                </div>
                                <Select
                                  value={user.role}
                                  onValueChange={(value: UserRole) => updateUser(user.id, 'role', value)}
                                >
                                  <SelectTrigger className="h-8 w-[120px]">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="main_user">Main User</SelectItem>
                                    <SelectItem value="manager">Manager</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon-xs"
                                  onClick={() => removeUser(user.id)}
                                >
                                  <TrashIcon className="size-4" />
                                </Button>
                              </div>
                            ))
                          )}
                          {getAvailableUsersToAdd().length > 0 ? (
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-start">
                                  <SearchIcon className="size-4 mr-2" />
                                  Add a user...
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-full p-0" align="start">
                                <Command>
                                  <CommandInput
                                    placeholder="Search users..."
                                    value={userSearchQuery}
                                    onValueChange={setUserSearchQuery}
                                  />
                                  <CommandList>
                                    <CommandEmpty>No users found.</CommandEmpty>
                                    <CommandGroup>
                                      {getAvailableUsersToAdd()
                                        .filter(user =>
                                          user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                                          user.email.toLowerCase().includes(userSearchQuery.toLowerCase())
                                        )
                                        .map((user) => (
                                          <CommandItem
                                            key={user.id}
                                            value={user.id}
                                            onSelect={() => {
                                              addUser(user.id)
                                              setUserSearchQuery('')
                                            }}
                                          >
                                            <UserIcon className="size-3 mr-2" />
                                            <span>{user.name}</span>
                                            <span className="text-muted-foreground text-xs ml-2">({user.email})</span>
                                          </CommandItem>
                                        ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          ) : (
                            <div className="text-sm text-muted-foreground text-center py-2">
                              All users have been added
                            </div>
                          )}
                        </div>
                      </FieldContent>
                    </Field>

                    <Field>
                      <FieldLabel>Products</FieldLabel>
                      <FieldContent>
                        <div className="flex flex-wrap gap-2">
                          {(['sponsored-ads', 'xml-direct-listing', 'publisher', 'syndication'] as ProductType[]).map(product => (
                            <Button
                              key={product}
                              type="button"
                              size="xs"
                              variant={formData.products.includes(product) ? 'default' : 'outline'}
                              onClick={() => toggleProduct(product)}
                            >
                              {productLabelMap[product]}
                            </Button>
                          ))}
                        </div>
                      </FieldContent>
                    </Field>
                  </FieldGroup>
                  <SheetFooter className="mt-4">
                    <Button variant="outline" onClick={() => setSheetOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSubmit}>
                      Update Partner
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Global Product Tabs Navigation */}
      <TabNavigation tabs={tabs} />

      {/* Product Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Product Performance</CardTitle>
          <CardDescription>View revenue and clicks analytics for each product</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-4">{productTitle} - Ad Revenue / Clicks By Hours</h3>
            <div className="flex gap-2">
              <div className="w-4/6">
                <HourlyChart data={data()} config={config} />
              </div>
              <div className="w-2/6">
                <SnapshotTable data={snapshotData} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
"use client"

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Field, FieldGroup, FieldLabel, FieldContent } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { MoreVerticalIcon, PlusIcon } from 'lucide-react'
import { useState } from 'react'

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

const initialPartners: Partner[] = [
  {
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
  {
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
  {
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
  {
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
  {
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
  {
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
  {
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
  {
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
]

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

type FormData = {
  name: string
  type: PartnerType
  status: PartnerStatus
  email: string
  phone: string
  number_users: string
  products: ProductType[]
}

const emptyForm: FormData = {
  name: '',
  type: 'external',
  status: 'active',
  email: '',
  phone: '',
  number_users: '0',
  products: [],
}

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>(initialPartners)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null)
  const [formData, setFormData] = useState<FormData>(emptyForm)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const handleEdit = (partner: Partner) => {
    setEditingPartner(partner)
    setFormData({
      name: partner.name,
      type: partner.type,
      status: partner.status,
      email: partner.email,
      phone: partner.phone,
      number_users: partner.number_users.toString(),
      products: partner.products,
    })
    setSheetOpen(true)
  }

  const handleAdd = () => {
    setEditingPartner(null)
    setFormData({ ...emptyForm })
    setSheetOpen(true)
  }

  const handleDelete = (id: string) => {
    setDeleteId(id)
  }

  const confirmDelete = () => {
    if (deleteId) {
      setPartners(partners.filter(p => p.id !== deleteId))
      setDeleteId(null)
    }
  }

  const handleSubmit = () => {
    if (editingPartner) {
      // Update existing partner
      setPartners(partners.map(p =>
        p.id === editingPartner.id
          ? {
              ...p,
              name: formData.name,
              type: formData.type,
              status: formData.status,
              email: formData.email,
              phone: formData.phone,
              number_users: parseInt(formData.number_users) || 0,
              products: formData.products,
            }
          : p
      ))
    } else {
      // Add new partner
      const newPartner: Partner = {
        id: Date.now().toString(),
        name: formData.name,
        type: formData.type,
        status: formData.status,
        email: formData.email,
        phone: formData.phone,
        created_at: new Date().toISOString().split('T')[0],
        number_users: parseInt(formData.number_users) || 0,
        products: formData.products,
      }
      setPartners([...partners, newPartner])
    }
    setSheetOpen(false)
    setFormData(emptyForm)
    setEditingPartner(null)
  }

  const toggleProduct = (product: ProductType) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.includes(product)
        ? prev.products.filter(p => p !== product)
        : [...prev.products, product],
    }))
  }

  return (
    <div className="flex flex-col gap-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Partners</CardTitle>
              <CardDescription>Manage all partner relationships and their associated products</CardDescription>
            </div>
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button size="sm" onClick={handleAdd}>
                  <PlusIcon className="size-4" />
                  Add Partner
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>{editingPartner ? 'Edit Partner' : 'Add New Partner'}</SheetTitle>
                  <SheetDescription>
                    {editingPartner ? 'Update partner information below.' : 'Fill in the details to add a new partner.'}
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
                    <FieldLabel>Number of Users</FieldLabel>
                    <FieldContent>
                      <Input
                        type="number"
                        value={formData.number_users}
                        onChange={e => setFormData({ ...formData, number_users: e.target.value })}
                        placeholder="0"
                      />
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel>Products</FieldLabel>
                    <FieldContent>
                      <div className="flex flex-wrap gap-2">
                        {(['sponsored_ads', 'xml_direct_listing', 'publisher', 'syndication'] as ProductType[]).map(product => (
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
                    {editingPartner ? 'Update' : 'Create'} Partner
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {partners.map((partner) => (
                <TableRow key={partner.id}>
                  <TableCell className="font-medium">{partner.name}</TableCell>
                  <TableCell>
                    <Badge variant={typeVariantMap[partner.type]}>
                      {typeLabelMap[partner.type]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariantMap[partner.status]}>
                      {partner.status.charAt(0).toUpperCase() + partner.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{partner.email}</TableCell>
                  <TableCell>{partner.phone}</TableCell>
                  <TableCell>{partner.number_users.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {partner.products.map((product) => (
                        <Badge key={product} variant="outline" className="text-[10px]">
                          {productLabelMap[product]}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(partner.created_at)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-xs">
                          <MoreVerticalIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(partner)}>
                          Edit
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              variant="destructive"
                              onSelect={(e) => {
                                e.preventDefault()
                                handleDelete(partner.id)
                              }}
                            >
                              Delete
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Partner</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{partner.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setDeleteId(null)}>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={confirmDelete} variant="destructive">
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

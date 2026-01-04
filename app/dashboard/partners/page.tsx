"use client"

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
import { MoreVerticalIcon, PlusIcon, TrashIcon, UserIcon, SearchIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { availableUsers, initialPartners, type Partner, type User, type ProductType, type PartnerStatus, type PartnerType, type UserRole } from './constants'

const ALL_PRODUCT_TYPES: ProductType[] = ['sponsored-ads', 'xml-direct-listing', 'publisher', 'syndication']

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

const emptyForm: FormData = {
  name: '',
  type: 'external',
  status: 'active',
  email: '',
  phone: '',
  users: [],
  products: [],
}

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50, 100]

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null)
  const [formData, setFormData] = useState<FormData>(emptyForm)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [userSearchQuery, setUserSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const handleEdit = (partner: Partner) => {
    setEditingPartner(partner)
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

  const handleAdd = () => {
    setEditingPartner(null)
    setFormData({ ...emptyForm })
    setUserSearchQuery('')
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
              users: formData.users,
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
        users: formData.users,
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

  // Pagination
  const totalPages = Math.ceil(partners.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedPartners = partners.slice(startIndex, endIndex)

  // Initialize partners data on mount to ensure consistency
  useEffect(() => {
    if (!isInitialized) {
      setPartners(initialPartners)
      setIsInitialized(true)
    }
  }, [isInitialized])

  // Reset to page 1 when items per page changes
  useEffect(() => {
    setCurrentPage(1)
  }, [itemsPerPage])

  // Handle items per page change
  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value))
    setCurrentPage(1)
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div>
        <div className="flex items-center justify-between mb-4 border-b pb-2">
          <div>
            <h2 className="text-lg font-semibold">Partners</h2>
            <p className="text-sm text-muted-foreground">Manage all partner relationships and their associated products</p>
          </div>
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button size="sm" onClick={handleAdd}>
                  <PlusIcon className="size-4" />
                  Add Partner
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
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
                        {ALL_PRODUCT_TYPES.map(product => (
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
        <div>
          <div className="border">
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
                {paginatedPartners.map((partner) => (
                  <TableRow key={partner.id}>
                    <TableCell className="font-medium">
                      <Link href={`/dashboard/partners/${partner.id}`} className="hover:underline">
                        {partner.name}
                      </Link>
                    </TableCell>
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
                    <TableCell>
                      {partner.users.length === 0 ? (
                        <span className="text-muted-foreground text-sm">No users</span>
                      ) : (
                        <div className="space-y-1">
                          {getMainUser(partner.users) && (
                            <div className="flex items-center gap-1 text-sm">
                              <UserIcon className="size-3 text-muted-foreground" />
                              <span className="font-medium">{getMainUser(partner.users)?.name}</span>
                              <Badge variant="secondary" className="text-[10px] px-1">Main</Badge>
                            </div>
                          )}
                          {getManagerCount(partner.users) > 0 && (
                            <div className="text-xs text-muted-foreground">
                              +{getManagerCount(partner.users)} manager{getManagerCount(partner.users) > 1 ? 's' : ''}
                            </div>
                          )}
                        </div>
                      )}
                    </TableCell>
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
          </div>

          {/* Pagination */}
          {partners.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-4">
                <span className="text-xs text-muted-foreground">
                  Showing {startIndex + 1}-{Math.min(endIndex, partners.length)} of {partners.length} partners
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Rows per page:</span>
                  <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                    <SelectTrigger className="h-7 w-[70px] text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option.toString()} className="text-xs">
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeftIcon className="size-4" />
                  Previous
                </Button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and adjacent pages
                    const showPage =
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)

                    if (!showPage) {
                      // Show ellipsis for skipped pages
                      if (page === currentPage - 2 || page === currentPage + 2) {
                        return (
                          <span key={page} className="px-2 text-xs text-muted-foreground">
                            ...
                          </span>
                        )
                      }
                      return null
                    }

                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        className="min-w-[2rem] px-2"
                      >
                        {page}
                      </Button>
                    )
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  Next
                  <ChevronRightIcon className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

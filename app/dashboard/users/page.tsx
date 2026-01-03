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
import { Field, FieldGroup, FieldLabel, FieldContent } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  MoreVerticalIcon,
  PlusIcon,
  TrashIcon,
  UserIcon,
  SearchIcon,
  ShieldIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  BuildingIcon,
} from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useUsers } from '@/hooks/use-users'
import { User, UserStatus, SystemRole, UserCreateData } from '@/lib/types/users'
import { Switch } from '@/components/ui/switch'

const statusVariantMap: Record<UserStatus, "default" | "secondary" | "destructive" | "outline"> = {
  active: 'default',
  inactive: 'secondary',
  pending: 'outline',
  suspended: 'destructive',
}

const roleVariantMap: Record<SystemRole, "default" | "secondary" | "outline"> = {
  admin: 'default',
  manager: 'secondary',
  user: 'outline',
  viewer: 'outline',
}

const roleLabelMap: Record<SystemRole, string> = {
  admin: 'Admin',
  manager: 'Manager',
  user: 'User',
  viewer: 'Viewer',
}

const statusLabelMap: Record<UserStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
  pending: 'Pending',
  suspended: 'Suspended',
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
  email: string
  phone: string
  status: UserStatus
  role: SystemRole
  department: string
  location: string
  avatarUrl: string
  bio: string
  password?: string
  twoFactorEnabled: boolean
  emailNotifications: boolean
  pushNotifications: boolean
  theme: 'light' | 'dark' | 'system'
}

const emptyForm: FormData = {
  name: '',
  email: '',
  phone: '',
  status: 'active',
  role: 'user',
  department: '',
  location: '',
  avatarUrl: '',
  bio: '',
  twoFactorEnabled: false,
  emailNotifications: true,
  pushNotifications: false,
  theme: 'system',
}

export default function UsersPage() {
  const { users, isLoading, isSaving, isDeleting, error, createUser, updateUser, deleteUser } = useUsers()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState<FormData>(emptyForm)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all')
  const [roleFilter, setRoleFilter] = useState<SystemRole | 'all'>('all')
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      searchQuery === '' ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.profile.department.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    const matchesRole = roleFilter === 'all' || user.role === roleFilter

    return matchesSearch && matchesStatus && matchesRole
  })

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.profile.phone,
      status: user.status,
      role: user.role,
      department: user.profile.department,
      location: user.profile.location,
      avatarUrl: user.profile.avatarUrl,
      bio: user.profile.bio,
      twoFactorEnabled: user.security.twoFactorEnabled,
      emailNotifications: user.preferences.emailNotifications,
      pushNotifications: user.preferences.pushNotifications,
      theme: user.preferences.theme,
    })
    setFormErrors({})
    setSheetOpen(true)
  }

  const handleAdd = () => {
    setEditingUser(null)
    setFormData({ ...emptyForm })
    setFormErrors({})
    setSheetOpen(true)
  }

  const handleDelete = (id: string) => {
    setDeleteId(id)
  }

  const confirmDelete = async () => {
    if (deleteId) {
      await deleteUser(deleteId)
      setDeleteId(null)
    }
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.name || formData.name.length < 2) {
      errors.name = 'Name must be at least 2 characters'
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format'
    }

    if (!editingUser && (!formData.password || formData.password.length < 8)) {
      errors.password = 'Password must be at least 8 characters'
    }

    if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      errors.phone = 'Invalid phone number format'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    const userData: UserCreateData = {
      name: formData.name,
      email: formData.email,
      status: formData.status,
      role: formData.role,
      profile: {
        department: formData.department,
        location: formData.location,
        avatarUrl: formData.avatarUrl,
        bio: formData.bio,
        phone: formData.phone,
      },
      security: {
        twoFactorEnabled: formData.twoFactorEnabled,
        password: !editingUser ? formData.password : undefined,
      },
      preferences: {
        emailNotifications: formData.emailNotifications,
        pushNotifications: formData.pushNotifications,
        theme: formData.theme,
        language: 'en',
      },
      partners: editingUser?.partners || [],
    }

    let result
    if (editingUser) {
      result = await updateUser(editingUser.id, userData)
    } else {
      result = await createUser(userData)
    }

    if (result.success) {
      setSheetOpen(false)
      setFormData(emptyForm)
      setEditingUser(null)
      setFormErrors({})
    } else if (result.errors) {
      const errors: Record<string, string> = {}
      Object.entries(result.errors).forEach(([key, value]) => {
        errors[key] = value[0]
      })
      setFormErrors(errors)
    }
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div>
        <div className="flex items-center justify-between mb-4 border-b pb-2">
          <div>
            <h2 className="text-lg font-semibold">Users</h2>
            <p className="text-sm text-muted-foreground">Manage all user accounts and their access</p>
          </div>
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button size="sm" onClick={handleAdd}>
                  <PlusIcon className="size-4" />
                  Add User
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>{editingUser ? 'Edit User' : 'Add New User'}</SheetTitle>
                  <SheetDescription>
                    {editingUser ? 'Update user information below.' : 'Fill in the details to add a new user.'}
                  </SheetDescription>
                </SheetHeader>
                <FieldGroup className="mt-4 px-4 space-y-4">
                  {/* Name */}
                  <Field>
                    <FieldLabel>Name *</FieldLabel>
                    <FieldContent>
                      <Input
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                      />
                      {formErrors.name && <p className="text-sm text-destructive mt-1">{formErrors.name}</p>}
                    </FieldContent>
                  </Field>

                  {/* Email */}
                  <Field>
                    <FieldLabel>Email *</FieldLabel>
                    <FieldContent>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                      />
                      {formErrors.email && <p className="text-sm text-destructive mt-1">{formErrors.email}</p>}
                    </FieldContent>
                  </Field>

                  {/* Password (only on create) */}
                  {!editingUser && (
                    <Field>
                      <FieldLabel>Password *</FieldLabel>
                      <FieldContent>
                        <Input
                          type="password"
                          value={formData.password || ''}
                          onChange={e => setFormData({ ...formData, password: e.target.value })}
                          placeholder="••••••••"
                        />
                        {formErrors.password && <p className="text-sm text-destructive mt-1">{formErrors.password}</p>}
                      </FieldContent>
                    </Field>
                  )}

                  {/* Phone */}
                  <Field>
                    <FieldLabel>Phone</FieldLabel>
                    <FieldContent>
                      <div className="relative">
                        <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                          type="tel"
                          value={formData.phone}
                          onChange={e => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+1 (555) 000-0000"
                          className="pl-9"
                        />
                      </div>
                      {formErrors.phone && <p className="text-sm text-destructive mt-1">{formErrors.phone}</p>}
                    </FieldContent>
                  </Field>

                  {/* Status */}
                  <Field>
                    <FieldLabel>Status</FieldLabel>
                    <FieldContent>
                      <Select
                        value={formData.status}
                        onValueChange={(value: UserStatus) => setFormData({ ...formData, status: value })}
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

                  {/* Role */}
                  <Field>
                    <FieldLabel>Role</FieldLabel>
                    <FieldContent>
                      <Select
                        value={formData.role}
                        onValueChange={(value: SystemRole) => setFormData({ ...formData, role: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    </FieldContent>
                  </Field>

                  {/* Department */}
                  <Field>
                    <FieldLabel>Department</FieldLabel>
                    <FieldContent>
                      <div className="relative">
                        <BuildingIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                          value={formData.department}
                          onChange={e => setFormData({ ...formData, department: e.target.value })}
                          placeholder="Engineering"
                          className="pl-9"
                        />
                      </div>
                    </FieldContent>
                  </Field>

                  {/* Location */}
                  <Field>
                    <FieldLabel>Location</FieldLabel>
                    <FieldContent>
                      <div className="relative">
                        <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                          value={formData.location}
                          onChange={e => setFormData({ ...formData, location: e.target.value })}
                          placeholder="San Francisco, CA"
                          className="pl-9"
                        />
                      </div>
                    </FieldContent>
                  </Field>

                  {/* Avatar URL */}
                  <Field>
                    <FieldLabel>Avatar URL</FieldLabel>
                    <FieldContent>
                      <Input
                        value={formData.avatarUrl}
                        onChange={e => setFormData({ ...formData, avatarUrl: e.target.value })}
                        placeholder="/avatars/john.jpg"
                      />
                    </FieldContent>
                  </Field>

                  {/* Bio */}
                  <Field>
                    <FieldLabel>Bio</FieldLabel>
                    <FieldContent>
                      <Input
                        value={formData.bio}
                        onChange={e => setFormData({ ...formData, bio: e.target.value })}
                        placeholder="Brief description..."
                      />
                    </FieldContent>
                  </Field>

                  {/* 2FA */}
                  <Field>
                    <FieldLabel>Two-Factor Authentication</FieldLabel>
                    <FieldContent>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="2fa"
                          checked={formData.twoFactorEnabled}
                          onCheckedChange={checked => setFormData({ ...formData, twoFactorEnabled: checked })}
                        />
                        <label htmlFor="2fa" className="text-sm">
                          Enable 2FA
                        </label>
                      </div>
                    </FieldContent>
                  </Field>

                  {/* Notification Preferences */}
                  <Field>
                    <FieldLabel>Notifications</FieldLabel>
                    <FieldContent>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="email-notif"
                            checked={formData.emailNotifications}
                            onCheckedChange={checked => setFormData({ ...formData, emailNotifications: checked })}
                          />
                          <label htmlFor="email-notif" className="text-sm">
                            Email notifications
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="push-notif"
                            checked={formData.pushNotifications}
                            onCheckedChange={checked => setFormData({ ...formData, pushNotifications: checked })}
                          />
                          <label htmlFor="push-notif" className="text-sm">
                            Push notifications
                          </label>
                        </div>
                      </div>
                    </FieldContent>
                  </Field>

                  {/* Theme */}
                  <Field>
                    <FieldLabel>Theme</FieldLabel>
                    <FieldContent>
                      <Select
                        value={formData.theme}
                        onValueChange={(value: 'light' | 'dark' | 'system') => setFormData({ ...formData, theme: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </FieldContent>
                  </Field>
                </FieldGroup>
                <SheetFooter className="mt-4">
                  <Button variant="outline" onClick={() => setSheetOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit} disabled={isSaving}>
                    {isSaving ? 'Saving...' : editingUser ? 'Update' : 'Create'} User
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        <div>
          {/* Filters */}
          <FieldGroup className="mb-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Field className="flex-1">
                <FieldLabel>Search</FieldLabel>
                <FieldContent>
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, email, or department..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </FieldContent>
              </Field>

              <Field className="sm:w-[150px]">
                <FieldLabel>Status</FieldLabel>
                <FieldContent>
                  <Select
                    value={statusFilter}
                    onValueChange={(value: UserStatus | 'all') => setStatusFilter(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldContent>
              </Field>

              <Field className="sm:w-[150px]">
                <FieldLabel>Role</FieldLabel>
                <FieldContent>
                  <Select
                    value={roleFilter}
                    onValueChange={(value: SystemRole | 'all') => setRoleFilter(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldContent>
              </Field>
            </div>
          </FieldGroup>

          {/* Table */}
          <div className="border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Partners</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      Loading users...
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <Link href={`/dashboard/users/${user.id}`} className="hover:underline">
                          <div className="flex items-center gap-2">
                            <UserIcon className="size-4 text-muted-foreground" />
                            {user.name}
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MailIcon className="size-3 text-muted-foreground" />
                          {user.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariantMap[user.status]}>
                          {statusLabelMap[user.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={roleVariantMap[user.role]}>
                          <div className="flex items-center gap-1">
                            <ShieldIcon className="size-3" />
                            {roleLabelMap[user.role]}
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <BuildingIcon className="size-3 text-muted-foreground" />
                          {user.profile.department}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPinIcon className="size-3 text-muted-foreground" />
                          {user.profile.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.partners.length === 0 ? (
                          <span className="text-muted-foreground text-sm">No partners</span>
                        ) : (
                          <div className="flex gap-1 flex-wrap">
                            {user.partners.slice(0, 2).map((partner) => (
                              <Badge key={partner.partnerId} variant="outline" className="text-[10px]">
                                {partner.partnerName}
                              </Badge>
                            ))}
                            {user.partners.length > 2 && (
                              <Badge variant="outline" className="text-[10px]">
                                +{user.partners.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon-xs">
                              <MoreVerticalIcon className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(user)}>
                              Edit
                            </DropdownMenuItem>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  variant="destructive"
                                  onSelect={(e) => {
                                    e.preventDefault()
                                    handleDelete(user.id)
                                  }}
                                >
                                  Delete
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete User</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{user.name}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel onClick={() => setDeleteId(null)}>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={confirmDelete} variant="destructive" disabled={isDeleting}>
                                    {isDeleting ? 'Deleting...' : 'Delete'}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length > 0 && (
            <div className="flex items-center justify-between text-xs text-muted-foreground mt-4">
              <span>Showing {filteredUsers.length} of {users.length} users</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

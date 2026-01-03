'use client'

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Field, FieldGroup, FieldLabel, FieldContent } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  PlusIcon,
  ShieldIcon,
  SearchIcon,
  UserIcon,
  EditIcon,
  KeyIcon,
  UsersIcon,
  LockIcon,
  EyeIcon,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  getAllRoles,
  getUsersWithRoles,
  getPermissionGroups,
  PERMISSION_LABEL_MAP,
  ROLE_LABEL_MAP,
} from '@/lib/api/acl-api'
import {
  Role,
  UserWithRole,
  PermissionGroup,
  SystemRole,
} from '@/lib/types/acl'

const roleVariantMap: Record<string, 'default' | 'secondary' | 'outline'> = {
  admin: 'default',
  manager: 'secondary',
  user: 'outline',
  viewer: 'outline',
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function ACLsPage() {
  const [activeTab, setActiveTab] = useState('roles')

  // Roles state
  const [roles, setRoles] = useState<Role[]>([])

  // Users state
  const [users, setUsers] = useState<UserWithRole[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<SystemRole | 'all'>('all')

  // Permissions state
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([])

  useEffect(() => {
    loadRoles()
    loadUsers()
    setPermissionGroups(getPermissionGroups())
  }, [])

  const loadRoles = async () => {
    const response = await getAllRoles()
    if (response.success && response.data) {
      setRoles(response.data)
    }
  }

  const loadUsers = async () => {
    const response = await getUsersWithRoles()
    if (response.success && response.data) {
      setUsers(response.data)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      searchQuery === '' ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRole = roleFilter === 'all' || user.role === roleFilter

    return matchesSearch && matchesRole
  })

  return (
    <div className="flex flex-col gap-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldIcon className="size-5" />
            <div>
              <CardTitle>Access Control Lists (ACLs)</CardTitle>
              <CardDescription>
                Manage roles, permissions, and user access control
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList variant="line">
              <TabsTrigger value="roles">
                <LockIcon className="size-4" />
                Roles
              </TabsTrigger>
              <TabsTrigger value="permissions">
                <KeyIcon className="size-4" />
                Permissions
              </TabsTrigger>
              <TabsTrigger value="users">
                <UsersIcon className="size-4" />
                Users
              </TabsTrigger>
            </TabsList>

            {/* Roles Tab */}
            <TabsContent value="roles" className="mt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {roles.length} roles configured
                  </div>
                  <Link href="/dashboard/acls/new">
                    <Button size="sm">
                      <PlusIcon className="size-4" />
                      Add Role
                    </Button>
                  </Link>
                </div>

                {/* Roles Table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Role</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Permissions</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="w-[80px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {roles.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                              <ShieldIcon className="size-8" />
                              <p>No roles found</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        roles.map(role => (
                          <TableRow key={role.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Badge variant={roleVariantMap[role.slug]}>
                                  {role.name}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm text-muted-foreground max-w-[300px]">
                                {role.description}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1 max-w-[400px]">
                                {role.permissions.slice(0, 3).map(permission => (
                                  <Badge key={permission} variant="outline" className="text-[10px]">
                                    {PERMISSION_LABEL_MAP[permission]}
                                  </Badge>
                                ))}
                                {role.permissions.length > 3 && (
                                  <Badge variant="outline" className="text-[10px]">
                                    +{role.permissions.length - 3}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {role.isSystemRole ? (
                                <Badge variant="secondary">System</Badge>
                              ) : (
                                <Badge variant="outline">Custom</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="text-sm text-muted-foreground">
                                {formatDate(role.createdAt)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Link href={`/dashboard/acls/${role.id}/edit`}>
                                <Button variant="ghost" size="icon-sm">
                                  <EditIcon className="size-4" />
                                </Button>
                              </Link>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>

            {/* Permissions Tab */}
            <TabsContent value="permissions" className="mt-4">
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Overview of all available permissions organized by category
                </div>

                {permissionGroups.map(group => (
                  <Card key={group.category}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">{group.label}</CardTitle>
                      <CardDescription>{group.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {group.permissions.map(permission => {
                          const rolesWithPermission = roles.filter(role =>
                            role.permissions.includes(permission)
                          )

                          return (
                            <div
                              key={permission}
                              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                            >
                              <div className="flex-1">
                                <div className="font-medium text-sm">
                                  {PERMISSION_LABEL_MAP[permission]}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {rolesWithPermission.length > 0
                                    ? `${rolesWithPermission.length} role${rolesWithPermission.length > 1 ? 's' : ''}`
                                    : 'No roles'}
                                </div>
                              </div>
                              <div className="flex gap-1">
                                {rolesWithPermission.map(role => (
                                  <Badge
                                    key={role.id}
                                    variant={roleVariantMap[role.slug]}
                                    className="text-[10px]"
                                  >
                                    {role.slug}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="mt-4">
              <div className="space-y-4">
                <FieldGroup>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Field className="flex-1">
                      <FieldLabel>Search</FieldLabel>
                      <FieldContent>
                        <div className="relative">
                          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                          <Input
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="pl-9"
                          />
                        </div>
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

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Partners</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="w-[80px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="h-24 text-center">
                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                              <UserIcon className="size-8" />
                              <p>No users found matching your filters</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredUsers.map(user => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <UserIcon className="size-4 text-muted-foreground" />
                                <span className="font-medium">{user.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={roleVariantMap[user.role]}>
                                <div className="flex items-center gap-1">
                                  <ShieldIcon className="size-3" />
                                  {user.roleName}
                                </div>
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  user.status === 'active'
                                    ? 'default'
                                    : user.status === 'suspended'
                                      ? 'destructive'
                                      : 'secondary'
                                }
                              >
                                {user.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm text-muted-foreground">
                                {user.department}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm text-muted-foreground">
                                {user.location}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <span className="text-sm">{user.partnerCount}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm text-muted-foreground">
                                {formatDate(user.createdAt)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => {
                                  window.location.href = `/dashboard/users/${user.id}`
                                }}
                              >
                                <EyeIcon className="size-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {filteredUsers.length > 0 && (
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Showing {filteredUsers.length} of {users.length} users</span>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
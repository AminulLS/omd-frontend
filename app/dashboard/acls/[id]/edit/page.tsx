'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel, FieldContent } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import {
  ArrowLeftIcon,
  ShieldIcon,
  CheckIcon,
  KeyIcon,
  AlertCircleIcon,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
  getRoleById,
  updateRole,
  deleteRole,
  getPermissionGroups,
  PERMISSION_LABEL_MAP,
} from '@/lib/api/acl-api'
import { Permission, PermissionGroup, Role } from '@/lib/types/acl'
import Link from 'next/link'

type RoleFormData = {
  name: string
  slug: string
  description: string
  permissions: Permission[]
}

export default function EditRolePage() {
  const router = useRouter()
  const params = useParams()
  const roleId = params.id as string

  const [role, setRole] = useState<Role | null>(null)
  const [formData, setFormData] = useState<RoleFormData>({
    name: '',
    slug: '',
    description: '',
    permissions: [],
  })
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    loadRole()
    setPermissionGroups(getPermissionGroups())
  }, [roleId])

  const loadRole = async () => {
    const response = await getRoleById(roleId)
    if (response.success && response.data) {
      setRole(response.data)
      setFormData({
        name: response.data.name,
        slug: response.data.slug,
        description: response.data.description,
        permissions: response.data.permissions,
      })
    }
    setIsLoading(false)
  }

  const togglePermission = (permission: Permission) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission],
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name || formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    if (!formData.description || formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters'
    }

    if (formData.permissions.length === 0) {
      newErrors.permissions = 'At least one permission is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    setIsSaving(true)
    const response = await updateRole(roleId, formData)
    setIsSaving(false)

    if (response.success) {
      router.push('/dashboard/acls')
    } else if (response.errors) {
      const newErrors: Record<string, string> = {}
      Object.entries(response.errors).forEach(([key, value]) => {
        newErrors[key] = value[0]
      })
      setErrors(newErrors)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    const response = await deleteRole(roleId)
    setIsDeleting(false)

    if (response.success) {
      router.push('/dashboard/acls')
    } else if (response.message) {
      setErrors({ general: response.message })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading role...</div>
      </div>
    )
  }

  if (!role) {
    return (
      <div className="flex flex-col items-center justify-center p-8 gap-4">
        <AlertCircleIcon className="size-8 text-destructive" />
        <div className="text-muted-foreground">Role not found</div>
        <Link href="/dashboard/acls">
          <Button>Back to ACLs</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/acls">
            <Button variant="ghost" size="icon">
              <ArrowLeftIcon className="size-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-semibold flex items-center gap-2">
              <ShieldIcon className="size-4" />
              Edit Role
            </h1>
            <p className="text-sm text-muted-foreground">
              Update role details and permissions
            </p>
          </div>
        </div>
        {!role.isSystemRole && (
          <Button
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Role'}
          </Button>
        )}
      </div>

      {/* System Role Warning */}
      {role.isSystemRole && (
        <Alert className="border-yellow-200 bg-yellow-50 text-yellow-900 dark:bg-yellow-950/20 dark:border-yellow-900 dark:text-yellow-500">
          <AlertCircleIcon className="size-4 text-yellow-600 dark:text-yellow-500" />
          <AlertTitle>System Role</AlertTitle>
          <AlertDescription>
            Some fields are restricted and this role cannot be deleted.
          </AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Role Details</CardTitle>
          <CardDescription>Basic information about the role</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup className="space-y-4 max-w-2xl">
            {/* Name */}
            <Field>
              <FieldLabel>Role Name *</FieldLabel>
              <FieldContent>
                <Input
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Content Manager"
                />
                {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
              </FieldContent>
            </Field>

            {/* Slug */}
            <Field>
              <FieldLabel>Role Slug *</FieldLabel>
              <FieldContent>
                <Input
                  value={formData.slug}
                  onChange={e => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') })}
                  placeholder="e.g., content-manager"
                  className="font-mono"
                  disabled={role.isSystemRole}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Unique identifier (lowercase letters, numbers, hyphens, underscores only)
                  {role.isSystemRole && (
                    <span className="text-yellow-600 dark:text-yellow-500 ml-1">
                      - System role slugs cannot be changed
                    </span>
                  )}
                </p>
                {errors.slug && <p className="text-sm text-destructive mt-1">{errors.slug}</p>}
              </FieldContent>
            </Field>

            {/* Description */}
            <Field>
              <FieldLabel>Description *</FieldLabel>
              <FieldContent>
                <Input
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what this role can do..."
                />
                {errors.description && (
                  <p className="text-sm text-destructive mt-1">{errors.description}</p>
                )}
              </FieldContent>
            </Field>

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Role ID: </span>
                <span className="font-mono">{role.id}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Type: </span>
                <Badge variant={role.isSystemRole ? 'secondary' : 'outline'}>
                  {role.isSystemRole ? 'System' : 'Custom'}
                </Badge>
              </div>
              <div>
                <span className="text-muted-foreground">Created: </span>
                <span>{new Date(role.createdAt).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Last Updated: </span>
                <span>{new Date(role.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>

      {/* Permissions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <KeyIcon className="size-5" />
                Permissions
              </CardTitle>
              <CardDescription>
                Select what actions this role can perform
              </CardDescription>
            </div>
            <Badge variant="secondary">
              {formData.permissions.length} selected
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {permissionGroups.map(group => (
              <div key={group.category} className="border p-4">
                <div className="mb-3">
                  <div className="text-sm font-medium">{group.label}</div>
                  <div className="text-xs text-muted-foreground">{group.description}</div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {group.permissions.map(permission => (
                    <div
                      key={permission}
                      className={`flex items-center justify-between p-3 border transition-colors cursor-pointer ${
                        formData.permissions.includes(permission)
                          ? 'bg-primary/10 border-primary'
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => togglePermission(permission)}
                    >
                      <span className="text-sm font-medium">
                        {PERMISSION_LABEL_MAP[permission]}
                      </span>
                      {formData.permissions.includes(permission) && (
                        <CheckIcon className="size-4 text-primary" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {errors.permissions && (
              <p className="text-sm text-destructive">{errors.permissions}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* General Error */}
      {errors.general && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="pt-4">
            <p className="text-sm text-destructive">{errors.general}</p>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard/acls">
          <Button variant="outline" disabled={isSaving || isDeleting}>
            Cancel
          </Button>
        </Link>
        <Button onClick={handleSubmit} disabled={isSaving || isDeleting}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>Delete Role</CardTitle>
              <CardDescription>
                Are you sure you want to delete "{role.name}"? This action cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteDialog(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete Role'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
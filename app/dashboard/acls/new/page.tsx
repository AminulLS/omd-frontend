'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel, FieldContent } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ArrowLeftIcon,
  ShieldIcon,
  CheckIcon,
  KeyIcon,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  createRole,
  getPermissionGroups,
  PERMISSION_LABEL_MAP,
} from '@/lib/api/acl-api'
import { Permission, PermissionGroup } from '@/lib/types/acl'
import Link from 'next/link'

type RoleFormData = {
  name: string
  slug: string
  description: string
  permissions: Permission[]
}

const emptyForm: RoleFormData = {
  name: '',
  slug: '',
  description: '',
  permissions: [],
}

export default function NewRolePage() {
  const router = useRouter()
  const [formData, setFormData] = useState<RoleFormData>(emptyForm)
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    setPermissionGroups(getPermissionGroups())
  }, [])

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
    const response = await createRole(formData)
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

  return (
    <div className="flex flex-col gap-y-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/acls">
          <Button variant="ghost" size="icon">
            <ArrowLeftIcon className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShieldIcon className="size-6" />
            Create New Role
          </h1>
          <p className="text-muted-foreground">
            Configure a new role with specific permissions
          </p>
        </div>
      </div>

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
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Unique identifier (lowercase letters, numbers, hyphens, underscores only)
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
              <div key={group.category} className="border rounded-lg p-4">
                <div className="mb-3">
                  <div className="text-sm font-medium">{group.label}</div>
                  <div className="text-xs text-muted-foreground">{group.description}</div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {group.permissions.map(permission => (
                    <div
                      key={permission}
                      className={`flex items-center justify-between p-3 border rounded-lg transition-colors cursor-pointer ${
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

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Link href="/dashboard/acls">
          <Button variant="outline" disabled={isSaving}>
            Cancel
          </Button>
        </Link>
        <Button onClick={handleSubmit} disabled={isSaving}>
          {isSaving ? 'Creating...' : 'Create Role'}
        </Button>
      </div>
    </div>
  )
}
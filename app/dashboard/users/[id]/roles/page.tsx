"use client"

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TabNavigation } from '@/components/dashboard/tab-navigation'
import { ShieldIcon, CheckIcon, XIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getUserById, getRolePermissions } from '@/lib/api/users-api'
import { User, RolePermissions } from '@/lib/types/users'

const tabs = [
  { value: 'profile', label: 'Profile', href: '/dashboard/users/[id]/profile' },
  { value: 'roles', label: 'Roles', href: '/dashboard/users/[id]/roles' },
  { value: 'partners', label: 'Partners', href: '/dashboard/users/[id]/partners' },
  { value: 'activity', label: 'Activity', href: '/dashboard/users/[id]/activity' },
]

const roleLabelMap: Record<string, string> = {
  admin: 'Administrator',
  manager: 'Manager',
  user: 'User',
  viewer: 'Viewer',
}

const roleDescriptionMap: Record<string, string> = {
  admin: 'Full system access with all permissions',
  manager: 'Can manage users and partners, view audit logs',
  user: 'Standard user with limited access',
  viewer: 'Read-only access to view data and audit logs',
}

export default function UserRolesPage() {
  const params = useParams()
  const userId = params.id as string
  const [user, setUser] = useState<User | null>(null)
  const [permissions, setPermissions] = useState<RolePermissions | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const userResponse = await getUserById(userId)
      if (userResponse.success && userResponse.data) {
        setUser(userResponse.data[0])
        const perms = await getRolePermissions(userResponse.data[0].role)
        setPermissions(perms)
      }
      setIsLoading(false)
    }
    loadData()
  }, [userId])

  if (isLoading) {
    return <div className="p-6">Loading...</div>
  }

  if (!user || !permissions) {
    return <div className="p-6">User not found</div>
  }

  // Update tabs with actual ID
  const updatedTabs = tabs.map(tab => ({
    ...tab,
    href: tab.href.replace('[id]', userId),
  }))

  return (
    <div className="flex flex-col gap-y-4">
      <TabNavigation tabs={updatedTabs} />

      {/* System Role */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldIcon className="size-5" />
            System Role
          </CardTitle>
          <CardDescription>
            The user's primary role in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Badge variant="default" className="text-sm px-3 py-1">
              {roleLabelMap[user.role]}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {roleDescriptionMap[user.role]}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Permissions */}
      <Card>
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
          <CardDescription>
            Access and capabilities granted by this role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <PermissionItem
              label="Create Users"
              granted={permissions.canCreateUsers}
              description="Can create new user accounts"
            />
            <PermissionItem
              label="Edit Users"
              granted={permissions.canEditUsers}
              description="Can modify existing user accounts"
            />
            <PermissionItem
              label="Delete Users"
              granted={permissions.canDeleteUsers}
              description="Can permanently delete user accounts"
            />
            <PermissionItem
              label="Manage Partners"
              granted={permissions.canManagePartners}
              description="Can create, edit, and delete partners"
            />
            <PermissionItem
              label="View Audit Logs"
              granted={permissions.canViewAuditLogs}
              description="Can access system audit logs"
            />
            <PermissionItem
              label="Manage Settings"
              granted={permissions.canManageSettings}
              description="Can modify system-wide settings"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function PermissionItem({
  label,
  granted,
  description,
}: {
  label: string
  granted: boolean
  description: string
}) {
  return (
    <div className="flex items-start gap-3 p-3 border rounded-lg">
      <div className={`mt-0.5 ${granted ? 'text-green-600' : 'text-muted-foreground'}`}>
        {granted ? <CheckIcon className="size-5" /> : <XIcon className="size-5" />}
      </div>
      <div className="flex-1">
        <div className="font-medium">{label}</div>
        <div className="text-sm text-muted-foreground">{description}</div>
      </div>
      <Badge variant={granted ? 'default' : 'secondary'}>
        {granted ? 'Granted' : 'Denied'}
      </Badge>
    </div>
  )
}

"use client"

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { TabNavigation } from '@/components/dashboard/tab-navigation'
import {
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  BuildingIcon,
  ShieldIcon,
  BellIcon,
  PaletteIcon,
  CalendarIcon,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getUserById } from '@/lib/api/users-api'
import { User } from '@/lib/types/users'

const tabs = [
  { value: 'profile', label: 'Profile', href: '/dashboard/users/[id]/profile' },
  { value: 'roles', label: 'Roles', href: '/dashboard/users/[id]/roles' },
  { value: 'partners', label: 'Partners', href: '/dashboard/users/[id]/partners' },
  { value: 'activity', label: 'Activity', href: '/dashboard/users/[id]/activity' },
]

const statusVariantMap: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  active: 'default',
  inactive: 'secondary',
  pending: 'outline',
  suspended: 'destructive',
}

const roleVariantMap: Record<string, "default" | "secondary" | "outline"> = {
  admin: 'default',
  manager: 'secondary',
  user: 'outline',
  viewer: 'outline',
}

const roleLabelMap: Record<string, string> = {
  admin: 'Admin',
  manager: 'Manager',
  user: 'User',
  viewer: 'Viewer',
}

const statusLabelMap: Record<string, string> = {
  active: 'Active',
  inactive: 'Inactive',
  pending: 'Pending',
  suspended: 'Suspended',
}

export default function UserProfilePage() {
  const params = useParams()
  const userId = params.id as string
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      const response = await getUserById(userId)
      if (response.success && response.data) {
        setUser(response.data[0])
      }
      setIsLoading(false)
    }
    loadUser()
  }, [userId])

  if (isLoading) {
    return <div className="p-6">Loading...</div>
  }

  if (!user) {
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

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="size-16">
                <AvatarImage src={user.profile.avatarUrl} />
                <AvatarFallback>
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{user.name}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <MailIcon className="size-3" />
                  {user.email}
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant={statusVariantMap[user.status]}>
                {statusLabelMap[user.status]}
              </Badge>
              <Badge variant={roleVariantMap[user.role]}>
                <div className="flex items-center gap-1">
                  <ShieldIcon className="size-3" />
                  {roleLabelMap[user.role]}
                </div>
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Contact Information */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <MailIcon className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">Email:</span>
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <PhoneIcon className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">Phone:</span>
                <span>{user.profile.phone || 'Not set'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <BuildingIcon className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">Department:</span>
                <span>{user.profile.department || 'Not set'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPinIcon className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">Location:</span>
                <span>{user.profile.location || 'Not set'}</span>
              </div>
            </div>
          </div>

          {/* Bio */}
          {user.profile.bio && (
            <div>
              <h3 className="text-sm font-semibold mb-2">About</h3>
              <p className="text-sm text-muted-foreground">{user.profile.bio}</p>
            </div>
          )}

          {/* Account Information */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CalendarIcon className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">Joined:</span>
                <span>{new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">Last Updated:</span>
                <span>{new Date(user.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              {user.security.lastLogin && (
                <div className="flex items-center gap-2">
                  <CalendarIcon className="size-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Last Login:</span>
                  <span>{new Date(user.security.lastLogin).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Security Settings */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Security</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <ShieldIcon className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">Two-Factor Authentication:</span>
                <Badge variant={user.security.twoFactorEnabled ? 'default' : 'secondary'}>
                  {user.security.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Preferences</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <BellIcon className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">Email Notifications:</span>
                <Badge variant={user.preferences.emailNotifications ? 'default' : 'secondary'}>
                  {user.preferences.emailNotifications ? 'On' : 'Off'}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <BellIcon className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">Push Notifications:</span>
                <Badge variant={user.preferences.pushNotifications ? 'default' : 'secondary'}>
                  {user.preferences.pushNotifications ? 'On' : 'Off'}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <PaletteIcon className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">Theme:</span>
                <Badge variant="outline">{user.preferences.theme}</Badge>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button variant="outline" size="sm">
              Edit Profile
            </Button>
            <Button variant="outline" size="sm">
              Reset Password
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

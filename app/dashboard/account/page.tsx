'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/context/auth-context'
import { updateUser } from '@/lib/api/users-api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import { toast } from 'sonner'
import { Loader2, Camera, Save } from 'lucide-react'

export default function AccountPage() {
  const { user, updateUser: updateAuthUser } = useAuth()
  const [isSaving, setIsSaving] = useState(false)

  // Profile state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.profile.phone || '',
    department: user?.profile.department || '',
    location: user?.profile.location || '',
    bio: user?.profile.bio || '',
    avatarUrl: user?.profile.avatarUrl || '',
  })

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  // Preferences state
  const [preferences, setPreferences] = useState({
    emailNotifications: user?.preferences.emailNotifications ?? true,
    pushNotifications: user?.preferences.pushNotifications ?? true,
    theme: user?.preferences.theme || 'system',
    language: user?.preferences.language || 'en',
  })

  const handleProfileSave = async () => {
    if (!user) return

    setIsSaving(true)
    try {
      const response = await updateUser(user.id, {
        name: profileData.name,
        email: profileData.email,
        profile: {
          ...profileData,
          avatarUrl: profileData.avatarUrl,
        },
      })

      if (response.success) {
        updateAuthUser({
          ...user,
          name: profileData.name,
          email: profileData.email,
          profile: {
            ...user.profile,
            ...profileData,
          },
        })
        toast.success('Profile updated successfully')
      } else {
        toast.error(response.message || 'Failed to update profile')
      }
    } catch (error) {
      toast.error('An error occurred while updating profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePasswordSave = async () => {
    if (!user) return

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    setIsSaving(true)
    try {
      // In production, you would verify the current password here
      const response = await updateUser(user.id, {
        security: {
          ...user.security,
          passwordChangedAt: new Date().toISOString(),
        },
      })

      if (response.success) {
        updateAuthUser({
          ...user,
          security: {
            ...user.security,
            passwordChangedAt: new Date().toISOString(),
          },
        })
        toast.success('Password changed successfully')
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        })
      } else {
        toast.error(response.message || 'Failed to change password')
      }
    } catch (error) {
      toast.error('An error occurred while changing password')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePreferencesSave = async () => {
    if (!user) return

    setIsSaving(true)
    try {
      const response = await updateUser(user.id, {
        preferences,
      })

      if (response.success) {
        updateAuthUser({
          ...user,
          preferences,
        })
        toast.success('Preferences saved successfully')
      } else {
        toast.error(response.message || 'Failed to save preferences')
      }
    } catch (error) {
      toast.error('An error occurred while saving preferences')
    } finally {
      setIsSaving(false)
    }
  }

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // In production, upload to server and get URL
    // For now, create a local preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setProfileData({
        ...profileData,
        avatarUrl: reader.result as string,
      })
    }
    reader.readAsDataURL(file)
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="space-y-6">
      <div className="mb-4 border-b pb-2">
        <h1 className="text-lg font-semibold">Account Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList variant="line" className="mb-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and profile photo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Upload */}
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profileData.avatarUrl} alt={user.name} />
                  <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Label htmlFor="avatar-upload" className="cursor-pointer">
                      <div className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90">
                        <Camera className="h-4 w-4" />
                        <span>Change Photo</span>
                      </div>
                      <Input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                      />
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Recommended: Square image, at least 200x200px
                  </p>
                </div>
              </div>

              {/* Profile Fields */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                    placeholder="john@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData({ ...profileData, phone: e.target.value })
                    }
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={profileData.department}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        department: e.target.value,
                      })
                    }
                    placeholder="Engineering"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profileData.location}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        location: e.target.value,
                      })
                    }
                    placeholder="San Francisco, CA"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) =>
                      setProfileData({ ...profileData, bio: e.target.value })
                    }
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleProfileSave} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Ensure your account is using a secure password
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={handlePasswordSave} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Change Password
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">
                    {user.security.twoFactorEnabled
                      ? '2FA is Enabled'
                      : '2FA is Disabled'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {user.security.twoFactorEnabled
                      ? 'Your account is protected with two-factor authentication'
                      : 'Enable two-factor authentication to secure your account'}
                  </p>
                </div>
                <Switch
                  checked={user.security.twoFactorEnabled}
                  onCheckedChange={() => {
                    toast.info(
                      'Two-factor authentication settings will be available soon'
                    )
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email updates about your account activity
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={preferences.emailNotifications}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, emailNotifications: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive push notifications in your browser
                  </p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={preferences.pushNotifications}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, pushNotifications: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how the application looks and feels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select
                  value={preferences.theme}
                  onValueChange={(value: 'light' | 'dark' | 'system') =>
                    setPreferences({ ...preferences, theme: value })
                  }
                >
                  <SelectTrigger id="theme">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select
                  value={preferences.language}
                  onValueChange={(value) =>
                    setPreferences({ ...preferences, language: value })
                  }
                >
                  <SelectTrigger id="language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end">
                <Button onClick={handlePreferencesSave} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Preferences
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
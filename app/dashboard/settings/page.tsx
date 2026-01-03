'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2 } from 'lucide-react'
import { BasicSettingsForm } from '@/components/blocks/dashboard/settings/basic-settings-form'
import { SEOSettingsForm } from '@/components/blocks/dashboard/settings/seo-settings-form'
import { ThemeSettingsForm } from '@/components/blocks/dashboard/settings/theme-settings-form'
import { SecuritySettingsForm } from '@/components/blocks/dashboard/settings/security-settings-form'
import { SystemSettingsForm } from '@/components/blocks/dashboard/settings/system-settings-form'
import { checkAdminAccess } from '@/lib/api/access-control'

export default function SettingsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [hasAccess, setHasAccess] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')

  useEffect(() => {
    // Check admin access
    const access = checkAdminAccess()
    if (!access) {
      // For demo purposes, allow access. In production, uncomment the redirect:
      // router.push('/dashboard')
      // For now, we'll just show a message or allow access
      console.log('Admin access check:', access)
    }
    setHasAccess(true)
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center py-12">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This page is only accessible to administrators.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>
            Manage your application settings and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList variant="line">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
              <TabsTrigger value="theme">Theme</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="system">System</TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
              <BasicSettingsForm />
            </TabsContent>

            <TabsContent value="seo">
              <SEOSettingsForm />
            </TabsContent>

            <TabsContent value="theme">
              <ThemeSettingsForm />
            </TabsContent>

            <TabsContent value="security">
              <SecuritySettingsForm />
            </TabsContent>

            <TabsContent value="system">
              <SystemSettingsForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { TabNavigation } from '@/components/dashboard/tab-navigation'
import {
  ClockIcon,
  UserIcon,
  MonitorIcon,
  MapPinIcon,
  InfoIcon,
  AlertTriangleIcon,
  AlertCircleIcon,
  RadarIcon,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getUserById, getUserActivityLogs } from '@/lib/api/users-api'
import { User, UserActivityLog } from '@/lib/types/users'

const tabs = [
  { value: 'profile', label: 'Profile', href: '/dashboard/users/[id]/profile' },
  { value: 'roles', label: 'Roles', href: '/dashboard/users/[id]/roles' },
  { value: 'partners', label: 'Partners', href: '/dashboard/users/[id]/partners' },
  { value: 'activity', label: 'Activity', href: '/dashboard/users/[id]/activity' },
]

const levelVariantMap: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  info: 'default',
  warning: 'outline',
  error: 'destructive',
  critical: 'destructive',
}

const levelIconMap: Record<string, any> = {
  info: InfoIcon,
  warning: AlertTriangleIcon,
  error: AlertCircleIcon,
  critical: RadarIcon,
}

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function UserActivityPage() {
  const params = useParams()
  const userId = params.id as string
  const [user, setUser] = useState<User | null>(null)
  const [logs, setLogs] = useState<UserActivityLog[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const userResponse = await getUserById(userId)
      if (userResponse.success && userResponse.data) {
        setUser(userResponse.data[0])
      }
      const activityLogs = await getUserActivityLogs(userId)
      setLogs(activityLogs)
      setIsLoading(false)
    }
    loadData()
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
          <CardTitle className="flex items-center gap-2">
            <ClockIcon className="size-5" />
            Activity Logs
          </CardTitle>
          <CardDescription>
            Recent activities and events for this user
          </CardDescription>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <div className="text-center py-12">
              <ClockIcon className="size-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No activity logs found for this user.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">Time</TableHead>
                  <TableHead className="w-[90px]">Level</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <ActivityRow key={log.id} log={log} />
                ))}
              </TableBody>
            </Table>
          )}

          {logs.length > 0 && (
            <div className="flex items-center justify-between text-xs text-muted-foreground mt-4">
              <span>Showing {logs.length} recent activities</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function ActivityRow({ log }: { log: UserActivityLog }) {
  const LevelIcon = levelIconMap[log.level] || InfoIcon

  return (
    <TableRow>
      <TableCell className="text-muted-foreground text-xs">
        {formatTimestamp(log.timestamp)}
      </TableCell>
      <TableCell>
        <Badge variant={levelVariantMap[log.level]} className="flex items-center gap-1 w-fit">
          <LevelIcon className="size-3" />
          {log.level.charAt(0).toUpperCase() + log.level.slice(1)}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="font-medium text-sm">{log.eventType}</div>
        <div className="text-xs text-muted-foreground">{log.description}</div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <UserIcon className="size-3 text-muted-foreground" />
          <div>
            <div className="text-sm font-medium">{log.actor.name}</div>
            <div className="text-xs text-muted-foreground">{log.actor.email}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        {log.metadata && (
          <div className="text-xs text-muted-foreground space-y-1">
            {log.metadata.ip && (
              <div className="flex items-center gap-1">
                <MapPinIcon className="size-3" />
                {log.metadata.ip}
              </div>
            )}
            {log.metadata.browser && (
              <div className="flex items-center gap-1">
                <MonitorIcon className="size-3" />
                {log.metadata.browser}
              </div>
            )}
            {log.metadata.location && (
              <div className="flex items-center gap-1">
                <MapPinIcon className="size-3" />
                {log.metadata.location}
              </div>
            )}
          </div>
        )}
      </TableCell>
    </TableRow>
  )
}

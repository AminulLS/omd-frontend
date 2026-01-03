"use client"

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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
  ChevronDownIcon,
  ChevronRightIcon,
  EyeIcon,
  FilterIcon,
  SearchIcon,
  ShieldAlertIcon,
  UserIcon,
} from 'lucide-react'
import { useState } from 'react'

type AuditLogLevel = 'info' | 'warning' | 'error' | 'critical'
type AuditEventType =
  | 'user.login'
  | 'user.logout'
  | 'user.created'
  | 'user.updated'
  | 'user.deleted'
  | 'partner.created'
  | 'partner.updated'
  | 'partner.deleted'
  | 'acl.changed'
  | 'settings.changed'
  | 'api.key_created'
  | 'api.key_deleted'

type AuditEvent = {
  id: string
  timestamp: string
  level: AuditLogLevel
  event_type: AuditEventType
  actor: {
    id: string
    name: string
    email: string
    ip_address?: string
    user_agent?: string
  }
  target: {
    type: string
    id: string
    name: string
  }
  changes: {
    before: Record<string, any> | null
    after: Record<string, any> | null
  } | null
  metadata: {
    description: string
    footprints: {
      browser?: string
      os?: string
      device?: string
      location?: string
    }
  }
}

const levelVariantMap: Record<AuditLogLevel, "default" | "secondary" | "destructive" | "outline"> = {
  info: 'default',
  warning: 'outline',
  error: 'destructive',
  critical: 'destructive',
}

const levelLabelMap: Record<AuditLogLevel, string> = {
  info: 'Info',
  warning: 'Warning',
  error: 'Error',
  critical: 'Critical',
}

const eventLabelMap: Record<AuditEventType, string> = {
  'user.login': 'User Login',
  'user.logout': 'User Logout',
  'user.created': 'User Created',
  'user.updated': 'User Updated',
  'user.deleted': 'User Deleted',
  'partner.created': 'Partner Created',
  'partner.updated': 'Partner Updated',
  'partner.deleted': 'Partner Deleted',
  'acl.changed': 'ACL Changed',
  'settings.changed': 'Settings Changed',
  'api.key_created': 'API Key Created',
  'api.key_deleted': 'API Key Deleted',
}

// Mock audit log data
const mockAuditLogs: AuditEvent[] = [
  {
    id: '1',
    timestamp: '2025-01-03T10:30:00Z',
    level: 'info',
    event_type: 'user.login',
    actor: {
      id: 'u1',
      name: 'John Smith',
      email: 'john@company.com',
      ip_address: '192.168.1.100',
      user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    },
    target: {
      type: 'system',
      id: 'system',
      name: 'Dashboard',
    },
    changes: null,
    metadata: {
      description: 'User logged into the dashboard',
      footprints: {
        browser: 'Chrome 120',
        os: 'macOS 14.2',
        device: 'Desktop',
        location: 'San Francisco, CA',
      },
    },
  },
  {
    id: '2',
    timestamp: '2025-01-03T10:25:00Z',
    level: 'warning',
    event_type: 'partner.updated',
    actor: {
      id: 'u2',
      name: 'Sarah Johnson',
      email: 'sarah@company.com',
      ip_address: '192.168.1.101',
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
    target: {
      type: 'partner',
      id: 'p1',
      name: 'TechGlobal Inc.',
    },
    changes: {
      before: {
        status: 'active',
        email: 'contact@techglobal.com',
      },
      after: {
        status: 'pending',
        email: 'updated@techglobal.com',
      },
    },
    metadata: {
      description: 'Partner status and email were updated',
      footprints: {
        browser: 'Edge 120',
        os: 'Windows 11',
        device: 'Desktop',
        location: 'New York, NY',
      },
    },
  },
  {
    id: '3',
    timestamp: '2025-01-03T10:20:00Z',
    level: 'error',
    event_type: 'acl.changed',
    actor: {
      id: 'u3',
      name: 'Mike Chen',
      email: 'mike@company.com',
      ip_address: '192.168.1.102',
    },
    target: {
      type: 'acl',
      id: 'acl1',
      name: 'Partner Access Control',
    },
    changes: {
      before: {
        permissions: ['read', 'write'],
        resources: ['partners/*'],
      },
      after: {
        permissions: ['read', 'write', 'delete'],
        resources: ['partners/*', 'users/*'],
      },
    },
    metadata: {
      description: 'ACL permissions were modified - delete access granted',
      footprints: {
        browser: 'Firefox 121',
        os: 'Ubuntu 22.04',
        device: 'Desktop',
        location: 'Austin, TX',
      },
    },
  },
  {
    id: '4',
    timestamp: '2025-01-03T10:15:00Z',
    level: 'info',
    event_type: 'api.key_created',
    actor: {
      id: 'u1',
      name: 'John Smith',
      email: 'john@company.com',
    },
    target: {
      type: 'api_key',
      id: 'key123',
      name: 'Production API Key',
    },
    changes: {
      before: null,
      after: {
        key: 'sk_live_...xyz',
        scopes: ['read', 'write'],
        expires_at: '2025-02-03T10:15:00Z',
      },
    },
    metadata: {
      description: 'New API key was generated',
      footprints: {
        browser: 'Chrome 120',
        os: 'macOS 14.2',
        device: 'Desktop',
      },
    },
  },
  {
    id: '5',
    timestamp: '2025-01-03T10:10:00Z',
    level: 'critical',
    event_type: 'user.deleted',
    actor: {
      id: 'u4',
      name: 'Lisa Park',
      email: 'lisa@company.com',
      ip_address: '192.168.1.103',
    },
    target: {
      type: 'user',
      id: 'u999',
      name: 'Former Employee',
    },
    changes: {
      before: {
        id: 'u999',
        name: 'Former Employee',
        email: 'former@company.com',
        role: 'manager',
        status: 'active',
      },
      after: null,
    },
    metadata: {
      description: 'User account was permanently deleted',
      footprints: {
        browser: 'Safari 17',
        os: 'macOS 14.2',
        device: 'Desktop',
        location: 'Seattle, WA',
      },
    },
  },
  {
    id: '6',
    timestamp: '2025-01-03T10:05:00Z',
    level: 'info',
    event_type: 'partner.created',
    actor: {
      id: 'u2',
      name: 'Sarah Johnson',
      email: 'sarah@company.com',
    },
    target: {
      type: 'partner',
      id: 'p10',
      name: 'NewStart Ventures',
    },
    changes: {
      before: null,
      after: {
        name: 'NewStart Ventures',
        type: 'external',
        status: 'pending',
        email: 'contact@newstart.com',
        products: ['sponsored-ads'],
      },
    },
    metadata: {
      description: 'New partner was created',
      footprints: {
        browser: 'Edge 120',
        os: 'Windows 11',
        device: 'Desktop',
        location: 'Chicago, IL',
      },
    },
  },
  {
    id: '7',
    timestamp: '2025-01-03T10:00:00Z',
    level: 'warning',
    event_type: 'settings.changed',
    actor: {
      id: 'u6',
      name: 'Emily Davis',
      email: 'emily@company.com',
    },
    target: {
      type: 'settings',
      id: 'global',
      name: 'Global Settings',
    },
    changes: {
      before: {
        session_timeout: 30,
        max_login_attempts: 5,
      },
      after: {
        session_timeout: 60,
        max_login_attempts: 3,
      },
    },
    metadata: {
      description: 'Security settings were modified',
      footprints: {
        browser: 'Chrome 120',
        os: 'Windows 10',
        device: 'Desktop',
      },
    },
  },
  {
    id: '8',
    timestamp: '2025-01-03T09:55:00Z',
    level: 'info',
    event_type: 'user.logout',
    actor: {
      id: 'u1',
      name: 'John Smith',
      email: 'john@company.com',
    },
    target: {
      type: 'system',
      id: 'system',
      name: 'Dashboard',
    },
    changes: null,
    metadata: {
      description: 'User logged out from the dashboard',
      footprints: {
        browser: 'Chrome 120',
        os: 'macOS 14.2',
        device: 'Desktop',
      },
    },
  },
]

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

function formatJson(obj: any): string {
  return JSON.stringify(obj, null, 2)
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditEvent[]>(mockAuditLogs)
  const [selectedLog, setSelectedLog] = useState<AuditEvent | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [levelFilter, setLevelFilter] = useState<AuditLogLevel | 'all'>('all')
  const [eventFilter, setEventFilter] = useState<AuditEventType | 'all'>('all')
  const [expandedChanges, setExpandedChanges] = useState<Record<string, boolean>>({})

  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      searchQuery === '' ||
      log.actor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.target.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.metadata.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesLevel = levelFilter === 'all' || log.level === levelFilter
    const matchesEvent = eventFilter === 'all' || log.event_type === eventFilter

    return matchesSearch && matchesLevel && matchesEvent
  })

  const handleViewDetails = (log: AuditEvent) => {
    setSelectedLog(log)
    setDetailDialogOpen(true)
  }

  const toggleExpandChanges = (logId: string) => {
    setExpandedChanges(prev => ({
      ...prev,
      [logId]: !prev[logId],
    }))
  }

  return (
    <div className="flex flex-col gap-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ShieldAlertIcon className="size-5" />
                Audit Logs
              </CardTitle>
              <CardDescription>
                Track all system events, changes, and user activities
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <FieldGroup className="mb-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Field className="flex-1">
                <FieldLabel>Search</FieldLabel>
                <FieldContent>
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by user, target, or description..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </FieldContent>
              </Field>

              <Field className="sm:w-[180px]">
                <FieldLabel>Level</FieldLabel>
                <FieldContent>
                  <Select
                    value={levelFilter}
                    onValueChange={(value: AuditLogLevel | 'all') => setLevelFilter(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldContent>
              </Field>

              <Field className="sm:w-[220px]">
                <FieldLabel>Event Type</FieldLabel>
                <FieldContent>
                  <Select
                    value={eventFilter}
                    onValueChange={(value: AuditEventType | 'all') => setEventFilter(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Events</SelectItem>
                      <SelectItem value="user.login">User Login</SelectItem>
                      <SelectItem value="user.logout">User Logout</SelectItem>
                      <SelectItem value="user.created">User Created</SelectItem>
                      <SelectItem value="user.updated">User Updated</SelectItem>
                      <SelectItem value="user.deleted">User Deleted</SelectItem>
                      <SelectItem value="partner.created">Partner Created</SelectItem>
                      <SelectItem value="partner.updated">Partner Updated</SelectItem>
                      <SelectItem value="partner.deleted">Partner Deleted</SelectItem>
                      <SelectItem value="acl.changed">ACL Changed</SelectItem>
                      <SelectItem value="settings.changed">Settings Changed</SelectItem>
                      <SelectItem value="api.key_created">API Key Created</SelectItem>
                      <SelectItem value="api.key_deleted">API Key Deleted</SelectItem>
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
                  <TableHead className="w-[100px]">Time</TableHead>
                  <TableHead className="w-[90px]">Level</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <FilterIcon className="size-8" />
                        <p>No audit logs found matching your filters</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-muted-foreground text-xs">
                        {formatTimestamp(log.timestamp)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={levelVariantMap[log.level]}>
                          {levelLabelMap[log.level]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-sm">
                          {eventLabelMap[log.event_type]}
                        </div>
                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {log.metadata.description}
                        </div>
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
                        <div>
                          <div className="text-sm font-medium">{log.target.name}</div>
                          <div className="text-xs text-muted-foreground capitalize">{log.target.type}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleViewDetails(log)}
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

          {filteredLogs.length > 0 && (
            <div className="flex items-center justify-between text-xs text-muted-foreground mt-4">
              <span>Showing {filteredLogs.length} of {logs.length} logs</span>
              <span>Oldest records retained for 90 days</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedLog && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>Audit Log Details</span>
                  <Badge variant={levelVariantMap[selectedLog.level]}>
                    {levelLabelMap[selectedLog.level]}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  {eventLabelMap[selectedLog.event_type]} - {selectedLog.id}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Timestamp */}
                <div>
                  <div className="text-sm font-medium mb-1">Timestamp</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(selectedLog.timestamp).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      timeZoneName: 'short',
                    })}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <div className="text-sm font-medium mb-1">Description</div>
                  <div className="text-sm text-muted-foreground">
                    {selectedLog.metadata.description}
                  </div>
                </div>

                {/* Actor */}
                <div className="border rounded-lg p-3">
                  <div className="text-sm font-medium mb-2 flex items-center gap-2">
                    <UserIcon className="size-4" />
                    Actor (Who made the change)
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Name: </span>
                      {selectedLog.actor.name}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Email: </span>
                      {selectedLog.actor.email}
                    </div>
                    {selectedLog.actor.ip_address && (
                      <div>
                        <span className="text-muted-foreground">IP Address: </span>
                        {selectedLog.actor.ip_address}
                      </div>
                    )}
                    {selectedLog.actor.user_agent && (
                      <div className="col-span-2">
                        <span className="text-muted-foreground">User Agent: </span>
                        <span className="text-xs break-all">{selectedLog.actor.user_agent}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Target */}
                <div className="border rounded-lg p-3">
                  <div className="text-sm font-medium mb-2">Target (What was affected)</div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Type: </span>
                      <span className="capitalize">{selectedLog.target.type}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">ID: </span>
                      {selectedLog.target.id}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Name: </span>
                      {selectedLog.target.name}
                    </div>
                  </div>
                </div>

                {/* User Footprint */}
                {selectedLog.metadata.footprints && (
                  <div className="border rounded-lg p-3">
                    <div className="text-sm font-medium mb-2">User Footprint</div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                      {selectedLog.metadata.footprints.browser && (
                        <div>
                          <span className="text-muted-foreground">Browser: </span>
                          {selectedLog.metadata.footprints.browser}
                        </div>
                      )}
                      {selectedLog.metadata.footprints.os && (
                        <div>
                          <span className="text-muted-foreground">OS: </span>
                          {selectedLog.metadata.footprints.os}
                        </div>
                      )}
                      {selectedLog.metadata.footprints.device && (
                        <div>
                          <span className="text-muted-foreground">Device: </span>
                          {selectedLog.metadata.footprints.device}
                        </div>
                      )}
                      {selectedLog.metadata.footprints.location && (
                        <div>
                          <span className="text-muted-foreground">Location: </span>
                          {selectedLog.metadata.footprints.location}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Changes */}
                {selectedLog.changes && (
                  <div className="border rounded-lg p-3">
                    <div
                      className="text-sm font-medium mb-2 cursor-pointer flex items-center gap-1 hover:text-primary"
                      onClick={() => toggleExpandChanges(selectedLog.id)}
                    >
                      {expandedChanges[selectedLog.id] ? (
                        <ChevronDownIcon className="size-4" />
                      ) : (
                        <ChevronRightIcon className="size-4" />
                      )}
                      Changes (Before vs After)
                    </div>
                    {expandedChanges[selectedLog.id] && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                        <div>
                          <div className="text-xs font-medium mb-1 text-muted-foreground">Before</div>
                          <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                                {selectedLog.changes.before
                                  ? formatJson(selectedLog.changes.before)
                                  : 'null'}
                              </pre>
                        </div>
                        <div>
                          <div className="text-xs font-medium mb-1 text-muted-foreground">After</div>
                          <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                                {selectedLog.changes.after
                                  ? formatJson(selectedLog.changes.after)
                                  : 'null'}
                              </pre>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel, FieldContent } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { ArrowLeft, BarChart3, Settings, Calendar, FileText, Eye, Plus, Pencil, Trash2, Play, Pause } from 'lucide-react'
import { format } from 'date-fns'

type Schedule = {
    id: number
    name: string
    startTime: string
    endTime: string
    days: string[]
    status: 'active' | 'paused'
    cpc: number
    spend: number
    balance: number
}

// Mock ad data
const mockAdData = {
    id: '1',
    name: 'Summer Sale Campaign 2024',
    partner: 'Partner 1',
    partnerId: 1,
    title: 'Ad Title 1',
    placement: 'Homepage Banner',
    nickname: 'Summer Banner',
    uniqueId: 'ID-ABC123',
    status: 'active',
    country: 'US',
    dailyBudget: 150.00,
    description: 'Promotional campaign for summer sale with special discounts on all products.',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15',
}

// Mock stats data
const mockStatsData = [
    { date: '01/09/2026', impressions: 45230, clicks: 1234, ctr: 2.73, revenue: 245.67 },
    { date: '01/10/2026', impressions: 48120, clicks: 1456, ctr: 3.03, revenue: 298.45 },
    { date: '01/11/2026', impressions: 44560, clicks: 1189, ctr: 2.67, revenue: 212.34 },
    { date: '01/12/2026', impressions: 51230, clicks: 1567, ctr: 3.06, revenue: 312.56 },
    { date: '01/13/2026', impressions: 47890, clicks: 1345, ctr: 2.81, revenue: 267.89 },
    { date: '01/14/2026', impressions: 49340, clicks: 1423, ctr: 2.88, revenue: 278.90 },
    { date: '01/15/2026', impressions: 50670, clicks: 1523, ctr: 3.01, revenue: 301.23 },
]

// Default schedules data
const defaultSchedulesData: Schedule[] = [
    { id: 1, name: 'Morning Rush', startTime: '06:00', endTime: '10:00', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], status: 'active', cpc: 0.50, spend: 125.50, balance: 500.00 },
    { id: 2, name: 'Weekend Blast', startTime: '09:00', endTime: '23:59', days: ['Sat', 'Sun'], status: 'active', cpc: 0.75, spend: 340.25, balance: 250.00 },
    { id: 3, name: 'Evening Commute', startTime: '17:00', endTime: '20:00', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], status: 'paused', cpc: 0.45, spend: 87.30, balance: 1000.00 },
]

// Mock audit logs data
const mockAuditLogsData = [
    { id: 1, action: 'Status changed', details: 'Changed from paused to active', user: 'John Doe', timestamp: '2024-01-15 14:32:00' },
    { id: 2, action: 'Budget updated', details: 'Daily budget increased from $100 to $150', user: 'Jane Smith', timestamp: '2024-01-14 09:15:00' },
    { id: 3, action: 'Ad modified', details: 'Updated title and description', user: 'John Doe', timestamp: '2024-01-13 16:45:00' },
    { id: 4, action: 'Schedule added', details: 'Added new schedule: Morning Rush', user: 'Jane Smith', timestamp: '2024-01-12 11:20:00' },
    { id: 5, action: 'Created', details: 'Campaign created', user: 'John Doe', timestamp: '2024-01-01 08:00:00' },
]

const countries = [
    { value: 'US', label: 'United States' },
    { value: 'UK', label: 'United Kingdom' },
    { value: 'CA', label: 'Canada' },
    { value: 'AU', label: 'Australia' },
    { value: 'DE', label: 'Germany' },
    { value: 'FR', label: 'France' },
    { value: 'JP', label: 'Japan' },
    { value: 'IN', label: 'India' },
]

const statuses = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' },
    { value: 'paused', label: 'Paused' },
]

const weekDays = [
    { value: 'Mon', label: 'Monday' },
    { value: 'Tue', label: 'Tuesday' },
    { value: 'Wed', label: 'Wednesday' },
    { value: 'Thu', label: 'Thursday' },
    { value: 'Fri', label: 'Friday' },
    { value: 'Sat', label: 'Saturday' },
    { value: 'Sun', label: 'Sunday' },
]

export default function SponsoredAdDetailsPage() {
    const params = useParams()
    const adId = params.id as string

    const [formData, setFormData] = useState({
        name: mockAdData.name,
        partner: mockAdData.partnerId.toString(),
        title: mockAdData.title,
        placement: mockAdData.placement,
        nickname: mockAdData.nickname,
        country: mockAdData.country,
        status: mockAdData.status,
        dailyBudget: mockAdData.dailyBudget.toString(),
        description: mockAdData.description,
    })

    const [isSaving, setIsSaving] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    // Schedule state
    const [schedules, setSchedules] = useState<Record<number, Schedule>>(() => {
        const record: Record<number, Schedule> = {}
        defaultSchedulesData.forEach(s => record[s.id] = s)
        return record
    })
    const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false)
    const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null)
    const [scheduleForm, setScheduleForm] = useState({
        name: '',
        startTime: '09:00',
        endTime: '17:00',
        days: [] as string[],
        status: 'active' as 'active' | 'paused',
        cpc: '0.50',
        spend: '0.00',
        balance: '0.00',
    })
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [scheduleToDelete, setScheduleToDelete] = useState<number | null>(null)

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false)
        }, 500)
    }, [adId])

    const handleSave = async () => {
        setIsSaving(true)
        await new Promise(resolve => setTimeout(resolve, 1000))
        setIsSaving(false)
    }

    // Schedule handlers
    const openAddSchedule = () => {
        setEditingSchedule(null)
        setScheduleForm({
            name: '',
            startTime: '09:00',
            endTime: '17:00',
            days: [],
            status: 'active',
            cpc: '0.50',
            spend: '0.00',
            balance: '0.00',
        })
        setScheduleDialogOpen(true)
    }

    const openEditSchedule = (schedule: Schedule) => {
        setEditingSchedule(schedule)
        setScheduleForm({
            name: schedule.name,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            days: [...schedule.days],
            status: schedule.status,
            cpc: schedule.cpc.toString(),
            spend: schedule.spend.toString(),
            balance: schedule.balance.toString(),
        })
        setScheduleDialogOpen(true)
    }

    const handleSaveSchedule = () => {
        if (editingSchedule) {
            // Update existing
            setSchedules(prev => ({
                ...prev,
                [editingSchedule.id]: {
                    ...editingSchedule,
                    name: scheduleForm.name,
                    startTime: scheduleForm.startTime,
                    endTime: scheduleForm.endTime,
                    days: scheduleForm.days,
                    status: scheduleForm.status,
                    cpc: parseFloat(scheduleForm.cpc) || 0,
                    spend: parseFloat(scheduleForm.spend) || 0,
                    balance: parseFloat(scheduleForm.balance) || 0,
                },
            }))
        } else {
            // Add new
            const newId = Math.max(...Object.keys(schedules).map(Number), 0) + 1
            setSchedules(prev => ({
                ...prev,
                [newId]: {
                    id: newId,
                    name: scheduleForm.name,
                    startTime: scheduleForm.startTime,
                    endTime: scheduleForm.endTime,
                    days: scheduleForm.days,
                    status: scheduleForm.status,
                    cpc: parseFloat(scheduleForm.cpc) || 0,
                    spend: parseFloat(scheduleForm.spend) || 0,
                    balance: parseFloat(scheduleForm.balance) || 0,
                },
            }))
        }
        setScheduleDialogOpen(false)
        setEditingSchedule(null)
    }

    const openDeleteSchedule = (id: number) => {
        setScheduleToDelete(id)
        setDeleteDialogOpen(true)
    }

    const handleDeleteSchedule = () => {
        if (scheduleToDelete) {
            setSchedules(prev => {
                const newSchedules = { ...prev }
                delete newSchedules[scheduleToDelete]
                return newSchedules
            })
        }
        setDeleteDialogOpen(false)
        setScheduleToDelete(null)
    }

    const toggleScheduleStatus = (id: number) => {
        setSchedules(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                status: prev[id].status === 'active' ? 'paused' : 'active',
            },
        }))
    }

    const toggleDay = (dayValue: string) => {
        setScheduleForm(prev => ({
            ...prev,
            days: prev.days.includes(dayValue)
                ? prev.days.filter(d => d !== dayValue)
                : [...prev.days, dayValue],
        }))
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-muted-foreground">Loading ad details...</div>
            </div>
        )
    }

    const scheduleList = Object.values(schedules)

    return (
        <div className="flex flex-col gap-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/ads/sponsored">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="size-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-lg font-semibold">{mockAdData.name}</h1>
                        <p className="text-sm text-muted-foreground">
                            ID: {mockAdData.uniqueId} • Partner: {mockAdData.partner}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Badge
                        variant={mockAdData.status === 'active' ? 'default' : mockAdData.status === 'paused' ? 'destructive' : 'secondary'}
                    >
                        {mockAdData.status}
                    </Badge>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Tabbed Sections */}
                <div className="lg:col-span-2">
                    <Tabs defaultValue="stats" className="space-y-4">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="stats">
                                <BarChart3 className="h-4 w-4 mr-2" />
                                Stats
                            </TabsTrigger>
                            <TabsTrigger value="settings">
                                <Settings className="h-4 w-4 mr-2" />
                                Settings
                            </TabsTrigger>
                            <TabsTrigger value="schedules">
                                <Calendar className="h-4 w-4 mr-2" />
                                Schedules
                            </TabsTrigger>
                            <TabsTrigger value="audit-logs">
                                <FileText className="h-4 w-4 mr-2" />
                                Audit Logs
                            </TabsTrigger>
                        </TabsList>

                        {/* Stats Tab */}
                        <TabsContent value="stats">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Performance Stats</CardTitle>
                                    <CardDescription>View your ad&apos;s performance metrics over time</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                        <div className="border rounded-lg p-4">
                                            <div className="text-sm text-muted-foreground">Total Impressions</div>
                                            <div className="text-2xl font-bold">
                                                {mockStatsData.reduce((acc, row) => acc + row.impressions, 0).toLocaleString()}
                                            </div>
                                        </div>
                                        <div className="border rounded-lg p-4">
                                            <div className="text-sm text-muted-foreground">Total Clicks</div>
                                            <div className="text-2xl font-bold">
                                                {mockStatsData.reduce((acc, row) => acc + row.clicks, 0).toLocaleString()}
                                            </div>
                                        </div>
                                        <div className="border rounded-lg p-4">
                                            <div className="text-sm text-muted-foreground">Avg CTR</div>
                                            <div className="text-2xl font-bold">
                                                {(mockStatsData.reduce((acc, row) => acc + row.ctr, 0) / mockStatsData.length).toFixed(2)}%
                                            </div>
                                        </div>
                                        <div className="border rounded-lg p-4">
                                            <div className="text-sm text-muted-foreground">Total Revenue</div>
                                            <div className="text-2xl font-bold">
                                                ${mockStatsData.reduce((acc, row) => acc + row.revenue, 0).toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Impressions</TableHead>
                                                <TableHead>Clicks</TableHead>
                                                <TableHead>CTR</TableHead>
                                                <TableHead>Revenue</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {mockStatsData.map((stat, idx) => (
                                                <TableRow key={idx}>
                                                    <TableCell>{stat.date}</TableCell>
                                                    <TableCell>{stat.impressions.toLocaleString()}</TableCell>
                                                    <TableCell>{stat.clicks.toLocaleString()}</TableCell>
                                                    <TableCell>{stat.ctr}%</TableCell>
                                                    <TableCell>${stat.revenue.toFixed(2)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Settings Tab */}
                        <TabsContent value="settings">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Ad Settings</CardTitle>
                                    <CardDescription>Manage your ad configuration and targeting</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <Field>
                                                <FieldLabel>Name *</FieldLabel>
                                                <FieldContent>
                                                    <Input
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        placeholder="Enter ad name"
                                                    />
                                                </FieldContent>
                                            </Field>

                                            <Field>
                                                <FieldLabel>Partner *</FieldLabel>
                                                <FieldContent>
                                                    <Select
                                                        value={formData.partner}
                                                        onValueChange={(value) => setFormData({ ...formData, partner: value })}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="1">Partner 1</SelectItem>
                                                            <SelectItem value="2">Partner 2</SelectItem>
                                                            <SelectItem value="3">Partner 3</SelectItem>
                                                            <SelectItem value="4">Partner 4</SelectItem>
                                                            <SelectItem value="5">Partner 5</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </FieldContent>
                                            </Field>

                                            <Field>
                                                <FieldLabel>Title</FieldLabel>
                                                <FieldContent>
                                                    <Input
                                                        value={formData.title}
                                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                        placeholder="Enter ad title"
                                                    />
                                                </FieldContent>
                                            </Field>

                                            <Field>
                                                <FieldLabel>Nickname</FieldLabel>
                                                <FieldContent>
                                                    <Input
                                                        value={formData.nickname}
                                                        onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                                                        placeholder="Enter nickname"
                                                    />
                                                </FieldContent>
                                            </Field>

                                            <Field>
                                                <FieldLabel>Placement</FieldLabel>
                                                <FieldContent>
                                                    <Input
                                                        value={formData.placement}
                                                        onChange={(e) => setFormData({ ...formData, placement: e.target.value })}
                                                        placeholder="Enter placement"
                                                    />
                                                </FieldContent>
                                            </Field>
                                        </div>

                                        <div className="space-y-4">
                                            <Field>
                                                <FieldLabel>Status</FieldLabel>
                                                <FieldContent>
                                                    <Select
                                                        value={formData.status}
                                                        onValueChange={(value) => setFormData({ ...formData, status: value })}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {statuses.map((status) => (
                                                                <SelectItem key={status.value} value={status.value}>
                                                                    {status.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FieldContent>
                                            </Field>

                                            <Field>
                                                <FieldLabel>Country</FieldLabel>
                                                <FieldContent>
                                                    <Select
                                                        value={formData.country}
                                                        onValueChange={(value) => setFormData({ ...formData, country: value })}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {countries.map((country) => (
                                                                <SelectItem key={country.value} value={country.value}>
                                                                    {country.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FieldContent>
                                            </Field>

                                            <Field>
                                                <FieldLabel>Daily Budget</FieldLabel>
                                                <FieldContent>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        value={formData.dailyBudget}
                                                        onChange={(e) => setFormData({ ...formData, dailyBudget: e.target.value })}
                                                        placeholder="0.00"
                                                    />
                                                </FieldContent>
                                            </Field>

                                            <Field>
                                                <FieldLabel>Description</FieldLabel>
                                                <FieldContent>
                                                    <Textarea
                                                        value={formData.description}
                                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                        placeholder="Enter ad description"
                                                        rows={4}
                                                    />
                                                </FieldContent>
                                            </Field>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Schedules Tab */}
                        <TabsContent value="schedules">
                            <Card>
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <CardTitle>Ad Schedules</CardTitle>
                                            <CardDescription>Manage when your ads are displayed</CardDescription>
                                        </div>
                                        <Button onClick={openAddSchedule} size="sm">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Schedule
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {scheduleList.length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground">
                                            No schedules configured. Click "Add Schedule" to create one.
                                        </div>
                                    ) : (
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Name</TableHead>
                                                    <TableHead>Start Time</TableHead>
                                                    <TableHead>End Time</TableHead>
                                                    <TableHead>Days</TableHead>
                                                    <TableHead>CPC</TableHead>
                                                    <TableHead>Spend</TableHead>
                                                    <TableHead>Balance</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {scheduleList.map((schedule) => (
                                                    <TableRow key={schedule.id}>
                                                        <TableCell className="font-medium">{schedule.name}</TableCell>
                                                        <TableCell>{schedule.startTime}</TableCell>
                                                        <TableCell>{schedule.endTime}</TableCell>
                                                        <TableCell>{schedule.days.join(', ')}</TableCell>
                                                        <TableCell>${schedule.cpc.toFixed(2)}</TableCell>
                                                        <TableCell>${schedule.spend.toFixed(2)}</TableCell>
                                                        <TableCell>${schedule.balance.toFixed(2)}</TableCell>
                                                        <TableCell>
                                                            <Badge variant={schedule.status === 'active' ? 'default' : 'secondary'}>
                                                                {schedule.status}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => toggleScheduleStatus(schedule.id)}
                                                                    title={schedule.status === 'active' ? 'Pause' : 'Activate'}
                                                                >
                                                                    {schedule.status === 'active' ? (
                                                                        <Pause className="h-4 w-4" />
                                                                    ) : (
                                                                        <Play className="h-4 w-4" />
                                                                    )}
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => openEditSchedule(schedule)}
                                                                    title="Edit"
                                                                >
                                                                    <Pencil className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => openDeleteSchedule(schedule.id)}
                                                                    title="Delete"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Audit Logs Tab */}
                        <TabsContent value="audit-logs">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Audit Logs</CardTitle>
                                    <CardDescription>Track all changes made to this ad</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Action</TableHead>
                                                <TableHead>Details</TableHead>
                                                <TableHead>User</TableHead>
                                                <TableHead>Timestamp</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {mockAuditLogsData.map((log) => (
                                                <TableRow key={log.id}>
                                                    <TableCell className="font-medium">{log.action}</TableCell>
                                                    <TableCell>{log.details}</TableCell>
                                                    <TableCell>{log.user}</TableCell>
                                                    <TableCell className="text-muted-foreground">{log.timestamp}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Right Column - Ad Preview (Fixed) */}
                <div className="lg:col-span-1">
                    <div className="sticky top-4 space-y-4">
                        {/* Ad Preview Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Eye className="h-4 w-4" />
                                    Ad Preview
                                </CardTitle>
                                <CardDescription>See how your ad will appear</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="border rounded-lg p-6 bg-muted/50 space-y-3">
                                    <div className="text-lg font-bold text-center">{formData.title}</div>
                                    <div className="text-sm text-center text-muted-foreground">{formData.nickname}</div>
                                    <div className="text-xs text-center text-muted-foreground">{formData.description}</div>
                                    <Button className="w-full" size="sm">Click Here</Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Settings Overview Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Settings Overview</CardTitle>
                                <CardDescription>Quick summary of current configuration</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Name:</span>
                                        <span className="font-medium">{formData.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Status:</span>
                                        <Badge variant={formData.status === 'active' ? 'default' : 'secondary'}>
                                            {formData.status}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Country:</span>
                                        <span className="font-medium">{countries.find(c => c.value === formData.country)?.label}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Daily Budget:</span>
                                        <span className="font-medium">${formData.dailyBudget}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Placement:</span>
                                        <span className="font-medium">{formData.placement}</span>
                                    </div>
                                    <div className="pt-2 border-t">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Created:</span>
                                            <span className="font-medium">{format(new Date(mockAdData.createdAt), 'MMM dd, yyyy')}</span>
                                        </div>
                                        <div className="flex justify-between mt-2">
                                            <span className="text-muted-foreground">Last Updated:</span>
                                            <span className="font-medium">{format(new Date(mockAdData.updatedAt), 'MMM dd, yyyy')}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Add/Edit Schedule Dialog */}
            <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{editingSchedule ? 'Edit Schedule' : 'Add New Schedule'}</DialogTitle>
                        <DialogDescription>
                            {editingSchedule ? 'Update the schedule configuration' : 'Configure when your ads should be displayed'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <Field>
                            <FieldLabel>Schedule Name *</FieldLabel>
                            <FieldContent>
                                <Input
                                    value={scheduleForm.name}
                                    onChange={(e) => setScheduleForm({ ...scheduleForm, name: e.target.value })}
                                    placeholder="e.g., Morning Rush"
                                />
                            </FieldContent>
                        </Field>

                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel>Start Time *</FieldLabel>
                                <FieldContent>
                                    <Input
                                        type="time"
                                        value={scheduleForm.startTime}
                                        onChange={(e) => setScheduleForm({ ...scheduleForm, startTime: e.target.value })}
                                    />
                                </FieldContent>
                            </Field>

                            <Field>
                                <FieldLabel>End Time *</FieldLabel>
                                <FieldContent>
                                    <Input
                                        type="time"
                                        value={scheduleForm.endTime}
                                        onChange={(e) => setScheduleForm({ ...scheduleForm, endTime: e.target.value })}
                                    />
                                </FieldContent>
                            </Field>
                        </div>

                        <Field>
                            <FieldLabel>Days *</FieldLabel>
                            <FieldContent>
                                <div className="flex flex-wrap gap-2">
                                    {weekDays.map((day) => (
                                        <button
                                            key={day.value}
                                            type="button"
                                            onClick={() => toggleDay(day.value)}
                                            className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                                                scheduleForm.days.includes(day.value)
                                                    ? 'bg-primary text-primary-foreground border-primary'
                                                    : 'bg-background hover:bg-muted border-border'
                                            }`}
                                        >
                                            {day.label.slice(0, 3)}
                                        </button>
                                    ))}
                                </div>
                                {scheduleForm.days.length === 0 && (
                                    <p className="text-sm text-destructive mt-1">Please select at least one day</p>
                                )}
                            </FieldContent>
                        </Field>

                        <div className="grid grid-cols-3 gap-4">
                            <Field>
                                <FieldLabel>CPC</FieldLabel>
                                <FieldContent>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={scheduleForm.cpc}
                                        onChange={(e) => setScheduleForm({ ...scheduleForm, cpc: e.target.value })}
                                        placeholder="0.00"
                                    />
                                </FieldContent>
                            </Field>

                            <Field>
                                <FieldLabel>Spend</FieldLabel>
                                <FieldContent>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={scheduleForm.spend}
                                        onChange={(e) => setScheduleForm({ ...scheduleForm, spend: e.target.value })}
                                        placeholder="0.00"
                                    />
                                </FieldContent>
                            </Field>

                            <Field>
                                <FieldLabel>Balance</FieldLabel>
                                <FieldContent>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={scheduleForm.balance}
                                        onChange={(e) => setScheduleForm({ ...scheduleForm, balance: e.target.value })}
                                        placeholder="0.00"
                                    />
                                </FieldContent>
                            </Field>
                        </div>

                        <Field>
                            <FieldLabel>Status</FieldLabel>
                            <FieldContent>
                                <Select
                                    value={scheduleForm.status}
                                    onValueChange={(value: 'active' | 'paused') => setScheduleForm({ ...scheduleForm, status: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="paused">Paused</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FieldContent>
                        </Field>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setScheduleDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSaveSchedule}
                            disabled={!scheduleForm.name || scheduleForm.days.length === 0}
                        >
                            {editingSchedule ? 'Update Schedule' : 'Add Schedule'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Schedule</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this schedule? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteSchedule}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

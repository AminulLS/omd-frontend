'use client'

import { useParams, useRouter } from 'next/navigation'
import { HourlyChart } from '@/components/blocks/charts/hourly-chart'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FieldGroup } from '@/components/ui/field'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group'
import { ArrowLeft, Copy, Download, CalendarIcon, ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react'
import { format } from 'date-fns'
import * as React from 'react'

type DateRange = {
    from: Date | undefined
    to?: Date | undefined
}

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50, 100]

// Mock data generator for a single campaign
const generateMockCampaignDetails = (id: string) => {
    const types = ['email', 'sms', 'push', 'dtl', 'path', 'xml', 'display', 'other', 'search', 'serp', 'unknown']
    const randomType = types[Math.floor(Math.random() * types.length)]

    const clicks = Math.floor(Math.random() * 10000) + 1000
    const suspiciousClicks = Math.floor(Math.random() * clicks * 0.1)

    return {
        id: parseInt(id),
        feedId: parseInt(id),
        partnerId: Math.floor(Math.random() * 10) + 1,
        feed: `Feed ${id}`,
        partner: `Partner ${Math.floor(Math.random() * 10) + 1}`,
        origin: Math.random().toString(36).substring(2, 7).toUpperCase(),
        type: randomType,
        scrub: Math.round((Math.random() * 15) * 100) / 100,
        impressions: Math.floor(Math.random() * 500000) + 100000,
        clicks: clicks,
        uniqueClicks: Math.floor(clicks * (0.7 + Math.random() * 0.2)),
        billableClicks: Math.floor(clicks * (0.8 + Math.random() * 0.15)),
        suspiciousClicks: suspiciousClicks,
        suspiciousClickPercentage: Math.round((suspiciousClicks / clicks) * 10000) / 100,
        jobs: Math.floor(Math.random() * 50000) + 1000,
        avgCpc: Math.round((Math.random() * 2 + 0.5) * 100) / 100,
        ctr: Math.round((Math.random() * 5 + 1) * 100) / 100,
        rpm: Math.round((Math.random() * 10 + 5) * 100) / 100,
        conversion: Math.floor(Math.random() * 1000) + 100,
        conversionPercentage: Math.round((Math.random() * 10 + 1) * 100) / 100,
        revenue: Math.round((Math.random() * 50000 + 5000) * 100) / 100,
        agjSpend: Math.round((Math.random() * 30000 + 3000) * 100) / 100,
        cpa: Math.round((Math.random() * 50 + 10) * 100) / 100,
        status: Math.random() > 0.3 ? 'active' : 'paused',
        createdAt: format(new Date(2025, 11, 1), 'MM/dd/yyyy'),
        clicksHourly: [...Array(24)].map(() => Math.floor(Math.random() * 500)),
    }
}

// Generate hourly chart data
const generateHourlyData = () => {
    return [...Array(24)].map((_, h) => {
        const formatTime = (h: number) => `${h % 12 || 12}${h < 12 ? 'am' : 'pm'}`
        return {
            key: formatTime(h),
            fields: {
                today_revenue: Math.floor(Math.random() * 5000) + 1000,
                today_clicks: Math.floor(Math.random() * 2000) + 500,
                yesterday_revenue: Math.floor(Math.random() * 5000) + 1000,
                yesterday_clicks: Math.floor(Math.random() * 2000) + 500,
                sdlw_revenue: Math.floor(Math.random() * 5000) + 1000,
                sdlw_clicks: Math.floor(Math.random() * 2000) + 500,
            },
        }
    })
}

// Generate monthly data
const generateMonthlyData = () => {
    const daysInMonth = (month: number, year: number) => {
        return new Date(year, month + 1, 0).getDate()
    }
    const now = new Date()
    const currentMonthDays = daysInMonth(now.getMonth(), now.getFullYear())
    const lastMonthDays = daysInMonth(
        now.getMonth() - 1 < 0 ? 11 : now.getMonth() - 1,
        now.getMonth() - 1 < 0 ? now.getFullYear() - 1 : now.getFullYear(),
    )
    const data = []

    for (let i = 1; i <= currentMonthDays; i++) {
        data[i - 1] = {
            key: i.toString().padStart(2, '0'),
            fields: {
                current: Math.floor(Math.random() * 5000) + 1000,
                last: 0,
            },
        }
    }

    for (let i = 1; i <= lastMonthDays; i++) {
        if (!data[i - 1]) {
            data[i - 1] = {
                key: i.toString().padStart(2, '0'),
                fields: {
                    current: 0,
                    last: 0,
                },
            }
        }

        data[i - 1].fields.last = Math.floor(Math.random() * 5000) + 1000
    }

    return data
}

// Generate reports data for the campaign
const generateMockReportsData = (campaignId: string) => {
    return [...Array(100)].map((_, idx) => {
        const lsOptions = ['', 'yes', 'no']
        const randomLs = lsOptions[Math.floor(Math.random() * lsOptions.length)]

        const clicks = Math.floor(Math.random() * 5000) + 500
        const suspiciousClicks = Math.floor(Math.random() * clicks * 0.1)

        return {
            id: idx + 1,
            date: format(new Date(2026, 0, 1 + (idx % 30)), 'MM/dd/yyyy'),
            totalClicks: clicks,
            uniqueClicks: Math.floor(clicks * (0.7 + Math.random() * 0.2)),
            paidClicks: Math.floor(clicks * (0.8 + Math.random() * 0.15)),
            suspectedClicks: suspiciousClicks,
            cpc: Math.round((Math.random() * 2 + 0.5) * 100) / 100,
            conversion: Math.floor(Math.random() * 500) + 50,
            conversionPercentage: Math.round((Math.random() * 10 + 1) * 100) / 100,
            spend: Math.round((Math.random() * 5000 + 500) * 100) / 100,
            scrubPercentage: Math.round((Math.random() * 15) * 100) / 100,
            agjSpend: Math.round((Math.random() * 3000 + 300) * 100) / 100,
            lsNumbers: randomLs,
            clicksHourly: [...Array(24)].map(() => Math.floor(Math.random() * 200)),
        }
    })
}

const config = {
    today_revenue: {
        color: '#F96E5B',
        label: 'Today Revenue',
    },
    today_clicks: {
        color: '#FFE2AF',
        label: 'Today Clicks',
    },
    yesterday_revenue: {
        color: '#79C9C5',
        label: 'Yesterday Revenue',
    },
    yesterday_clicks: {
        color: '#3F9AAE',
        label: 'Yesterday Clicks',
    },
    sdlw_revenue: {
        color: '#BDE8F5',
        label: 'SDLW Revenue',
    },
    sdlw_clicks: {
        color: '#4988C4',
        label: 'SDLW Clicks',
    },
}

const configTwoMonth = {
    current: {
        color: 'var(--chart-2)',
        label: 'This Month',
    },
    last: {
        color: 'var(--chart-3)',
        label: 'Last Month',
    },
}

// HourlyBarChart component
interface HourlyBarChartProps {
    data: number[]
    maxBars?: number
}

function HourlyBarChart({ data, maxBars = 24 }: HourlyBarChartProps) {
    const max = Math.max(...data)
    const bars = data.slice(0, maxBars)

    return (
        <div className="flex items-end gap-0.5 h-4 w-full">
            {bars.map((value, idx) => (
                <div
                    key={idx}
                    className="flex-1 bg-primary/80 hover:bg-primary transition-colors"
                    style={{ height: `${(value / max) * 100}%` }}
                    title={`${idx}:00 - ${value} clicks`}
                />
            ))}
        </div>
    )
}

export default function CampaignDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string

    // Report state
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined)
    const [isCalendarOpen, setIsCalendarOpen] = React.useState(false)
    const [reportCurrentPage, setReportCurrentPage] = React.useState(1)
    const [reportItemsPerPage, setReportItemsPerPage] = React.useState(10)

    const [campaign, setCampaign] = React.useState<any>(null)
    const [hourlyData, setHourlyData] = React.useState<any[]>([])
    const [monthlyData, setMonthlyData] = React.useState<any[]>([])
    const [reportsData, setReportsData] = React.useState<any[]>([])

    React.useEffect(() => {
        // Simulate data fetching
        const details = generateMockCampaignDetails(id)
        setCampaign(details)
        setHourlyData(generateHourlyData())
        setMonthlyData(generateMonthlyData())
        setReportsData(generateMockReportsData(id))
    }, [id])

    // Reset to page 1 when items per page changes
    React.useEffect(() => {
        setReportCurrentPage(1)
    }, [reportItemsPerPage])

    // Filter reports data based on date range
    const filteredReportsData = React.useMemo(() => {
        if (!dateRange?.from) return reportsData

        return reportsData.filter((report) => {
            const reportDate = new Date(report.date)
            const fromDate = new Date(dateRange.from.setHours(0, 0, 0, 0))
            const toDate = dateRange.to ? new Date(dateRange.to.setHours(23, 59, 59, 999)) : fromDate

            return reportDate >= fromDate && reportDate <= toDate
        })
    }, [reportsData, dateRange])

    // Pagination for reports
    const reportTotalPages = Math.ceil(filteredReportsData.length / reportItemsPerPage)
    const reportStartIndex = (reportCurrentPage - 1) * reportItemsPerPage
    const reportEndIndex = reportStartIndex + reportItemsPerPage
    const paginatedReportsData = filteredReportsData.slice(reportStartIndex, reportEndIndex)

    if (!campaign) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-muted-foreground">Loading...</div>
            </div>
        )
    }

    const stats = [
        { label: 'Impressions', value: campaign.impressions.toLocaleString() },
        { label: 'Clicks', value: campaign.clicks.toLocaleString() },
        { label: 'Unique Clicks', value: campaign.uniqueClicks.toLocaleString() },
        { label: 'Billable Clicks', value: campaign.billableClicks.toLocaleString() },
        { label: 'Suspicious Clicks', value: campaign.suspiciousClicks.toLocaleString() },
        { label: 'Jobs', value: campaign.jobs.toLocaleString() },
    ]

    const metrics = [
        { label: 'Avg. CPC', value: `$${campaign.avgCpc.toFixed(2)}` },
        { label: 'CTR', value: `${campaign.ctr.toFixed(2)}%` },
        { label: 'RPM', value: `$${campaign.rpm.toFixed(2)}` },
        { label: 'Conversion', value: campaign.conversion.toLocaleString() },
        { label: 'Conversion %', value: `${campaign.conversionPercentage.toFixed(2)}%` },
        { label: 'CPA', value: `$${campaign.cpa.toFixed(2)}` },
        { label: 'Scrub', value: `${campaign.scrub.toFixed(2)}%` },
        { label: 'Susp. Click %', value: `${campaign.suspiciousClickPercentage.toFixed(2)}%` },
    ]

    const financials = [
        { label: 'Total Revenue', value: `$${campaign.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
        { label: 'AGJ Spend', value: `$${campaign.agjSpend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
        { label: 'Profit', value: `$${(campaign.revenue - campaign.agjSpend).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
    ]

    const formatDateRange = () => {
        if (!dateRange?.from) return 'Select range'
        if (!dateRange.to) return format(dateRange.from, 'MMM d, yyyy')
        return `${format(dateRange.from, 'MMM d, yyyy')} - ${format(dateRange.to, 'MMM d, yyyy')}`
    }

    // Helper function to format values
    const formatReportValue = (columnName: string, value: string | number | number[]): string => {
        if (Array.isArray(value)) {
            return '' // Handled separately by HourlyBarChart
        }

        if (typeof value === 'number') {
            const lowerCol = columnName.toLowerCase()

            // Currency fields
            if (lowerCol.includes('spend') || lowerCol.includes('cpc')) {
                return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            }

            // Percentage fields
            if (lowerCol.includes('%') || lowerCol.includes('percentage')) {
                return `${value.toFixed(2)}%`
            }

            // Clicks and conversions
            if (lowerCol.includes('click') || lowerCol.includes('conversion')) {
                return value.toLocaleString()
            }

            return value.toString()
        }

        return value
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-4 border-b pb-2">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <h2 className="text-lg font-semibold">{campaign.feed}</h2>
                            <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                                {campaign.status}
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Campaign ID: {campaign.id} • Partner: {campaign.partner} • Type: {campaign.type.toUpperCase()}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Clicks Log Download
                        </Button>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-4">
                    <div className="flex flex-col gap-4">
                        {/* Charts Row */}
                        <div className="flex gap-2">
                            {/* Hourly chart */}
                            <Card size="sm" className="w-2/3">
                                <CardHeader>
                                    <CardTitle>Recent Performance</CardTitle>
                                    <CardDescription>Revenue and clicks over time</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex justify-center gap-6 items-center mb-4">
                                        <div className="text-center">
                                            <div className="text-sm text-muted-foreground">Today Revenue</div>
                                            <div className="text-lg font-semibold">
                                                ${hourlyData.reduce((acc, curr) => acc + curr.fields.today_revenue, 0).toLocaleString()}
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-sm text-muted-foreground">Yesterday Revenue</div>
                                            <div className="text-lg font-semibold">
                                                ${hourlyData.reduce((acc, curr) => acc + curr.fields.yesterday_revenue, 0).toLocaleString()}
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-sm text-muted-foreground">SDLW Revenue</div>
                                            <div className="text-lg font-semibold">
                                                ${hourlyData.reduce((acc, curr) => acc + curr.fields.sdlw_revenue, 0).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                    <HourlyChart data={hourlyData} config={config} />
                                </CardContent>
                            </Card>

                            {/* Monthly Revenue */}
                            <Card size="sm" className="w-1/3">
                                <CardHeader>
                                    <CardTitle>Monthly Revenue</CardTitle>
                                    <CardDescription>This month vs last month</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="text-sm text-muted-foreground">This Month</div>
                                            <div className="text-2xl font-bold text-chart-2">
                                                ${monthlyData.reduce((acc, curr) => acc + curr.fields.current, 0).toLocaleString()}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-muted-foreground">Last Month</div>
                                            <div className="text-2xl font-bold text-chart-3">
                                                ${monthlyData.reduce((acc, curr) => acc + curr.fields.last, 0).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Reports Section */}
                        <Card size="sm">
                            <CardHeader>
                                <CardTitle>Campaign Reports</CardTitle>
                                <CardDescription>Detailed performance reports over time</CardDescription>
                                {/* Date Range Filter */}
                                <FieldGroup>
                                    <div className="flex flex-wrap gap-4">
                                        <div className="flex flex-col gap-2">
                                            <Label>Date Range</Label>
                                            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className="w-70 justify-start text-left font-normal"
                                                        type="button"
                                                    >
                                                        <CalendarIcon className="h-4 w-4 mr-2" />
                                                        {formatDateRange()}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="range"
                                                        selected={dateRange?.from && dateRange?.to ? {
                                                            from: dateRange.from,
                                                            to: dateRange.to
                                                        } : undefined}
                                                        onSelect={(range) => {
                                                            if (range?.from) {
                                                                setDateRange({
                                                                    from: range.from,
                                                                    to: range.to
                                                                })
                                                            }
                                                        }}
                                                        numberOfMonths={2}
                                                        initialFocus
                                                    />
                                                    <div className="p-3 border-t">
                                                        <div className="flex gap-2">
                                                            <Button
                                                                variant="outline"
                                                                className="flex-1"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setDateRange(undefined)
                                                                }}
                                                            >
                                                                Clear
                                                            </Button>
                                                            <Button
                                                                className="flex-1"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setIsCalendarOpen(false)
                                                                }}
                                                                disabled={!dateRange?.from}
                                                            >
                                                                Confirm
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </div>
                                </FieldGroup>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Total Clicks</TableHead>
                                            <TableHead>Unique Clicks</TableHead>
                                            <TableHead>Paid Clicks</TableHead>
                                            <TableHead>Suspected Clicks</TableHead>
                                            <TableHead>CPC</TableHead>
                                            <TableHead>Conversion</TableHead>
                                            <TableHead>Conversion %</TableHead>
                                            <TableHead>Spend</TableHead>
                                            <TableHead>Scrub %</TableHead>
                                            <TableHead>AGJ Spend</TableHead>
                                            <TableHead>LS #s</TableHead>
                                            <TableHead>Rate (Hourly)</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paginatedReportsData.length > 0 ? (
                                            paginatedReportsData.map((report) => (
                                                <TableRow key={report.id}>
                                                    <TableCell className="font-medium">{report.date}</TableCell>
                                                    <TableCell>{formatReportValue('Total Clicks', report.totalClicks)}</TableCell>
                                                    <TableCell>{formatReportValue('Unique Clicks', report.uniqueClicks)}</TableCell>
                                                    <TableCell>{formatReportValue('Paid Clicks', report.paidClicks)}</TableCell>
                                                    <TableCell>{formatReportValue('Suspected Clicks', report.suspectedClicks)}</TableCell>
                                                    <TableCell>{formatReportValue('CPC', report.cpc)}</TableCell>
                                                    <TableCell>{formatReportValue('Conversion', report.conversion)}</TableCell>
                                                    <TableCell>{formatReportValue('Conversion %', report.conversionPercentage)}</TableCell>
                                                    <TableCell>{formatReportValue('Spend', report.spend)}</TableCell>
                                                    <TableCell>{formatReportValue('Scrub %', report.scrubPercentage)}</TableCell>
                                                    <TableCell>{formatReportValue('AGJ Spend', report.agjSpend)}</TableCell>
                                                    <TableCell>{report.lsNumbers || '-'}</TableCell>
                                                    <TableCell className="min-w-25">
                                                        <HourlyBarChart data={report.clicksHourly} />
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={13} className="text-center text-muted-foreground py-8">
                                                    No reports found for the selected date range
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>

                                {/* Pagination */}
                                {filteredReportsData.length > 0 && (
                                    <div className="flex items-center justify-between p-4 border-t">
                                        <div className="flex items-center gap-4">
                                            <span className="text-xs text-muted-foreground">
                                                Showing {reportStartIndex + 1}-{Math.min(reportEndIndex, filteredReportsData.length)} of{' '}
                                                {filteredReportsData.length} results
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-muted-foreground">Rows per page:</span>
                                                <Select value={reportItemsPerPage.toString()} onValueChange={(v) => setReportItemsPerPage(Number(v))}>
                                                    <SelectTrigger className="h-7 w-17.5 text-xs">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                                                            <SelectItem key={option} value={option.toString()} className="text-xs">
                                                                {option}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                type="button"
                                                onClick={() => setReportCurrentPage((prev) => Math.max(1, prev - 1))}
                                                disabled={reportCurrentPage === 1}
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                                Previous
                                            </Button>

                                            {/* Page Numbers */}
                                            <div className="flex items-center gap-1">
                                                {Array.from({ length: reportTotalPages }, (_, i) => i + 1).map((page) => {
                                                    const showPage =
                                                        page === 1 ||
                                                        page === reportTotalPages ||
                                                        (page >= reportCurrentPage - 1 && page <= reportCurrentPage + 1)

                                                    if (!showPage) {
                                                        if (page === reportCurrentPage - 2 || page === reportCurrentPage + 2) {
                                                            return (
                                                                <span key={page} className="px-2 text-xs text-muted-foreground">
                                                                    ...
                                                                </span>
                                                            )
                                                        }
                                                        return null
                                                    }

                                                    return (
                                                        <Button
                                                            key={page}
                                                            variant={reportCurrentPage === page ? 'default' : 'outline'}
                                                            size="sm"
                                                            type="button"
                                                            onClick={() => setReportCurrentPage(page)}
                                                            className="min-w-8 px-2"
                                                        >
                                                            {page}
                                                        </Button>
                                                    )
                                                })}
                                            </div>

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                type="button"
                                                onClick={() => setReportCurrentPage((prev) => Math.min(reportTotalPages, prev + 1))}
                                                disabled={reportCurrentPage === reportTotalPages || reportTotalPages === 0}
                                            >
                                                Next
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Settings Tab */}
                <TabsContent value="settings" className="space-y-4">
                    {/* Campaign General Section */}
                    <Card size="sm">
                        <CardHeader>
                            <CardTitle>Campaign General</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <FieldGroup>
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Traffic Type */}
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="traffic-type">Traffic Type</Label>
                                        <Select defaultValue={campaign?.type || 'unknown'}>
                                            <SelectTrigger id="traffic-type">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="unknown">Unknown</SelectItem>
                                                <SelectItem value="search">Search</SelectItem>
                                                <SelectItem value="display">Display</SelectItem>
                                                <SelectItem value="in-path">In-Path</SelectItem>
                                                <SelectItem value="serp">SERP</SelectItem>
                                                <SelectItem value="email">Email</SelectItem>
                                                <SelectItem value="sms">SMS</SelectItem>
                                                <SelectItem value="push">Push</SelectItem>
                                                <SelectItem value="social">Social</SelectItem>
                                                <SelectItem value="xml">XML</SelectItem>
                                                <SelectItem value="dtl">DTL</SelectItem>
                                                <SelectItem value="mixed">Mixed</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Traffic ID (Origin) */}
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="traffic-id">Traffic ID (Origin)</Label>
                                        <Input id="traffic-id" defaultValue={campaign?.origin} />
                                    </div>

                                    {/* Campaign Name */}
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="campaign-name">Campaign Name</Label>
                                        <Input id="campaign-name" defaultValue={campaign?.feed} />
                                    </div>

                                    {/* Voluum Campaign ID */}
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="voluum-id">Voluum Campaign ID</Label>
                                        <Input id="voluum-id" />
                                    </div>

                                    {/* External ID(s) */}
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="external-ids" className="flex items-center gap-1">
                                            External ID(s)
                                            <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                                        </Label>
                                        <Input id="external-ids" placeholder="Separate IDs with commas" />
                                        <p className="text-xs text-muted-foreground">
                                            Note: Separate ids with commas "," when more than one.
                                        </p>
                                    </div>

                                    {/* Country */}
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="country">Country</Label>
                                        <Select defaultValue="us">
                                            <SelectTrigger id="country">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="us">United States</SelectItem>
                                                <SelectItem value="uk">United Kingdom</SelectItem>
                                                <SelectItem value="ca">Canada</SelectItem>
                                                <SelectItem value="au">Australia</SelectItem>
                                                <SelectItem value="de">Germany</SelectItem>
                                                <SelectItem value="fr">France</SelectItem>
                                                <SelectItem value="es">Spain</SelectItem>
                                                <SelectItem value="it">Italy</SelectItem>
                                                <SelectItem value="jp">Japan</SelectItem>
                                                <SelectItem value="in">India</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Language */}
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="language">Language</Label>
                                        <Select defaultValue="en">
                                            <SelectTrigger id="language">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="en">English</SelectItem>
                                                <SelectItem value="es">Spanish</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </FieldGroup>
                        </CardContent>
                    </Card>

                    {/* Feed Conversions Section */}
                    <Card size="sm">
                        <CardHeader>
                            <CardTitle>Feed Conversions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <FieldGroup>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="conversion-scrub">Conversion Scrub Rate %</Label>
                                    <Input
                                        id="conversion-scrub"
                                        type="number"
                                        step="0.01"
                                        defaultValue={campaign?.scrub || 0}
                                        className="w-62.5"
                                    />
                                </div>
                            </FieldGroup>
                        </CardContent>
                    </Card>

                    {/* Feed Finances Section */}
                    <Card size="sm">
                        <CardHeader>
                            <CardTitle>Feed Finances</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <FieldGroup>
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Pay for Suspicious Clicks */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col gap-1">
                                            <Label htmlFor="pay-suspicious">Pay for Suspicious Clicks</Label>
                                            <p className="text-xs text-muted-foreground">
                                                Enable to pay for suspicious clicks
                                            </p>
                                        </div>
                                        <Switch id="pay-suspicious" />
                                    </div>

                                    {/* Pay for Only Unique Visits */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col gap-1">
                                            <Label htmlFor="pay-unique">Pay for Only Unique Visits</Label>
                                            <p className="text-xs text-muted-foreground">
                                                Enable to pay only for unique visits
                                            </p>
                                        </div>
                                        <Switch id="pay-unique" />
                                    </div>

                                    {/* Scrub Rate % */}
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="scrub-rate">Scrub Rate %</Label>
                                        <Input
                                            id="scrub-rate"
                                            type="number"
                                            step="0.01"
                                            defaultValue={campaign?.scrub || 0}
                                        />
                                    </div>

                                    {/* Spend Cap */}
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="spend-cap">Spend Cap</Label>
                                        <Input
                                            id="spend-cap"
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                        />
                                    </div>

                                    {/* Weekday CPC */}
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="weekday-cpc">Weekday CPC</Label>
                                        <InputGroup>
                                            <InputGroupAddon align="inline-start">
                                                <InputGroupText>$</InputGroupText>
                                            </InputGroupAddon>
                                            <InputGroupInput
                                                id="weekday-cpc"
                                                type="number"
                                                step="0.01"
                                                placeholder="0.00"
                                                defaultValue={campaign?.avgCpc || 0}
                                            />
                                        </InputGroup>
                                    </div>

                                    {/* Weekend CPC */}
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="weekend-cpc">Weekend CPC</Label>
                                        <InputGroup>
                                            <InputGroupAddon align="inline-start">
                                                <InputGroupText>$</InputGroupText>
                                            </InputGroupAddon>
                                            <InputGroupInput
                                                id="weekend-cpc"
                                                type="number"
                                                step="0.01"
                                                placeholder="0.00"
                                            />
                                        </InputGroup>
                                    </div>

                                    {/* Adjuster CPC */}
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="adjuster-cpc">Adjuster CPC</Label>
                                        <InputGroup>
                                            <InputGroupAddon align="inline-start">
                                                <InputGroupText>$</InputGroupText>
                                            </InputGroupAddon>
                                            <InputGroupInput
                                                id="adjuster-cpc"
                                                type="number"
                                                step="0.01"
                                                placeholder="0.00"
                                            />
                                        </InputGroup>
                                    </div>
                                </div>
                            </FieldGroup>
                        </CardContent>
                    </Card>

                    {/* Save Button */}
                    <div className="flex justify-end gap-2">
                        <Button variant="outline">Cancel</Button>
                        <Button>Save Changes</Button>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

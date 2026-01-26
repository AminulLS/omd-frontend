'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { HourlyChart } from '@/components/blocks/charts/hourly-chart'
import { MonthlyChart } from '@/components/blocks/charts/monthly-chart'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { FieldGroup } from '@/components/ui/field'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { format } from 'date-fns'
import { useState } from 'react'
import { Copy, Download, CalendarIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import * as React from 'react'

const data = (hours = 24) => {
    return [...Array(hours)].map((_, h) => {
        const format = (h: number) => `${h % 12 || 12}${h < 12 ? 'am' : 'pm'}`
        return {
            key: format(h),
            fields: {
                today_revenue: Math.floor(Math.random() * 1000) + 200,
                today_clicks: Math.floor(Math.random() * 1000) + 200,
                yesterday_revenue: Math.floor(Math.random() * 1000) + 200,
                yesterday_clicks: Math.floor(Math.random() * 1000) + 200,
                sdlw_revenue: Math.floor(Math.random() * 1000) + 200,
                sdlw_clicks: Math.floor(Math.random() * 1000) + 200,
            },
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

const dataTwoMonth = () => {
    // get calendar days of current and last month:
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
                current: Math.floor(Math.random() * 1000) + 200,
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

        data[i - 1].fields.last = Math.floor(Math.random() * 1000) + 200
    }

    return data
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

type DateRange = {
    from: Date | undefined
    to?: Date | undefined
}

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50, 100]

// Mock data generators
const generateMockPartnerData = () => [...Array(50)].map((_, idx) => {
    const lsOptions = ['', 'yes', 'no']
    const randomLs = lsOptions[Math.floor(Math.random() * lsOptions.length)]

    const clicks = Math.floor(Math.random() * 1000) + 100
    const suspiciousClicks = Math.floor(Math.random() * clicks * 0.1)

    return {
        id: idx + 1,
        date: format(new Date(2026, 0, 1 + (idx % 30)), 'MM/dd/yyyy'),
        partner: `Partner ${idx + 1}`,
        impressions: Math.floor(Math.random() * 50000) + 10000,
        clicks: clicks,
        uniqueClicks: Math.floor(clicks * (0.7 + Math.random() * 0.2)),
        billableClicks: Math.floor(clicks * (0.8 + Math.random() * 0.15)),
        suspiciousClicks: suspiciousClicks,
        suspiciousClickPercentage: Math.round((suspiciousClicks / clicks) * 10000) / 100,
        agjSpend: Math.round((Math.random() * 3000 + 300) * 100) / 100,
        cpc: Math.round((Math.random() * 2 + 0.5) * 100) / 100,
        ctr: Math.round((Math.random() * 5 + 1) * 100) / 100,
        rpm: Math.round((Math.random() * 10 + 5) * 100) / 100,
        conversion: Math.floor(Math.random() * 100) + 10,
        conversionPercentage: Math.round((Math.random() * 10 + 1) * 100) / 100,
        cpa: Math.round((Math.random() * 50 + 10) * 100) / 100,
        revenue: Math.round((Math.random() * 5000 + 500) * 100) / 100,
        lsNumbers: randomLs,
        clicksHourly: [...Array(24)].map(() => Math.floor(Math.random() * 100)),
    }
})

const generateMockCampaignData = () => [...Array(50)].map((_, idx) => {
    const types = ['email', 'sms', 'push', 'dtl', 'path', 'xml', 'display', 'other', 'search', 'serp', 'unknown']
    const randomType = types[Math.floor(Math.random() * types.length)]

    const clicks = Math.floor(Math.random() * 1000) + 100
    const suspiciousClicks = Math.floor(Math.random() * clicks * 0.1)

    return {
        id: idx + 1,
        feedId: idx + 1,
        partnerId: (idx % 10) + 1,
        date: format(new Date(2026, 0, 1 + (idx % 30)), 'MM/dd/yyyy'),
        feed: `Feed ${idx + 1}`,
        partner: `Partner ${(idx % 10) + 1}`,
        origin: Math.random().toString(36).substring(2, 7).toUpperCase(),
        type: randomType,
        scrub: Math.round((Math.random() * 15) * 100) / 100,
        impressions: Math.floor(Math.random() * 50000) + 10000,
        clicks: clicks,
        uniqueClicks: Math.floor(clicks * (0.7 + Math.random() * 0.2)),
        billableClicks: Math.floor(clicks * (0.8 + Math.random() * 0.15)),
        suspiciousClicks: suspiciousClicks,
        suspiciousClickPercentage: Math.round((suspiciousClicks / clicks) * 10000) / 100,
        jobs: Math.floor(Math.random() * 5000) + 100,
        avgCpc: Math.round((Math.random() * 2 + 0.5) * 100) / 100,
        ctr: Math.round((Math.random() * 5 + 1) * 100) / 100,
        rpm: Math.round((Math.random() * 10 + 5) * 100) / 100,
        conversion: Math.floor(Math.random() * 100) + 10,
        conversionPercentage: Math.round((Math.random() * 10 + 1) * 100) / 100,
        revenue: Math.round((Math.random() * 5000 + 500) * 100) / 100,
        agjSpend: Math.round((Math.random() * 3000 + 300) * 100) / 100,
        clicksHourly: [...Array(24)].map(() => Math.floor(Math.random() * 100)),
    }
})

const generateMockAdsData = () => [...Array(50)].map((_, idx) => {
    const countries = ['US', 'UK', 'CA', 'AU', 'DE', 'FR', 'JP', 'IN']
    const statuses = ['active', 'inactive', 'pending', 'paused']
    return {
        id: idx + 1,
        partnerId: (idx % 10) + 1,
        title: `Campaign Title ${idx + 1}`,
        placement: `Placement ${idx + 1}`,
        partner: `Partner ${(idx % 10) + 1}`,
        nickname: `Nickname ${idx + 1}`,
        uniqueId: `ID-${Math.random().toString(36).substring(7).toUpperCase()}`,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        country: countries[Math.floor(Math.random() * countries.length)],
        dailyBudget: Math.round((Math.random() * 500 + 50) * 100) / 100,
        createdAt: format(new Date(2026, 0, 1 + idx), 'MM/dd/yyyy'),
        updatedAt: format(new Date(2026, 0, 10 + idx), 'MM/dd/yyyy'),
    }
})

// Mini hourly bar chart component
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

// Helper function to format seconds to hh:mm:ss
const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

// ReportTable component with pagination
interface ReportTableProps {
    columns: string[]
    data: Record<string, string | number | number[]>[]
    linkColumn?: string // Column name that should be a link
    linkPath?: string // Base path for the link (e.g., '/dashboard/partners')
    linkSuffix?: string // Suffix to add to the link (e.g., '/sponsored-ads')
    linkColumns?: Record<string, { path: string; suffix?: string }> // Multiple link columns: { columnName: { path: '/path', suffix: '/optional' } }
    showTotals?: boolean // Whether to show the totals row (default: true)
}

function ReportTable({ columns, data, linkColumn, linkPath, linkSuffix, linkColumns, showTotals = true }: ReportTableProps) {
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)

    // Pagination calculations
    const totalPages = Math.ceil(data.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedData = data.slice(startIndex, endIndex)

    // Reset to page 1 when items per page changes
    React.useEffect(() => {
        setCurrentPage(1)
    }, [itemsPerPage])

    // Helper function to format values based on column name
    const formatValue = (columnName: string, value: string | number | number[]): string => {
        if (Array.isArray(value)) {
            return '' // Handled separately by HourlyBarChart
        }

        if (typeof value === 'number') {
            const lowerCol = columnName.toLowerCase()

            // Time formatting for Indexing Speed and Total Time Indexing
            if (columnName === 'Indexing Speed' || columnName === 'Total Time Indexing') {
                return formatTime(value)
            }

            // Currency fields
            if (lowerCol.includes('revenue') || lowerCol.includes('spend') || lowerCol.includes('cpc') || lowerCol.includes('cpa') || lowerCol.includes('rpm') || lowerCol.includes('agj')) {
                return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            }

            // Percentage fields (exclude 'Conversion' column, only format 'Conversion %')
            if (lowerCol.includes('ctr') || lowerCol === 'conversion %' || lowerCol === 'susp. click %' || lowerCol === 'scrub') {
                return `${value.toFixed(2)}%`
            }

            // Large numbers (impressions, clicks, jobs)
            if (lowerCol.includes('impression') || lowerCol.includes('click') || lowerCol.includes('conversion') || lowerCol.includes('ls') || lowerCol === 'jobs') {
                return value.toLocaleString()
            }

            // Default number formatting
            return value.toString()
        }

        return value
    }

    const handleCopy = () => {
        const headers = columns.join(',')
        const rows = data.map((row) =>
            Object.values(row)
            .map((value, idx) => {
                if (Array.isArray(value)) {
                    return JSON.stringify(value)
                }
                return formatValue(columns[idx], value)
            })
            .join(',')
        )
        const csv = [headers, ...rows].join('\n')
        navigator.clipboard.writeText(csv)
    }

    const handleDownloadCSV = () => {
        const headers = columns.join(',')
        const rows = data.map((row) =>
            Object.values(row)
            .map((value, idx) => {
                if (Array.isArray(value)) {
                    return JSON.stringify(value)
                }
                return formatValue(columns[idx], value)
            })
            .join(',')
        )
        const csv = [headers, ...rows].join('\n')
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'report.csv'
        a.click()
        URL.revokeObjectURL(url)
    }

    const calculateTotals = () => {
        // Initialize totals array with zeros, aligned to columns (excluding first which is date/name)
        const totalsArray = new Array(columns.length - 1).fill(0)
        // Count arrays for tracking which columns need averaging
        const countArray = new Array(columns.length - 1).fill(0)
        // Track which columns should be averaged
        const averageColumns = ['CPC', 'Avg. CPC', 'CTR', 'Conversion %', 'Susp. Click %', 'Scrub']

        data.forEach((row) => {
            columns.slice(1).forEach((colName, idx) => {
                // Map column name to data key
                let dataKey = colName.toLowerCase().replace(/ /g, '').replace('%', 'percentage')

                // Special case mappings for camelCase keys
                if (colName === 'Clicks Hourly') dataKey = 'clicksHourly'
                if (colName === 'Avg. CPC') dataKey = 'avgCpc'
                if (colName === 'Conversion %') dataKey = 'conversionPercentage'
                if (colName === 'LS #s') dataKey = 'lsNumbers'
                if (colName === 'API Key') dataKey = 'apiKey'
                if (colName === 'Last Updated') dataKey = 'lastUpdated'
                if (colName === 'Next Run') dataKey = 'nextRun'
                if (colName === 'Last Status') dataKey = 'lastStatus'
                if (colName === 'Indexing Speed') dataKey = 'indexingSpeed'
                if (colName === 'Total Time Indexing') dataKey = 'totalTimeIndexing'
                if (colName === 'Min. CPC') dataKey = 'minCpc'
                if (colName === 'Max. CPC') dataKey = 'maxCpc'
                if (colName === 'Avg. CPC') dataKey = 'avgCpc'
                if (colName === 'CPC') dataKey = 'cpc'
                if (colName === 'Uniq. Clicks') dataKey = 'uniqueClicks'
                if (colName === 'Bill. Clicks') dataKey = 'billableClicks'
                if (colName === 'Susp. Clicks') dataKey = 'suspiciousClicks'
                if (colName === 'Susp. Click %') dataKey = 'suspiciousClickPercentage'
                if (colName === 'AGJ Spend') dataKey = 'agjSpend'
                if (colName === 'Spend') dataKey = 'revenue'
                if (colName === 'Campaign') dataKey = 'feed'
                if (colName === 'Origin') dataKey = 'origin'
                if (colName === 'Type') dataKey = 'type'
                if (colName === 'Scrub') dataKey = 'scrub'

                const value = (row as any)[dataKey]
                if (typeof value === 'number') {
                    // Check if this column should be averaged
                    const shouldAverage = averageColumns.some(avgCol => colName.includes(avgCol))

                    if (shouldAverage) {
                        totalsArray[idx] += value
                        countArray[idx]++
                    } else {
                        totalsArray[idx] += value
                    }
                }
            })
        })

        // Calculate averages for columns that need them
        averageColumns.forEach(avgCol => {
            columns.slice(1).forEach((colName, idx) => {
                if (colName.includes(avgCol) && countArray[idx] > 0) {
                    totalsArray[idx] = totalsArray[idx] / countArray[idx]
                }
            })
        })

        return totalsArray
    }

    const totals = calculateTotals()

    const handleItemsPerPageChange = (value: string) => {
        setItemsPerPage(Number(value))
        setCurrentPage(1)
    }

    return (
        <Card size="sm">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>Report</CardTitle>
                    <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={handleCopy}>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleDownloadCSV}>
                            <Download className="h-4 w-4 mr-2" />
                            CSV
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((col, idx) => (
                                <TableHead key={idx}>{col}</TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.map((row, idx) => {
                            const rowId = (row as any).id // Get the id from the row data
                            return (
                                <TableRow key={idx}>
                                    {columns.map((columnName, cellIdx) => {
                                        // Map column name to data key
                                        let dataKey = columnName.toLowerCase().replace(/ /g, '').replace('%', 'percentage')

                                        // Special case mappings for camelCase keys
                                        if (columnName === 'Clicks Hourly') dataKey = 'clicksHourly'
                                        if (columnName === 'Avg. CPC') dataKey = 'avgCpc'
                                        if (columnName === 'CPC') dataKey = 'avgCpc'
                                        if (columnName === 'Conversion %') dataKey = 'conversionPercentage'
                                        if (columnName === 'LS #s') dataKey = 'lsNumbers'
                                        if (columnName === 'API Key') dataKey = 'apiKey'
                                        if (columnName === 'Last Updated') dataKey = 'lastUpdated'
                                        if (columnName === 'Next Run') dataKey = 'nextRun'
                                        if (columnName === 'Last Status') dataKey = 'lastStatus'
                                        if (columnName === 'Indexing Speed') dataKey = 'indexingSpeed'
                                        if (columnName === 'Total Time Indexing') dataKey = 'totalTimeIndexing'
                                        if (columnName === 'Min. CPC') dataKey = 'minCpc'
                                        if (columnName === 'Max. CPC') dataKey = 'maxCpc'
                                        if (columnName === 'Avg. CPC') dataKey = 'avgCpc'
                                        if (columnName === 'CPC') dataKey = 'cpc'
                                        if (columnName === 'Uniq. Clicks') dataKey = 'uniqueClicks'
                                        if (columnName === 'Bill. Clicks') dataKey = 'billableClicks'
                                        if (columnName === 'Susp. Clicks') dataKey = 'suspiciousClicks'
                                        if (columnName === 'Susp. Click %') dataKey = 'suspiciousClickPercentage'
                                        if (columnName === 'AGJ Spend') dataKey = 'agjSpend'
                                        if (columnName === 'Spend') dataKey = 'revenue'
                                        if (columnName === 'Campaign') dataKey = 'feed'
                                        if (columnName === 'Origin') dataKey = 'origin'
                                        if (columnName === 'Type') dataKey = 'type'
                                        if (columnName === 'Scrub') dataKey = 'scrub'

                                        const value = (row as any)[dataKey]
                                        const isLinkColumn = linkColumn && columnName === linkColumn
                                        const linkConfig = linkColumns?.[columnName]

                                        // Check if value is an array (hourly chart data)
                                        if (Array.isArray(value)) {
                                            return (
                                                <TableCell key={cellIdx} className="min-w-25">
                                                    <HourlyBarChart data={value as number[]} />
                                                </TableCell>
                                            )
                                        }

                                        // Render link column
                                        if (isLinkColumn && linkPath && rowId) {
                                            return (
                                                <TableCell key={cellIdx}>
                                                    <Link
                                                        href={`${linkPath}/${rowId}${linkSuffix || ''}`}
                                                        className="text-primary hover:underline font-medium"
                                                    >
                                                        {formatValue(columnName, value)}
                                                    </Link>
                                                </TableCell>
                                            )
                                        }

                                        // Render link columns from linkColumns config
                                        if (linkConfig) {
                                            // Determine which ID to use based on column name
                                            let linkId = rowId
                                            if (columnName === 'Campaign') linkId = (row as any).feedId || rowId
                                            if (columnName === 'Partner') linkId = (row as any).partnerId || rowId

                                            return (
                                                <TableCell key={cellIdx}>
                                                    <Link
                                                        href={`${linkConfig.path}/${linkId}${linkConfig.suffix || ''}`}
                                                        className="text-primary hover:underline font-medium"
                                                    >
                                                        {formatValue(columnName, value)}
                                                    </Link>
                                                </TableCell>
                                            )
                                        }

                                        return (
                                            <TableCell key={cellIdx}>
                                                {formatValue(columnName, value)}
                                            </TableCell>
                                        )
                                    })}
                                </TableRow>
                            )
                        })}
                        {/* Total row */}
                        {showTotals && (
                            <TableRow className="bg-muted/50 font-semibold">
                                <TableCell>Totals</TableCell>
                                {columns.slice(1).map((colName, idx) => {
                                    const totalValue = totals[idx]
                                    return (
                                        <TableCell key={idx}>
                                            {totalValue !== undefined && totalValue > 0 ? formatValue(colName, totalValue) : '-'}
                                        </TableCell>
                                    )
                                })}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {/* Pagination */}
                {data.length > 0 && (
                    <div className="flex items-center justify-between p-4 border-t">
                        <div className="flex items-center gap-4">
                            <span className="text-xs text-muted-foreground">
                                Showing {startIndex + 1}-{Math.min(endIndex, data.length)} of {data.length} results
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">Rows per page:</span>
                                <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                                    <SelectTrigger className="h-7 w-[70px] text-xs">
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
                                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Previous
                            </Button>

                            {/* Page Numbers */}
                            <div className="flex items-center gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                    // Show first page, last page, current page, and adjacent pages
                                    const showPage =
                                        page === 1 ||
                                        page === totalPages ||
                                        (page >= currentPage - 1 && page <= currentPage + 1)

                                    if (!showPage) {
                                        // Show ellipsis for skipped pages
                                        if (page === currentPage - 2 || page === currentPage + 2) {
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
                                            variant={currentPage === page ? 'default' : 'outline'}
                                            size="sm"
                                            type="button"
                                            onClick={() => setCurrentPage(page)}
                                            className="min-w-[2rem] px-2"
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
                                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages || totalPages === 0}
                            >
                                Next
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default function Page() {
    const router = useRouter()
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)
    const [selectedCountry, setSelectedCountry] = useState<string>('all')
    const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false)

    // Ads filters and pagination state
    const [adsSearchQuery, setAdsSearchQuery] = useState<string>('')
    const [adsCountryFilter, setAdsCountryFilter] = useState<string>('all')
    const [adsStatusFilter, setAdsStatusFilter] = useState<string>('all')
    const [adsCurrentPage, setAdsCurrentPage] = useState(1)
    const [adsItemsPerPage, setAdsItemsPerPage] = useState(10)

    // Create campaign form state
    const [newCampaign, setNewCampaign] = useState({
        trafficType: 'unknown',
        trafficId: '',
        campaignName: '',
        partnerId: ''
    })

    // Memoize data generation to prevent hydration errors
    const hourlyData = React.useMemo(() => data(), [])
    const monthlyData = React.useMemo(() => dataTwoMonth(), [])

    // Memoize all mock data generators
    const partnerData = React.useMemo(() => generateMockPartnerData(), [])
    const campaignData = React.useMemo(() => generateMockCampaignData(), [])
    const adsData = React.useMemo(() => generateMockAdsData(), [])

    // Filter and paginate ads data
    const filteredAdsData = React.useMemo(() => {
        return adsData.filter((ad) => {
            const matchesSearch =
                adsSearchQuery === '' ||
                ad.title.toLowerCase().includes(adsSearchQuery.toLowerCase()) ||
                ad.nickname.toLowerCase().includes(adsSearchQuery.toLowerCase()) ||
                ad.uniqueId.toLowerCase().includes(adsSearchQuery.toLowerCase()) ||
                ad.partner.toLowerCase().includes(adsSearchQuery.toLowerCase())

            const matchesCountry = adsCountryFilter === 'all' || ad.country === adsCountryFilter
            const matchesStatus = adsStatusFilter === 'all' || ad.status === adsStatusFilter

            return matchesSearch && matchesCountry && matchesStatus
        })
    }, [adsData, adsSearchQuery, adsCountryFilter, adsStatusFilter])

    const adsTotalPages = Math.ceil(filteredAdsData.length / adsItemsPerPage)
    const adsStartIndex = (adsCurrentPage - 1) * adsItemsPerPage
    const adsEndIndex = adsStartIndex + adsItemsPerPage
    const paginatedAdsData = filteredAdsData.slice(adsStartIndex, adsEndIndex)

    // Reset to page 1 when filters or items per page change
    React.useEffect(() => {
        setAdsCurrentPage(1)
    }, [adsSearchQuery, adsCountryFilter, adsStatusFilter, adsItemsPerPage])

    const formatDateRange = () => {
        if (!dateRange?.from) return 'Select range'
        if (!dateRange.to) return format(dateRange.from, 'MMM d, yyyy')
        return `${format(dateRange.from, 'MMM d, yyyy')} - ${format(dateRange.to, 'MMM d, yyyy')}`
    }

    return (
        <div>
            <div className="mb-4 border-b pb-2 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold">Campaigns</h2>
                    <p className="text-sm text-muted-foreground">Manage all of the campaigns</p>
                </div>
                <Sheet open={isCreateSheetOpen} onOpenChange={setIsCreateSheetOpen}>
                    <SheetTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Campaign
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Create New Campaign</SheetTitle>
                            <SheetDescription>
                                Create a new campaign by filling in the details below.
                            </SheetDescription>
                        </SheetHeader>
                        <FieldGroup className="mt-4 px-4">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="campaign-name">Campaign Name</Label>
                                <Input
                                    id="campaign-name"
                                    value={newCampaign.campaignName}
                                    onChange={(e) => setNewCampaign({ ...newCampaign, campaignName: e.target.value })}
                                    placeholder="Enter campaign name"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="partner">Partner</Label>
                                <Select
                                    value={newCampaign.partnerId}
                                    onValueChange={(value) => setNewCampaign({ ...newCampaign, partnerId: value })}
                                >
                                    <SelectTrigger id="partner">
                                        <SelectValue placeholder="Select partner" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Partner 1</SelectItem>
                                        <SelectItem value="2">Partner 2</SelectItem>
                                        <SelectItem value="3">Partner 3</SelectItem>
                                        <SelectItem value="4">Partner 4</SelectItem>
                                        <SelectItem value="5">Partner 5</SelectItem>
                                        <SelectItem value="6">Partner 6</SelectItem>
                                        <SelectItem value="7">Partner 7</SelectItem>
                                        <SelectItem value="8">Partner 8</SelectItem>
                                        <SelectItem value="9">Partner 9</SelectItem>
                                        <SelectItem value="10">Partner 10</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="traffic-type">Traffic Type</Label>
                                <Select
                                    value={newCampaign.trafficType}
                                    onValueChange={(value) => setNewCampaign({ ...newCampaign, trafficType: value })}
                                >
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

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="traffic-id">Traffic ID (Origin)</Label>
                                <Input
                                    id="traffic-id"
                                    value={newCampaign.trafficId}
                                    onChange={(e) => setNewCampaign({ ...newCampaign, trafficId: e.target.value })}
                                    placeholder="Enter traffic ID"
                                />
                            </div>
                        </FieldGroup>
                        <SheetFooter>
                            <Button variant="outline" onClick={() => setIsCreateSheetOpen(false)}>
                                Cancel
                            </Button>
                            <Button
                                onClick={() => {
                                    // Simulate creating a campaign and navigate to the new campaign details
                                    // In a real app, you would make an API call here
                                    const newId = Math.max(...campaignData.map(c => c.id)) + 1
                                    router.push(`/dashboard/publishers/campaigns/${newId}`)
                                    setIsCreateSheetOpen(false)
                                }}
                            >
                                Create Campaign
                            </Button>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </div>

            <div className="flex flex-col gap-4">
                {/* Daily chart (current & last month) */}
                <Card size="sm">
                    <CardHeader>
                        <CardTitle>Daily Revenue</CardTitle>
                        <CardDescription>This month vs Last Month</CardDescription>
                        <CardAction>
                            <div className="flex gap-2">
                                <Badge className="bg-chart-2 rounded-full">
                                    ${monthlyData.reduce((acc, curr) => acc + curr.fields.current, 0).toLocaleString()}
                                </Badge>
                                <Badge className="bg-chart-3 rounded-full">
                                    ${monthlyData.reduce((acc, curr) => acc + curr.fields.last, 0).toLocaleString()}
                                </Badge>
                            </div>
                        </CardAction>
                    </CardHeader>
                    <CardContent>
                        <MonthlyChart data={monthlyData} config={configTwoMonth} />
                    </CardContent>
                </Card>

                <div className="flex gap-2">
                    {/* Hourly chart */}
                    <Card size="sm" className="w-4/6">
                        <CardHeader>
                            <CardTitle>Recent Revenue</CardTitle>
                            <CardAction>
                                <span className="text-xs text-muted-foreground">Last Updated: {new Date().toLocaleString()}</span>
                            </CardAction>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-center gap-4 items-center mb-2">
                                <div className="text-center">
                                    <div className="text-sm text-muted-foreground">Today</div>
                                    <div className="text-lg font-semibold flex items-center gap-1">
                                        ${hourlyData.reduce((acc, curr) => acc + curr.fields.today_revenue, 0).toLocaleString()}
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-sm text-muted-foreground">Yesterday</div>
                                    <div className="text-lg font-semibold flex items-center gap-1">
                                        ${hourlyData.reduce((acc, curr) => acc + curr.fields.yesterday_revenue, 0).toLocaleString()}
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-sm text-muted-foreground">SDLW</div>
                                    <div className="text-lg font-semibold flex items-center gap-1">
                                        ${hourlyData.reduce((acc, curr) => acc + curr.fields.sdlw_revenue, 0).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                            <HourlyChart data={hourlyData} config={config} />
                        </CardContent>
                    </Card>

                    {/* Weekly table */}
                    <Card size="sm" className="w-2/6">
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Revenue</TableHead>
                                        <TableHead>SDLW</TableHead>
                                        <TableHead>Delta</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {React.useMemo(() =>
                                        [...Array(7)].map((_, idx) => {
                                            const revenue = (Math.random() * 1000.54 + 200).toLocaleString()
                                            const sdlw = (Math.random() * 1000.74 + 200).toLocaleString()
                                            const delta = (Math.random() * 1000.23 + 200).toLocaleString()
                                            return (
                                                <TableRow key={idx}>
                                                    <TableHead>
                                                        <span>{format(new Date(2026, 1, 1 + idx), `MM/dd/yyyy`)}</span>
                                                        <small> ({format(new Date(2026, 1, 1 + idx), `ccc`)})</small>
                                                    </TableHead>
                                                    <TableCell>${revenue}</TableCell>
                                                    <TableCell>${sdlw}</TableCell>
                                                    <TableCell>${delta}</TableCell>
                                                </TableRow>
                                            )
                                        }), []
                                    )}
                                    <TableRow>
                                        <TableHead className="text-right font-semibold">
                                            Totals
                                        </TableHead>
                                        <TableCell>${(Math.random() * 1000.54 + 200).toLocaleString()}</TableCell>
                                        <TableCell>${(Math.random() * 1000.54 + 200).toLocaleString()}</TableCell>
                                        <TableCell>${(Math.random() * 1000.54 + 200).toLocaleString()}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Add Reports Here */}
            <Tabs defaultValue="reports" className="mt-6">
                <TabsList className="w-full max-w-md grid-cols-2">
                    <TabsTrigger value="reports">Reports</TabsTrigger>
                    <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
                </TabsList>

                {/* Reports Tab */}
                <TabsContent value="reports" className="space-y-4">
                    {/* Global Filters */}
                    <FieldGroup>
                        <div className="flex flex-wrap gap-4">
                            {/* Date Range Filter */}
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

                            {/* Country Filter */}
                            <div className="flex flex-col gap-2">
                                <Label>Country</Label>
                                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                                    <SelectTrigger className="w-50">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Countries</SelectItem>
                                        <SelectItem value="US">United States</SelectItem>
                                        <SelectItem value="UK">United Kingdom</SelectItem>
                                        <SelectItem value="CA">Canada</SelectItem>
                                        <SelectItem value="AU">Australia</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </FieldGroup>

                    {/* Report Sub-tabs */}
                    <Tabs defaultValue="partners">
                        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
                            <TabsTrigger value="partners">Partners</TabsTrigger>
                            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
                        </TabsList>

                        {/* Partner Table */}
                        <TabsContent value="partners">
                            <ReportTable
                                columns={['Date', 'Partner', 'Impressions', 'Clicks', 'Uniq. Clicks', 'Bill. Clicks', 'Susp. Clicks', 'Susp. Click %', 'CPC', 'CTR', 'RPM', 'Conversion', 'Conversion %', 'CPA', 'Spend', 'AGJ Spend', 'LS #s', 'Clicks Hourly']}
                                data={partnerData}
                                linkColumn="Partner"
                                linkPath="/dashboard/partners"
                                linkSuffix="/xml"
                            />
                        </TabsContent>

                        {/* Campaigns Table */}
                        <TabsContent value="campaigns">
                            <ReportTable
                                columns={['Date', 'Campaign', 'Partner', 'Origin', 'Type', 'Scrub', 'Impressions', 'Clicks', 'Uniq. Clicks', 'Bill. Clicks', 'Susp. Clicks', 'Susp. Click %', 'Jobs', 'CPC', 'CTR', 'RPM', 'Conversion', 'Conversion %', 'Spend', 'AGJ Spend', 'Clicks Hourly']}
                                data={campaignData}
                                linkColumns={{
                                    'Campaign': { path: '/dashboard/publishers/campaigns' },
                                    'Partner': { path: '/dashboard/partners', suffix: '/xml' },
                                }}
                            />
                        </TabsContent>
                    </Tabs>
                </TabsContent>

                {/* Campaigns Tab */}
                <TabsContent value="campaigns">
                    <Card size="sm">
                        <CardHeader>
                            {/* Filters */}
                            <FieldGroup>
                                <div className="flex flex-wrap gap-4">
                                    {/* Search Filter */}
                                    <div className="flex flex-col gap-2">
                                        <Label>Search</Label>
                                        <Input
                                            placeholder="Search ads..."
                                            value={adsSearchQuery}
                                            onChange={(e) => setAdsSearchQuery(e.target.value)}
                                            className="w-62.5"
                                        />
                                    </div>

                                    {/* Country Filter */}
                                    <div className="flex flex-col gap-2">
                                        <Label>Country</Label>
                                        <Select value={adsCountryFilter} onValueChange={setAdsCountryFilter}>
                                            <SelectTrigger className="w-50">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Countries</SelectItem>
                                                <SelectItem value="US">United States</SelectItem>
                                                <SelectItem value="UK">United Kingdom</SelectItem>
                                                <SelectItem value="CA">Canada</SelectItem>
                                                <SelectItem value="AU">Australia</SelectItem>
                                                <SelectItem value="DE">Germany</SelectItem>
                                                <SelectItem value="FR">France</SelectItem>
                                                <SelectItem value="JP">Japan</SelectItem>
                                                <SelectItem value="IN">India</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Status Filter */}
                                    <div className="flex flex-col gap-2">
                                        <Label>Status</Label>
                                        <Select value={adsStatusFilter} onValueChange={setAdsStatusFilter}>
                                            <SelectTrigger className="w-50">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Status</SelectItem>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="inactive">Inactive</SelectItem>
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="paused">Paused</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </FieldGroup>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Campaign Title</TableHead>
                                        <TableHead>Partner</TableHead>
                                        <TableHead>Original Name</TableHead>
                                        <TableHead>Unique ID</TableHead>
                                        <TableHead>Country</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Daily Budget</TableHead>
                                        <TableHead>Created At</TableHead>
                                        <TableHead>Updated At</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedAdsData.length > 0 ? (
                                        paginatedAdsData.map((ad) => (
                                            <TableRow key={ad.id}>
                                                <TableCell>
                                                    <Link
                                                        href={`/dashboard/publishers/campaigns/${ad.id}`}
                                                        className="text-primary hover:underline font-medium"
                                                    >
                                                        {ad.title}
                                                    </Link>
                                                </TableCell>
                                                <TableCell>
                                                    <Link
                                                        href={`/dashboard/partners/${ad.partnerId}/xml`}
                                                        className="text-primary hover:underline font-medium"
                                                    >
                                                        {ad.partner}
                                                    </Link>
                                                </TableCell>
                                                <TableCell>{ad.nickname}</TableCell>
                                                <TableCell>{ad.uniqueId}</TableCell>
                                                <TableCell>{ad.country}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            ad.status === 'active'
                                                                ? 'default'
                                                                : ad.status === 'paused'
                                                                    ? 'destructive'
                                                                    : 'secondary'
                                                        }
                                                    >
                                                        {ad.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>${ad.dailyBudget.toFixed(2)}</TableCell>
                                                <TableCell>{ad.createdAt}</TableCell>
                                                <TableCell>{ad.updatedAt}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                                                No ads found matching the current filters
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>

                            {/* Pagination */}
                            {filteredAdsData.length > 0 && (
                                <div className="flex items-center justify-between p-4 border-t">
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs text-muted-foreground">
                                            Showing {adsStartIndex + 1}-{Math.min(adsEndIndex, filteredAdsData.length)} of{' '}
                                            {filteredAdsData.length} results
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-muted-foreground">Rows per page:</span>
                                            <Select value={adsItemsPerPage.toString()} onValueChange={(v) => setAdsItemsPerPage(Number(v))}>
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
                                            onClick={() => setAdsCurrentPage((prev) => Math.max(1, prev - 1))}
                                            disabled={adsCurrentPage === 1}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                            Previous
                                        </Button>

                                        {/* Page Numbers */}
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: adsTotalPages }, (_, i) => i + 1).map((page) => {
                                                const showPage =
                                                    page === 1 ||
                                                    page === adsTotalPages ||
                                                    (page >= adsCurrentPage - 1 && page <= adsCurrentPage + 1)

                                                if (!showPage) {
                                                    if (page === adsCurrentPage - 2 || page === adsCurrentPage + 2) {
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
                                                        variant={adsCurrentPage === page ? 'default' : 'outline'}
                                                        size="sm"
                                                        type="button"
                                                        onClick={() => setAdsCurrentPage(page)}
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
                                            onClick={() => setAdsCurrentPage((prev) => Math.min(adsTotalPages, prev + 1))}
                                            disabled={adsCurrentPage === adsTotalPages || adsTotalPages === 0}
                                        >
                                            Next
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

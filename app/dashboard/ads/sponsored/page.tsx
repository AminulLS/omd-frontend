'use client'

import Link from 'next/link'
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
import { FieldGroup } from '@/components/ui/field'
import { format } from 'date-fns'
import { useState } from 'react'
import { Copy, Download, CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
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

    return {
        id: idx + 1,
        date: format(new Date(2026, 0, 1 + (idx % 30)), 'MM/dd/yyyy'),
        partner: `Partner ${idx + 1}`,
        impressions: Math.floor(Math.random() * 50000) + 10000,
        clicks: Math.floor(Math.random() * 1000) + 100,
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

const generateMockBoardData = () => [...Array(50)].map((_, idx) => ({
    date: format(new Date(2026, 0, 1 + (idx % 30)), 'MM/dd/yyyy'),
    board: `Board ${idx + 1}`,
    impressions: Math.floor(Math.random() * 50000) + 10000,
    clicks: Math.floor(Math.random() * 1000) + 100,
    ctr: Math.round((Math.random() * 5 + 1) * 100) / 100,
    rpm: Math.round((Math.random() * 10 + 5) * 100) / 100,
    revenue: Math.round((Math.random() * 5000 + 500) * 100) / 100,
}))

const generateMockPlacementData = () => [...Array(50)].map((_, idx) => ({
    date: format(new Date(2026, 0, 1 + (idx % 30)), 'MM/dd/yyyy'),
    placement: `Placement ${idx + 1}`,
    impressions: Math.floor(Math.random() * 50000) + 10000,
    clicks: Math.floor(Math.random() * 1000) + 100,
    avgCpc: Math.round((Math.random() * 2 + 0.5) * 100) / 100,
    ctr: Math.round((Math.random() * 5 + 1) * 100) / 100,
    rpm: Math.round((Math.random() * 10 + 5) * 100) / 100,
    conversion: Math.floor(Math.random() * 100) + 10,
    conversionPercentage: Math.round((Math.random() * 10 + 1) * 100) / 100,
    cpa: Math.round((Math.random() * 50 + 10) * 100) / 100,
    revenue: Math.round((Math.random() * 5000 + 500) * 100) / 100,
}))

const generateMockSourceData = () => [...Array(50)].map((_, idx) => ({
    date: format(new Date(2026, 0, 1 + (idx % 30)), 'MM/dd/yyyy'),
    source: `Source ${idx + 1}`,
    impressions: Math.floor(Math.random() * 50000) + 10000,
    clicks: Math.floor(Math.random() * 1000) + 100,
    avgCpc: Math.round((Math.random() * 2 + 0.5) * 100) / 100,
    ctr: Math.round((Math.random() * 5 + 1) * 100) / 100,
    rpm: Math.round((Math.random() * 10 + 5) * 100) / 100,
    conversion: Math.floor(Math.random() * 100) + 10,
    conversionPercentage: Math.round((Math.random() * 10 + 1) * 100) / 100,
    cpa: Math.round((Math.random() * 50 + 10) * 100) / 100,
    revenue: Math.round((Math.random() * 5000 + 500) * 100) / 100,
}))

const generateMockMediumData = () => [...Array(50)].map((_, idx) => ({
    date: format(new Date(2026, 0, 1 + (idx % 30)), 'MM/dd/yyyy'),
    medium: `Medium ${idx + 1}`,
    impressions: Math.floor(Math.random() * 50000) + 10000,
    clicks: Math.floor(Math.random() * 1000) + 100,
    avgCpc: Math.round((Math.random() * 2 + 0.5) * 100) / 100,
    ctr: Math.round((Math.random() * 5 + 1) * 100) / 100,
    rpm: Math.round((Math.random() * 10 + 5) * 100) / 100,
    conversion: Math.floor(Math.random() * 100) + 10,
    conversionPercentage: Math.round((Math.random() * 10 + 1) * 100) / 100,
    cpa: Math.round((Math.random() * 50 + 10) * 100) / 100,
    revenue: Math.round((Math.random() * 5000 + 500) * 100) / 100,
}))

const generateMockKeywordsData = () => [...Array(50)].map((_, idx) => ({
    date: format(new Date(2026, 0, 1 + (idx % 30)), 'MM/dd/yyyy'),
    keyword: `Keyword ${idx + 1}`,
    impressions: Math.floor(Math.random() * 50000) + 10000,
    clicks: Math.floor(Math.random() * 1000) + 100,
    avgCpc: Math.round((Math.random() * 2 + 0.5) * 100) / 100,
    ctr: Math.round((Math.random() * 5 + 1) * 100) / 100,
    rpm: Math.round((Math.random() * 10 + 5) * 100) / 100,
    conversion: Math.floor(Math.random() * 100) + 10,
    conversionPercentage: Math.round((Math.random() * 10 + 1) * 100) / 100,
    cpa: Math.round((Math.random() * 50 + 10) * 100) / 100,
    revenue: Math.round((Math.random() * 5000 + 500) * 100) / 100,
}))

const generateMockCompaniesData = () => [...Array(50)].map((_, idx) => ({
    date: format(new Date(2026, 0, 1 + (idx % 30)), 'MM/dd/yyyy'),
    company: `Company ${idx + 1}`,
    impressions: Math.floor(Math.random() * 50000) + 10000,
    clicks: Math.floor(Math.random() * 1000) + 100,
    avgCpc: Math.round((Math.random() * 2 + 0.5) * 100) / 100,
    ctr: Math.round((Math.random() * 5 + 1) * 100) / 100,
    rpm: Math.round((Math.random() * 10 + 5) * 100) / 100,
    conversion: Math.floor(Math.random() * 100) + 10,
    conversionPercentage: Math.round((Math.random() * 10 + 1) * 100) / 100,
    cpa: Math.round((Math.random() * 50 + 10) * 100) / 100,
    revenue: Math.round((Math.random() * 5000 + 500) * 100) / 100,
}))

const generateMockApiKeyData = () => [...Array(50)].map((_, idx) => ({
    id: idx + 1,
    date: format(new Date(2026, 0, 1 + (idx % 30)), 'MM/dd/yyyy'),
    apiKey: `key-${Math.random().toString(36).substring(7)}`,
    impressions: Math.floor(Math.random() * 50000) + 10000,
    clicks: Math.floor(Math.random() * 1000) + 100,
    avgCpc: Math.round((Math.random() * 2 + 0.5) * 100) / 100,
    ctr: Math.round((Math.random() * 5 + 1) * 100) / 100,
    rpm: Math.round((Math.random() * 10 + 5) * 100) / 100,
    conversion: Math.floor(Math.random() * 100) + 10,
    conversionPercentage: Math.round((Math.random() * 10 + 1) * 100) / 100,
    cpa: Math.round((Math.random() * 50 + 10) * 100) / 100,
    revenue: Math.round((Math.random() * 5000 + 500) * 100) / 100,
}))

const generateMockAdsData = () => [...Array(10)].map((_, idx) => ({
    id: idx + 1,
    title: `Ad Title ${idx + 1}`,
    placement: `Placement ${idx + 1}`,
    nickname: `Nickname ${idx + 1}`,
    uniqueId: `ID-${Math.random().toString(36).substring(7).toUpperCase()}`,
    status: Math.random() > 0.3 ? 'active' : 'inactive',
    createdAt: format(new Date(2026, 0, 1 + idx), 'MM/dd/yyyy'),
    updatedAt: format(new Date(2026, 0, 10 + idx), 'MM/dd/yyyy'),
}))

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

// ReportTable component with pagination
interface ReportTableProps {
    columns: string[]
    data: Record<string, string | number | number[]>[]
    linkColumn?: string // Column name that should be a link
    linkPath?: string // Base path for the link (e.g., '/dashboard/partners')
    linkSuffix?: string // Suffix to add to the link (e.g., '/sponsored-ads')
}

function ReportTable({ columns, data, linkColumn, linkPath, linkSuffix }: ReportTableProps) {
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

            // Currency fields
            if (lowerCol.includes('revenue') || lowerCol.includes('cpc') || lowerCol.includes('cpa') || lowerCol.includes('rpm')) {
                return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            }

            // Percentage fields
            if (lowerCol.includes('ctr') || lowerCol.includes('conversion')) {
                return `${value.toFixed(2)}%`
            }

            // Large numbers (impressions, clicks)
            if (lowerCol.includes('impression') || lowerCol.includes('click') || lowerCol.includes('conversion') || lowerCol.includes('ls')) {
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

                const value = (row as any)[dataKey]
                if (typeof value === 'number') {
                    totalsArray[idx] += value
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
                                        if (columnName === 'Conversion %') dataKey = 'conversionPercentage'
                                        if (columnName === 'LS #s') dataKey = 'lsNumbers'
                                        if (columnName === 'API Key') dataKey = 'apiKey'

                                        const value = (row as any)[dataKey]
                                        const isLinkColumn = linkColumn && columnName === linkColumn

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
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)
    const [selectedCountry, setSelectedCountry] = useState<string>('all')

    // Memoize data generation to prevent hydration errors
    const hourlyData = React.useMemo(() => data(), [])
    const monthlyData = React.useMemo(() => dataTwoMonth(), [])

    // Memoize all mock data generators
    const partnerData = React.useMemo(() => generateMockPartnerData(), [])
    const boardData = React.useMemo(() => generateMockBoardData(), [])
    const placementData = React.useMemo(() => generateMockPlacementData(), [])
    const sourceData = React.useMemo(() => generateMockSourceData(), [])
    const mediumData = React.useMemo(() => generateMockMediumData(), [])
    const keywordsData = React.useMemo(() => generateMockKeywordsData(), [])
    const companiesData = React.useMemo(() => generateMockCompaniesData(), [])
    const apiKeyData = React.useMemo(() => generateMockApiKeyData(), [])
    const adsData = React.useMemo(() => generateMockAdsData(), [])

    const formatDateRange = () => {
        if (!dateRange?.from) return 'Select range'
        if (!dateRange.to) return format(dateRange.from, 'MMM d, yyyy')
        return `${format(dateRange.from, 'MMM d, yyyy')} - ${format(dateRange.to, 'MMM d, yyyy')}`
    }

    return (
        <div>
            <div className="mb-4 border-b pb-2">
                <h2 className="text-lg font-semibold">Ads</h2>
                <p className="text-sm text-muted-foreground">Manage all of the sponsored ads</p>
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
                <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="reports">Reports</TabsTrigger>
                    <TabsTrigger value="ads">Ads</TabsTrigger>
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
                                            className="w-[280px] justify-start text-left font-normal"
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
                                    <SelectTrigger className="w-[200px]">
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
                    <Tabs defaultValue="partner">
                        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
                            <TabsTrigger value="partner">Partner</TabsTrigger>
                            <TabsTrigger value="board">Board</TabsTrigger>
                            <TabsTrigger value="placement">Placement</TabsTrigger>
                            <TabsTrigger value="source">Source</TabsTrigger>
                            <TabsTrigger value="medium">Medium</TabsTrigger>
                            <TabsTrigger value="keywords">Keywords</TabsTrigger>
                            <TabsTrigger value="companies">Companies</TabsTrigger>
                            <TabsTrigger value="apikey">API Key</TabsTrigger>
                        </TabsList>

                        {/* Partner Table */}
                        <TabsContent value="partner">
                            <ReportTable
                                columns={['Date', 'Partner', 'Impressions', 'Clicks', 'CPC', 'CTR', 'RPM', 'Conversion', 'Conversion %', 'CPA', 'Revenue', 'LS #s', 'Clicks Hourly']}
                                data={partnerData}
                                linkColumn="Partner"
                                linkPath="/dashboard/partners"
                                linkSuffix="/sponsored-ads"
                            />
                        </TabsContent>

                        {/* Board Table */}
                        <TabsContent value="board">
                            <ReportTable
                                columns={['Date', 'Board', 'Impressions', 'Clicks', 'CTR', 'RPM', 'Revenue']}
                                data={boardData}
                            />
                        </TabsContent>

                        {/* Placement Table */}
                        <TabsContent value="placement">
                            <ReportTable
                                columns={['Date', 'Placement', 'Impressions', 'Clicks', 'Avg. CPC', 'CTR', 'RPM', 'Conversion', 'Conversion %', 'CPA', 'Revenue']}
                                data={placementData}
                            />
                        </TabsContent>

                        {/* Source Table */}
                        <TabsContent value="source">
                            <ReportTable
                                columns={['Date', 'Source', 'Impressions', 'Clicks', 'Avg. CPC', 'CTR', 'RPM', 'Conversion', 'Conversion %', 'CPA', 'Revenue']}
                                data={sourceData}
                            />
                        </TabsContent>

                        {/* Medium Table */}
                        <TabsContent value="medium">
                            <ReportTable
                                columns={['Date', 'Medium', 'Impressions', 'Clicks', 'Avg. CPC', 'CTR', 'RPM', 'Conversion', 'Conversion %', 'CPA', 'Revenue']}
                                data={mediumData}
                            />
                        </TabsContent>

                        {/* Keywords Table */}
                        <TabsContent value="keywords">
                            <ReportTable
                                columns={['Date', 'Keyword', 'Impressions', 'Clicks', 'Avg. CPC', 'CTR', 'RPM', 'Conversion', 'Conversion %', 'CPA', 'Revenue']}
                                data={keywordsData}
                            />
                        </TabsContent>

                        {/* Companies Table */}
                        <TabsContent value="companies">
                            <ReportTable
                                columns={['Date', 'Company', 'Impressions', 'Clicks', 'Avg. CPC', 'CTR', 'RPM', 'Conversion', 'Conversion %', 'CPA', 'Revenue']}
                                data={companiesData}
                            />
                        </TabsContent>

                        {/* API Key Table */}
                        <TabsContent value="apikey">
                            <ReportTable
                                columns={['Date', 'API Key', 'Impressions', 'Clicks', 'Avg. CPC', 'CTR', 'RPM', 'Conversion', 'Conversion %', 'CPA', 'Revenue']}
                                data={apiKeyData}
                                linkColumn="API Key"
                                linkPath="/dashboard/publishers/syndicates"
                            />
                        </TabsContent>
                    </Tabs>
                </TabsContent>

                {/* Ads Tab */}
                <TabsContent value="ads">
                    <Card size="sm">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Placement</TableHead>
                                        <TableHead>Nickname</TableHead>
                                        <TableHead>Unique ID</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Created At</TableHead>
                                        <TableHead>Updated At</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {adsData.map((ad) => (
                                        <TableRow key={ad.id}>
                                            <TableCell>
                                                <Link
                                                    href={`/dashboard/ads/sponsored/${ad.id}`}
                                                    className="text-primary hover:underline font-medium"
                                                >
                                                    {ad.title}
                                                </Link>
                                            </TableCell>
                                            <TableCell>{ad.placement}</TableCell>
                                            <TableCell>{ad.nickname}</TableCell>
                                            <TableCell>{ad.uniqueId}</TableCell>
                                            <TableCell>
                                                <Badge variant={ad.status === 'active' ? 'default' : 'secondary'}>
                                                    {ad.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{ad.createdAt}</TableCell>
                                            <TableCell>{ad.updatedAt}</TableCell>
                                            <TableCell>
                                                <Button size="sm" variant="outline" asChild>
                                                    <Link href={`/dashboard/ads/sponsored/${ad.id}`}>
                                                        View
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

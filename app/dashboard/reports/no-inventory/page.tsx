"use client"

import * as React from 'react'
import { format } from 'date-fns'
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
import { Field, FieldGroup, FieldLabel, FieldContent } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  SearchIcon,
  CalendarIcon,
  FileDownIcon,
  CopyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react'
import { useState } from 'react'

// Mock data for no inventory report
const mockData = [
  {
    id: '1',
    origin: 'Google Ads',
    placement: 'Search Network - Top',
    keyword: 'best running shoes',
    blockedReports: 12,
  },
  {
    id: '2',
    origin: 'Facebook',
    placement: 'News Feed - Mobile',
    keyword: 'fitness equipment',
    blockedReports: 8,
  },
  {
    id: '3',
    origin: 'Bing Ads',
    placement: 'Search - Mainline',
    keyword: 'workout gear',
    blockedReports: 5,
  },
  {
    id: '4',
    origin: 'Google Ads',
    placement: 'Display Network - Sidebar',
    keyword: 'running accessories',
    blockedReports: 15,
  },
  {
    id: '5',
    origin: 'TikTok',
    placement: 'For You Page',
    keyword: 'sportswear',
    blockedReports: 3,
  },
]

type NoInventoryReport = {
  id: string
  origin: string
  placement: string
  keyword: string
  blockedReports: number
}

type DateRange = {
  from: Date | undefined
  to?: Date | undefined
}

export default function NoInventoryReportPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  // Simple client-side filtering
  const filteredData = mockData.filter((item) => {
    const matchesSearch =
      searchQuery === '' ||
      item.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.placement.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.keyword.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSearch
  })

  const formatDateRange = () => {
    if (!dateRange?.from) return 'Select range'
    if (!dateRange.to) return format(dateRange.from, 'MMM d, yyyy')
    return `${format(dateRange.from, 'MMM d, yyyy')} - ${format(dateRange.to, 'MMM d, yyyy')}`
  }

  // Function to convert data to CSV format
  const convertToCSV = (data: NoInventoryReport[]) => {
    const headers = ['Origin', 'Placement', 'Keyword', 'Blocked Reports']
    const rows = data.map((item) => [
      item.origin,
      item.placement,
      item.keyword,
      item.blockedReports.toString(),
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n')

    return csvContent
  }

  // Function to download as CSV
  const downloadCSV = () => {
    const csv = convertToCSV(filteredData)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `no-inventory-report-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  // Function to copy to clipboard
  const copyToClipboard = async () => {
    const csv = convertToCSV(filteredData)
    try {
      await navigator.clipboard.writeText(csv)
      // Could add a toast notification here
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
    }
  }

  return (
    <div className="flex flex-col gap-y-4">
      <Card>
        <CardHeader>
          <CardTitle>No Inventory Report</CardTitle>
          <CardDescription>View placements and keywords with blocked inventory reports</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <FieldGroup className="mb-4">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <Field className="flex-1">
                <FieldLabel>Search</FieldLabel>
                <FieldContent>
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by origin, placement, or keyword..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </FieldContent>
              </Field>

              {/* Date Range Button */}
              <Field className="sm:w-[280px]">
                <FieldLabel>Date Range</FieldLabel>
                <FieldContent>
                  <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                        type="button"
                      >
                        <CalendarIcon className="size-4 mr-2" />
                        {formatDateRange()}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="range"
                        selected={{
                          from: dateRange?.from,
                          to: dateRange?.to
                        }}
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
                </FieldContent>
              </Field>

              {/* Export Buttons */}
              <Field className="sm:w-auto">
                <FieldLabel>Export</FieldLabel>
                <FieldContent>
                  <div className="flex gap-2">
                    <Button variant="outline" type="button" onClick={downloadCSV}>
                      <FileDownIcon className="size-4 mr-2" />
                      CSV
                    </Button>
                    <Button variant="outline" type="button" onClick={copyToClipboard}>
                      <CopyIcon className="size-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                </FieldContent>
              </Field>
            </div>
          </FieldGroup>

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Origin</TableHead>
                <TableHead>Placement</TableHead>
                <TableHead>Keyword</TableHead>
                <TableHead className="text-right">Blocked Reports</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No inventory reports found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.origin}</TableCell>
                    <TableCell>{item.placement}</TableCell>
                    <TableCell>
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {item.keyword}
                      </code>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
                        {item.blockedReports}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {filteredData.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <span className="text-xs text-muted-foreground">
                Showing {filteredData.length} results
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" type="button">
                  <ChevronLeftIcon className="size-4" />
                  Previous
                </Button>
                <Button variant="outline" size="sm" type="button">
                  Next
                  <ChevronRightIcon className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

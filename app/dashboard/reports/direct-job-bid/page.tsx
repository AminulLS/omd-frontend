"use client"

import * as React from 'react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  SearchIcon,
  CalendarIcon,
  FileDownIcon,
  CopyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react'
import { useState } from 'react'
import { COUNTRIES } from '@/lib/constants/countries'

type DirectJobBidData = {
  id: string
  date: Date
  country: keyof typeof COUNTRIES
  category: string
  clicks: number
  cpcMin: number
  cpcAvg: number
  cpcMax: number
}

type DateRange = {
  from: Date | undefined
  to?: Date | undefined
}

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50, 100]

// Categories for the report
const CATEGORIES = [
  'Healthcare',
  'Insurance',
  'Education',
  'Technology',
  'Finance',
  'Real Estate',
  'Automotive',
  'Travel',
  'Entertainment',
  'Retail',
] as const

// Helper to generate mock direct job bid data (deterministic to avoid hydration errors)
const generateMockData = (count: number): DirectJobBidData[] => {
  const countries: (keyof typeof COUNTRIES)[] = ['US', 'CA', 'GB', 'DE', 'FR', 'IN', 'ZA', 'AU']

  // Deterministic pseudo-random number generator
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000
    return x - Math.floor(x)
  }

  // Generate data for the last 30 days
  const today = new Date()
  const data: DirectJobBidData[] = []

  for (let day = 0; day < 30; day++) {
    const date = new Date(today)
    date.setDate(date.getDate() - day)

    countries.forEach((country, countryIndex) => {
      CATEGORIES.forEach((category, categoryIndex) => {
        const seed = `${country}-${category}-${day}`.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)

        const clicks = Math.floor(seededRandom(seed + 1) * 10000) + 100
        const cpcMin = parseFloat((seededRandom(seed + 2) * 0.5 + 0.1).toFixed(2))
        const cpcAvg = parseFloat((cpcMin + seededRandom(seed + 3) * 1.5).toFixed(2))
        const cpcMax = parseFloat((cpcAvg + seededRandom(seed + 4) * 1.0).toFixed(2))

        data.push({
          id: `${country}-${category}-${day}`,
          date,
          country,
          category,
          clicks,
          cpcMin,
          cpcAvg,
          cpcMax,
        })
      })
    })
  }

  return data.slice(0, count)
}

const mockData: DirectJobBidData[] = generateMockData(2400)

export default function DirectJobBidPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Filter data
  const filteredData = React.useMemo(() => {
    return mockData.filter((item) => {
      // Country filter
      const matchesCountry = selectedCountry === 'all' || item.country === selectedCountry

      // Date range filter
      let matchesDateRange = true
      if (dateRange?.from) {
        const itemDate = new Date(item.date)
        itemDate.setHours(0, 0, 0, 0)
        const fromDate = new Date(dateRange.from)
        fromDate.setHours(0, 0, 0, 0)

        matchesDateRange = itemDate >= fromDate

        if (dateRange.to) {
          const toDate = new Date(dateRange.to)
          toDate.setHours(23, 59, 59, 999)
          matchesDateRange = matchesDateRange && itemDate <= toDate
        }
      }

      // Search filter
      const matchesSearch =
        searchQuery === '' ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        format(item.date, 'yyyy-MM-dd').toLowerCase().includes(searchQuery.toLowerCase())

      return matchesCountry && matchesDateRange && matchesSearch
    })
  }, [selectedCountry, dateRange, searchQuery])

  // Sort by date descending
  const sortedData = React.useMemo(() => {
    return [...filteredData].sort((a, b) => b.date.getTime() - a.date.getTime())
  }, [filteredData])

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedData = sortedData.slice(startIndex, endIndex)

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, itemsPerPage, selectedCountry, dateRange])

  // Handle items per page change
  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value))
    setCurrentPage(1)
  }

  // Function to convert data to CSV format
  const convertToCSV = (data: DirectJobBidData[]) => {
    const headers = [
      'Date',
      'Country',
      'Category',
      'Clicks',
      'CPC Min',
      'CPC Avg',
      'CPC Max',
    ]

    const rows = data.map((item) => [
      format(item.date, 'yyyy-MM-dd'),
      COUNTRIES[item.country],
      item.category,
      item.clicks.toString(),
      item.cpcMin.toFixed(2),
      item.cpcAvg.toFixed(2),
      item.cpcMax.toFixed(2),
    ])

    return [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n')
  }

  // Function to download as CSV
  const downloadCSV = () => {
    const csv = convertToCSV(sortedData)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `direct-job-bid-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  // Function to copy to clipboard
  const copyToClipboard = async () => {
    const csv = convertToCSV(sortedData)
    try {
      await navigator.clipboard.writeText(csv)
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
    }
  }

  const formatDateRange = () => {
    if (!dateRange?.from) return 'Select range'
    if (!dateRange.to) return format(dateRange.from, 'yyyy-MM-dd')
    return `${format(dateRange.from, 'yyyy-MM-dd')} - ${format(dateRange.to, 'yyyy-MM-dd')}`
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div>
        <div className="mb-4 border-b pb-2">
          <h2 className="text-lg font-semibold">Direct Job Bid Report</h2>
          <p className="text-sm text-muted-foreground">View direct job bid performance metrics by category</p>
        </div>

        {/* Global Filters */}
        <FieldGroup className="mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Country Filter */}
            <Field className="sm:w-[180px]">
              <FieldLabel>Country</FieldLabel>
              <FieldContent>
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    {Object.entries(COUNTRIES).map(([code, name]) => (
                      <SelectItem key={code} value={code}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              </FieldContent>
            </Field>

            {/* Search */}
            <Field className="flex-1">
              <FieldLabel>Search</FieldLabel>
              <FieldContent>
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by category or date..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </FieldContent>
            </Field>
          </div>
        </FieldGroup>

        {/* Export buttons */}
        <div className="flex justify-end gap-2 mb-4">
          {sortedData.length > 0 && (
            <>
              <Button variant="outline" size="sm" type="button" onClick={downloadCSV}>
                <FileDownIcon className="size-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="outline" size="sm" type="button" onClick={copyToClipboard}>
                <CopyIcon className="size-4 mr-2" />
                Copy
              </Button>
            </>
          )}
        </div>

        {/* Table */}
        <div className="border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Clicks</TableHead>
                <TableHead className="text-right">CPC Min</TableHead>
                <TableHead className="text-right">CPC Avg</TableHead>
                <TableHead className="text-right">CPC Max</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No results found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium whitespace-nowrap">
                      {format(item.date, 'yyyy-MM-dd')}
                    </TableCell>
                    <TableCell>{COUNTRIES[item.country]}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell className="text-right">{item.clicks.toLocaleString()}</TableCell>
                    <TableCell className="text-right">${item.cpcMin.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${item.cpcAvg.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${item.cpcMax.toFixed(2)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {sortedData.length > itemsPerPage && (
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground">
                Showing {startIndex + 1}-{Math.min(endIndex, sortedData.length)} of {sortedData.length} results
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
                <ChevronLeftIcon className="size-4" />
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  const showPage =
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)

                  if (!showPage) {
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
                      variant={currentPage === page ? "default" : "outline"}
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
                <ChevronRightIcon className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

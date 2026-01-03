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

type SourcePlacementData = {
  id: string
  date: Date
  source: string // alpha-num, 5 chars
  country: keyof typeof COUNTRIES
  serpTopClicks: number
  serpTopAds: number
  serpMidClicks: number
  serpMidAds: number
  return2Clicks: number
  return2Ads: number
  pecReturn2Clicks: number
  pecReturn2Ads: number
  pecReturnClicks: number
  pecReturnAds: number
  pec2Clicks: number
  pec2Ads: number
  pecClicks: number
  pecAds: number
  flow2Clicks: number
  flow2Ads: number
  flowClicks: number
  flowAds: number
}

type DateRange = {
  from: Date | undefined
  to?: Date | undefined
}

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50, 100]

// Helper to generate mock source placement data (deterministic to avoid hydration errors)
const generateMockData = (count: number): SourcePlacementData[] => {
  const sources = ['SRC01', 'SRC02', 'SRC03', 'SRC04', 'SRC05', 'SRC06', 'SRC07', 'SRC08', 'SRC09', 'SRC10',
                   'SRC11', 'SRC12', 'SRC13', 'SRC14', 'SRC15', 'SRC16', 'SRC17', 'SRC18', 'SRC19', 'SRC20']
  const countries: (keyof typeof COUNTRIES)[] = ['US', 'CA', 'GB', 'DE', 'FR', 'IN', 'ZA', 'AU', 'JP', 'BR']

  // Deterministic pseudo-random number generator
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000
    return x - Math.floor(x)
  }

  // Generate data for the last 30 days
  const today = new Date()
  const data: SourcePlacementData[] = []

  for (let day = 0; day < 30; day++) {
    const date = new Date(today)
    date.setDate(date.getDate() - day)

    sources.forEach((source, sourceIndex) => {
      const country = countries[sourceIndex % countries.length]
      const seed = `${source}-${day}`.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)

      data.push({
        id: `${source}-${day}`,
        date,
        source,
        country,
        serpTopClicks: Math.floor(seededRandom(seed + 1) * 5000) + 100,
        serpTopAds: Math.floor(seededRandom(seed + 2) * 50) + 5,
        serpMidClicks: Math.floor(seededRandom(seed + 3) * 3000) + 50,
        serpMidAds: Math.floor(seededRandom(seed + 4) * 40) + 3,
        return2Clicks: Math.floor(seededRandom(seed + 5) * 2000) + 20,
        return2Ads: Math.floor(seededRandom(seed + 6) * 30) + 2,
        pecReturn2Clicks: Math.floor(seededRandom(seed + 7) * 1500) + 10,
        pecReturn2Ads: Math.floor(seededRandom(seed + 8) * 25) + 2,
        pecReturnClicks: Math.floor(seededRandom(seed + 9) * 1000) + 10,
        pecReturnAds: Math.floor(seededRandom(seed + 10) * 20) + 1,
        pec2Clicks: Math.floor(seededRandom(seed + 11) * 800) + 5,
        pec2Ads: Math.floor(seededRandom(seed + 12) * 15) + 1,
        pecClicks: Math.floor(seededRandom(seed + 13) * 600) + 5,
        pecAds: Math.floor(seededRandom(seed + 14) * 12) + 1,
        flow2Clicks: Math.floor(seededRandom(seed + 15) * 400) + 2,
        flow2Ads: Math.floor(seededRandom(seed + 16) * 10) + 1,
        flowClicks: Math.floor(seededRandom(seed + 17) * 200) + 1,
        flowAds: Math.floor(seededRandom(seed + 18) * 8) + 1,
      })
    })
  }

  return data.slice(0, count)
}

const mockData: SourcePlacementData[] = generateMockData(600)

// Helper component to display clicks and ads
function ClicksAndAds({ clicks, ads }: { clicks: number; ads: number }) {
  return (
    <div className="text-right">
      <div className="font-medium">{clicks.toLocaleString()}</div>
      <div className="text-xs text-muted-foreground">({ads.toLocaleString()})</div>
    </div>
  )
}

export default function SourcePlacementPage() {
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
        item.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
  const convertToCSV = (data: SourcePlacementData[]) => {
    const headers = [
      'Date',
      'Source',
      'Country',
      'SERP Top Clicks',
      'SERP Top Ads',
      'SERP Mid Clicks',
      'SERP Mid Ads',
      'Return 2 Clicks',
      'Return 2 Ads',
      'PEC Return 2 Clicks',
      'PEC Return 2 Ads',
      'PEC Return Clicks',
      'PEC Return Ads',
      'PEC 2 Clicks',
      'PEC 2 Ads',
      'PEC Clicks',
      'PEC Ads',
      'Flow 2 Clicks',
      'Flow 2 Ads',
      'Flow Clicks',
      'Flow Ads',
    ]

    const rows = data.map((item) => [
      format(item.date, 'yyyy-MM-dd'),
      item.source,
      COUNTRIES[item.country],
      item.serpTopClicks.toString(),
      item.serpTopAds.toString(),
      item.serpMidClicks.toString(),
      item.serpMidAds.toString(),
      item.return2Clicks.toString(),
      item.return2Ads.toString(),
      item.pecReturn2Clicks.toString(),
      item.pecReturn2Ads.toString(),
      item.pecReturnClicks.toString(),
      item.pecReturnAds.toString(),
      item.pec2Clicks.toString(),
      item.pec2Ads.toString(),
      item.pecClicks.toString(),
      item.pecAds.toString(),
      item.flow2Clicks.toString(),
      item.flow2Ads.toString(),
      item.flowClicks.toString(),
      item.flowAds.toString(),
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
    link.download = `source-placement-${new Date().toISOString().split('T')[0]}.csv`
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
          <h2 className="text-lg font-semibold">Source Placement Report</h2>
          <p className="text-sm text-muted-foreground">View source performance metrics by placement type</p>
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
                    placeholder="Search by source or date..."
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
                <TableHead>Source</TableHead>
                <TableHead>Country</TableHead>
                <TableHead className="text-right">SERP Top</TableHead>
                <TableHead className="text-right">SERP Mid</TableHead>
                <TableHead className="text-right">Return 2</TableHead>
                <TableHead className="text-right">PEC Return 2</TableHead>
                <TableHead className="text-right">PEC Return</TableHead>
                <TableHead className="text-right">PEC 2</TableHead>
                <TableHead className="text-right">PEC</TableHead>
                <TableHead className="text-right">Flow 2</TableHead>
                <TableHead className="text-right">Flow</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={12} className="text-center text-muted-foreground">
                    No results found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium whitespace-nowrap">
                      {format(item.date, 'yyyy-MM-dd')}
                    </TableCell>
                    <TableCell>
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {item.source}
                      </code>
                    </TableCell>
                    <TableCell>{COUNTRIES[item.country]}</TableCell>
                    <TableCell>
                      <ClicksAndAds clicks={item.serpTopClicks} ads={item.serpTopAds} />
                    </TableCell>
                    <TableCell>
                      <ClicksAndAds clicks={item.serpMidClicks} ads={item.serpMidAds} />
                    </TableCell>
                    <TableCell>
                      <ClicksAndAds clicks={item.return2Clicks} ads={item.return2Ads} />
                    </TableCell>
                    <TableCell>
                      <ClicksAndAds clicks={item.pecReturn2Clicks} ads={item.pecReturn2Ads} />
                    </TableCell>
                    <TableCell>
                      <ClicksAndAds clicks={item.pecReturnClicks} ads={item.pecReturnAds} />
                    </TableCell>
                    <TableCell>
                      <ClicksAndAds clicks={item.pec2Clicks} ads={item.pec2Ads} />
                    </TableCell>
                    <TableCell>
                      <ClicksAndAds clicks={item.pecClicks} ads={item.pecAds} />
                    </TableCell>
                    <TableCell>
                      <ClicksAndAds clicks={item.flow2Clicks} ads={item.flow2Ads} />
                    </TableCell>
                    <TableCell>
                      <ClicksAndAds clicks={item.flowClicks} ads={item.flowAds} />
                    </TableCell>
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

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
import { PLACEMENTS, getPlacementLabel, type PlacementSlug } from '@/lib/constants/placements'
import { COUNTRIES } from '@/lib/constants/countries'

// Mock data for no inventory report
const mockData = [
  {
    id: '1',
    origin: 'Google',
    placement: 'redirect' as PlacementSlug,
    keyword: 'medicare supplement plans',
    country: 'US' as keyof typeof COUNTRIES,
    blockedReports: 12,
  },
  {
    id: '2',
    origin: 'Bing',
    placement: 'serp-top' as PlacementSlug,
    keyword: 'health insurance for seniors',
    country: 'CA' as keyof typeof COUNTRIES,
    blockedReports: 8,
  },
  {
    id: '3',
    origin: 'Facebook',
    placement: 'return' as PlacementSlug,
    keyword: 'medicare advantage plans',
    country: 'GB' as keyof typeof COUNTRIES,
    blockedReports: 5,
  },
  {
    id: '4',
    origin: 'Google',
    placement: 'external-sms' as PlacementSlug,
    keyword: 'dentist near me',
    country: 'US' as keyof typeof COUNTRIES,
    blockedReports: 15,
  },
  {
    id: '5',
    origin: 'Bing',
    placement: 'serp-mid' as PlacementSlug,
    keyword: 'car insurance quotes',
    country: 'IN' as keyof typeof COUNTRIES,
    blockedReports: 3,
  },
  {
    id: '6',
    origin: 'Facebook',
    placement: 'serp-bottom' as PlacementSlug,
    keyword: 'auto insurance comparison',
    country: 'ZA' as keyof typeof COUNTRIES,
    blockedReports: 7,
  },
  {
    id: '7',
    origin: 'Google',
    placement: 'bb' as PlacementSlug,
    keyword: 'life insurance rates',
    country: 'US' as keyof typeof COUNTRIES,
    blockedReports: 22,
  },
  {
    id: '8',
    origin: 'Bing',
    placement: 'flow' as PlacementSlug,
    keyword: 'home insurance quotes',
    country: 'FR' as keyof typeof COUNTRIES,
    blockedReports: 9,
  },
  {
    id: '9',
    origin: 'Facebook',
    placement: 'return-2' as PlacementSlug,
    keyword: 'renters insurance',
    country: 'DE' as keyof typeof COUNTRIES,
    blockedReports: 11,
  },
  {
    id: '10',
    origin: 'Google',
    placement: 'path' as PlacementSlug,
    keyword: 'pet insurance reviews',
    country: 'CA' as keyof typeof COUNTRIES,
    blockedReports: 6,
  },
  {
    id: '11',
    origin: 'Bing',
    placement: 'flow-2' as PlacementSlug,
    keyword: 'travel insurance',
    country: 'GB' as keyof typeof COUNTRIES,
    blockedReports: 18,
  },
  {
    id: '12',
    origin: 'Facebook',
    placement: 'pec' as PlacementSlug,
    keyword: 'business insurance',
    country: 'US' as keyof typeof COUNTRIES,
    blockedReports: 4,
  },
  {
    id: '13',
    origin: 'Google',
    placement: 'pec-return' as PlacementSlug,
    keyword: 'disability insurance',
    country: 'IN' as keyof typeof COUNTRIES,
    blockedReports: 14,
  },
  {
    id: '14',
    origin: 'Bing',
    placement: 'offer-1' as PlacementSlug,
    keyword: 'insurance brokers',
    country: 'ZA' as keyof typeof COUNTRIES,
    blockedReports: 25,
  },
  {
    id: '15',
    origin: 'Facebook',
    placement: 'serp' as PlacementSlug,
    keyword: 'insurance agents',
    country: 'FR' as keyof typeof COUNTRIES,
    blockedReports: 10,
  },
  {
    id: '16',
    origin: 'Google',
    placement: 'pec-2' as PlacementSlug,
    keyword: 'cheap car insurance',
    country: 'DE' as keyof typeof COUNTRIES,
    blockedReports: 8,
  },
  {
    id: '17',
    origin: 'Bing',
    placement: 'pec-return-2' as PlacementSlug,
    keyword: 'best home insurance',
    country: 'US' as keyof typeof COUNTRIES,
    blockedReports: 5,
  },
  {
    id: '18',
    origin: 'Facebook',
    placement: 'serp-all' as PlacementSlug,
    keyword: 'insurance company ratings',
    country: 'CA' as keyof typeof COUNTRIES,
    blockedReports: 13,
  },
  {
    id: '19',
    origin: 'Google',
    placement: 'internal-sms' as PlacementSlug,
    keyword: 'insurance claims',
    country: 'GB' as keyof typeof COUNTRIES,
    blockedReports: 19,
  },
  {
    id: '20',
    origin: 'Bing',
    placement: 'external-nonbillable-sms' as PlacementSlug,
    keyword: 'insurance deductible',
    country: 'IN' as keyof typeof COUNTRIES,
    blockedReports: 16,
  },
  {
    id: '21',
    origin: 'Facebook',
    placement: 'sponsored-serp' as PlacementSlug,
    keyword: 'insurance premium',
    country: 'ZA' as keyof typeof COUNTRIES,
    blockedReports: 7,
  },
  {
    id: '22',
    origin: 'Google',
    placement: 'sponsored-bb' as PlacementSlug,
    keyword: 'insurance policy',
    country: 'FR' as keyof typeof COUNTRIES,
    blockedReports: 21,
  },
  {
    id: '23',
    origin: 'Bing',
    placement: 'serp-large' as PlacementSlug,
    keyword: 'insurance coverage',
    country: 'DE' as keyof typeof COUNTRIES,
    blockedReports: 9,
  },
  {
    id: '24',
    origin: 'Facebook',
    placement: 'offer-2' as PlacementSlug,
    keyword: 'insurance quote online',
    country: 'US' as keyof typeof COUNTRIES,
    blockedReports: 28,
  },
  {
    id: '25',
    origin: 'Google',
    placement: 'offer-3' as PlacementSlug,
    keyword: 'insurance calculator',
    country: 'CA' as keyof typeof COUNTRIES,
    blockedReports: 12,
  },
  {
    id: '26',
    origin: 'Bing',
    placement: 'offer-4' as PlacementSlug,
    keyword: 'insurance discounts',
    country: 'GB' as keyof typeof COUNTRIES,
    blockedReports: 17,
  },
  {
    id: '27',
    origin: 'Facebook',
    placement: 'serp-offer' as PlacementSlug,
    keyword: 'insurance providers',
    country: 'IN' as keyof typeof COUNTRIES,
    blockedReports: 6,
  },
  {
    id: '28',
    origin: 'Google',
    placement: 'offer-6' as PlacementSlug,
    keyword: 'insurance plans',
    country: 'ZA' as keyof typeof COUNTRIES,
    blockedReports: 23,
  },
  {
    id: '29',
    origin: 'Bing',
    placement: 'offer-5' as PlacementSlug,
    keyword: 'insurance types',
    country: 'FR' as keyof typeof COUNTRIES,
    blockedReports: 11,
  },
  {
    id: '30',
    origin: 'Facebook',
    placement: 'offer-7' as PlacementSlug,
    keyword: 'insurance terms',
    country: 'DE' as keyof typeof COUNTRIES,
    blockedReports: 8,
  },
  {
    id: '31',
    origin: 'Google',
    placement: 'medicare' as PlacementSlug,
    keyword: 'medicare part b',
    country: 'US' as keyof typeof COUNTRIES,
    blockedReports: 33,
  },
  {
    id: '32',
    origin: 'Bing',
    placement: 'blur' as PlacementSlug,
    keyword: 'medicare part d',
    country: 'CA' as keyof typeof COUNTRIES,
    blockedReports: 4,
  },
  {
    id: '33',
    origin: 'Facebook',
    placement: 'listical' as PlacementSlug,
    keyword: 'insurance tips',
    country: 'GB' as keyof typeof COUNTRIES,
    blockedReports: 15,
  },
  {
    id: '34',
    origin: 'Google',
    placement: 'internal-email' as PlacementSlug,
    keyword: 'insurance guide',
    country: 'IN' as keyof typeof COUNTRIES,
    blockedReports: 20,
  },
  {
    id: '35',
    origin: 'Bing',
    placement: 'serp-top' as PlacementSlug,
    keyword: 'insurance help',
    country: 'ZA' as keyof typeof COUNTRIES,
    blockedReports: 9,
  },
]

type NoInventoryReport = {
  id: string
  origin: string
  placement: PlacementSlug
  keyword: string
  country: keyof typeof COUNTRIES
  blockedReports: number
}

type DateRange = {
  from: Date | undefined
  to?: Date | undefined
}

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50, 100]

export default function NoInventoryReportPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Simple client-side filtering
  const filteredData = mockData.filter((item) => {
    const matchesSearch =
      searchQuery === '' ||
      item.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getPlacementLabel(item.placement).toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.keyword.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCountry = selectedCountry === 'all' || item.country === selectedCountry

    return matchesSearch && matchesCountry
  })

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedData = filteredData.slice(startIndex, endIndex)

  // Reset to page 1 when search query, items per page, or country changes
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, itemsPerPage, selectedCountry])

  // Handle items per page change
  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value))
    setCurrentPage(1)
  }

  const formatDateRange = () => {
    if (!dateRange?.from) return 'Select range'
    if (!dateRange.to) return format(dateRange.from, 'MMM d, yyyy')
    return `${format(dateRange.from, 'MMM d, yyyy')} - ${format(dateRange.to, 'MMM d, yyyy')}`
  }

  // Function to convert data to CSV format
  const convertToCSV = (data: NoInventoryReport[]) => {
    const headers = ['Origin', 'Placement', 'Keyword', 'Country', 'Blocked Reports']
    const rows = data.map((item) => [
      item.origin,
      getPlacementLabel(item.placement),
      item.keyword,
      COUNTRIES[item.country],
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
      <div>
        <div className="mb-4 border-b pb-2">
          <h2 className="text-lg font-semibold">No Inventory Report</h2>
          <p className="text-sm text-muted-foreground">View placements and keywords with blocked inventory reports</p>
        </div>
        <div>
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
          <div className="border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Origin</TableHead>
                  <TableHead>Placement</TableHead>
                  <TableHead>Keyword</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead className="text-right">Blocked Reports</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No inventory reports found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.origin}</TableCell>
                      <TableCell>{getPlacementLabel(item.placement)}</TableCell>
                      <TableCell>
                        <code className="text-sm bg-muted px-2 py-1 rounded">
                          {item.keyword}
                        </code>
                      </TableCell>
                      <TableCell>{COUNTRIES[item.country]}</TableCell>
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
          </div>

          {/* Pagination */}
          {filteredData.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-4">
                <span className="text-xs text-muted-foreground">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredData.length)} of {filteredData.length} results
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
    </div>
  )
}

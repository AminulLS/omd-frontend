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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  SearchIcon,
  CalendarIcon,
  FileDownIcon,
  CopyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { COUNTRIES } from '@/lib/constants/countries'

type PlacementSlug =
  | 'path'
  | 'offer-1'
  | 'offer-2'
  | 'offer-3'
  | 'offer-4'
  | 'serp-offer'
  | 'listical'

type PlacementAd = {
  id: string
  partnerId: string
  partner: string
  placement: PlacementSlug
  title: string
  nickname: string
  country: keyof typeof COUNTRIES
  impressions: number
  clicks: number
  avgCpc: number
  conversionsPercentage: number
  cpa: number
  cpc: number
  rpm: number
  revenue: number
  budget: number
  balance: number
  weight: number
  score: number
}

// Placement tabs configuration
const PLACEMENT_TABS = [
  { value: 'all', label: 'All' },
  { value: 'path', label: 'Path' },
  { value: 'offer-1', label: 'Offer 1' },
  { value: 'offer-2', label: 'Offer 2' },
  { value: 'offer-3', label: 'Offer 3' },
  { value: 'offer-4', label: 'Offer 4' },
  { value: 'serp-offer', label: 'SERP Offer' },
  { value: 'listical', label: 'Listical' },
] as const

// Helper to generate mock ads for a placement (deterministic to avoid hydration errors)
const generateMockAds = (placement: PlacementSlug, count: number): PlacementAd[] => {
  const partners = ['Google', 'Indeed', 'LinkedIn', 'Dice', 'Hired', 'AngelList', 'Talent.com', 'ZipRecruiter', 'Jobrapido', 'SimplyHired', 'Jooble', 'Glassdoor', 'We Work Remotely', 'FlexJobs', 'Remote.co', 'Monster', 'CareerBuilder', 'Snagajob', 'Adzuna', 'Idealist']
  const countries: (keyof typeof COUNTRIES)[] = ['US', 'CA', 'GB', 'DE', 'FR', 'IN', 'ZA', 'AU', 'JP', 'BR']
  const titles = [
    'Best Remote Jobs 2024', 'Hiring Now - Tech Jobs', 'Premium Job Listings', 'Tech & IT Jobs',
    'Tech Job Matching', 'Startup Jobs', 'Job Search Engine', 'Apply with One Click',
    'Find Jobs Fast', 'Local Job Search', 'Job Aggregator', 'Salary & Company Reviews',
    'Remote Jobs', 'Flexible Remote Work', 'Remote-First Companies', 'Find Your Dream Job',
    'Top Remote Opportunities', 'Hourly Jobs Near You', 'Millions of Jobs', 'Non-Profit Careers',
    'Government Positions', 'Startup Careers', 'Career Resources', 'Company Culture Jobs',
    'Verified Job Listings', 'Executive Positions', 'Part-Time Jobs', 'Full-Time Careers',
    'Internship Programs', 'Entry Level Jobs', 'Senior Management Roles', 'Consulting Jobs'
  ]

  // Deterministic pseudo-random number generator
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000
    return x - Math.floor(x)
  }

  return Array.from({ length: count }, (_, i) => {
    const seed = `${placement}-${i}`.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const partner = partners[i % partners.length]
    const country = countries[i % countries.length]
    const title = titles[i % titles.length]
    const impressions = Math.floor(seededRandom(seed + 1) * 100000) + 20000
    const clicks = Math.floor(impressions * (seededRandom(seed + 2) * 0.03 + 0.01))
    const avgCpc = seededRandom(seed + 3) * 2 + 1.5
    const conversionsPercentage = seededRandom(seed + 4) * 3 + 2
    const cpa = avgCpc * (100 / conversionsPercentage)
    const revenue = clicks * avgCpc
    const budget = Math.floor(revenue * (seededRandom(seed + 5) * 0.5 + 1.2))
    const balance = budget - revenue
    const weight = Math.floor(seededRandom(seed + 6) * 10) + 1
    const score = Math.floor(seededRandom(seed + 7) * 30) + 70

    return {
      id: `${placement}-${i}`,
      partnerId: `${i}`,
      partner,
      placement,
      title,
      nickname: `${partner.toLowerCase().replace(/\s+/g, '-')}-${placement}-${i}`,
      country,
      impressions,
      clicks,
      avgCpc,
      conversionsPercentage,
      cpa,
      cpc: avgCpc,
      rpm: (revenue / impressions) * 1000,
      revenue,
      budget,
      balance,
      weight,
      score,
    }
  })
}

// Generate mock data for each placement
const mockData: PlacementAd[] = [
  ...generateMockAds('path', 25),
  ...generateMockAds('offer-1', 30),
  ...generateMockAds('offer-2', 28),
  ...generateMockAds('offer-3', 22),
  ...generateMockAds('offer-4', 25),
  ...generateMockAds('serp-offer', 20),
  ...generateMockAds('listical', 35),
]

type DateRange = {
  from: Date | undefined
  to?: Date | undefined
}

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50, 100]

// Individual table component with its own state
function PlacementTable({
  placement,
  title,
  allData,
  globalCountryFilter,
}: {
  placement: PlacementSlug
  title: string
  allData: PlacementAd[]
  globalCountryFilter: string
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Filter data for this placement
  const tableData = React.useMemo(() => {
    return allData.filter((item) => {
      const matchesPlacement = item.placement === placement
      const matchesCountry = globalCountryFilter === 'all' || item.country === globalCountryFilter
      const matchesSearch =
        searchQuery === '' ||
        item.partner.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.nickname.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesPlacement && matchesCountry && matchesSearch
    })
  }, [allData, placement, globalCountryFilter, searchQuery])

  // Pagination
  const totalPages = Math.ceil(tableData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedData = tableData.slice(startIndex, endIndex)

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, itemsPerPage, globalCountryFilter])

  // Handle items per page change
  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value))
    setCurrentPage(1)
  }

  // Function to convert data to CSV format
  const convertToCSV = (data: PlacementAd[]) => {
    const headers = [
      'Partner',
      'Title',
      'Nickname',
      'Country',
      'Impressions',
      'Clicks',
      'Avg CPC',
      'Conversions %',
      'CPA',
      'CPC',
      'RPM',
      'Revenue',
      'Budget',
      'Balance',
      'Weight',
      'Score',
    ]
    const rows = data.map((item) => [
      item.partner,
      item.title,
      item.nickname,
      COUNTRIES[item.country],
      item.impressions.toString(),
      item.clicks.toString(),
      item.avgCpc.toFixed(2),
      item.conversionsPercentage.toFixed(2) + '%',
      item.cpa.toFixed(2),
      item.cpc.toFixed(2),
      item.rpm.toFixed(2),
      item.revenue.toFixed(2),
      item.budget.toString(),
      item.balance.toFixed(2),
      item.weight.toString(),
      item.score.toString(),
    ])

    return [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n')
  }

  // Function to download as CSV
  const downloadCSV = () => {
    const csv = convertToCSV(tableData)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${placement}-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  // Function to copy to clipboard
  const copyToClipboard = async () => {
    const csv = convertToCSV(tableData)
    try {
      await navigator.clipboard.writeText(csv)
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
    }
  }

  // Format number with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString()
  }

  // Format currency
  const formatCurrency = (num: number) => {
    return `$${num.toFixed(2)}`
  }

  // Format percentage
  const formatPercentage = (num: number) => {
    return `${num.toFixed(2)}%`
  }

  // Get score badge color
  const getScoreBadgeColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
    if (score >= 80) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
    if (score >= 70) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
  }

  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          {tableData.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {startIndex + 1}-{Math.min(endIndex, tableData.length)} of {tableData.length} results
            </p>
          )}
        </div>
      </div>

      {/* Table-specific filters and exports */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <Field className="flex-1">
          <FieldContent>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search by partner, title, or nickname..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </FieldContent>
        </Field>

        {tableData.length > 0 && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" type="button" onClick={downloadCSV}>
              <FileDownIcon className="size-4 mr-2" />
              CSV
            </Button>
            <Button variant="outline" size="sm" type="button" onClick={copyToClipboard}>
              <CopyIcon className="size-4 mr-2" />
              Copy
            </Button>
          </div>
        )}
      </div>

      <div className="border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Partner</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Nickname</TableHead>
              <TableHead className="text-right">Impressions</TableHead>
              <TableHead className="text-right">Clicks</TableHead>
              <TableHead className="text-right">Avg CPC</TableHead>
              <TableHead className="text-right">Conv. %</TableHead>
              <TableHead className="text-right">CPA</TableHead>
              <TableHead className="text-right">CPC</TableHead>
              <TableHead className="text-right">RPM</TableHead>
              <TableHead className="text-right">Revenue</TableHead>
              <TableHead className="text-right">Budget</TableHead>
              <TableHead className="text-right">Balance</TableHead>
              <TableHead className="text-right">Weight</TableHead>
              <TableHead className="text-right">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={15} className="text-center text-muted-foreground">
                  No results found
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  <Link href={`/dashboard/partners/${item.partnerId}`} className="hover:underline">
                    {item.partner}
                  </Link>
                </TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {item.nickname}
                  </code>
                </TableCell>
                <TableCell className="text-right">{formatNumber(item.impressions)}</TableCell>
                <TableCell className="text-right">{formatNumber(item.clicks)}</TableCell>
                <TableCell className="text-right">{formatCurrency(item.avgCpc)}</TableCell>
                <TableCell className="text-right">{formatPercentage(item.conversionsPercentage)}</TableCell>
                <TableCell className="text-right">{formatCurrency(item.cpa)}</TableCell>
                <TableCell className="text-right">{formatCurrency(item.cpc)}</TableCell>
                <TableCell className="text-right">{formatCurrency(item.rpm)}</TableCell>
                <TableCell className="text-right">{formatCurrency(item.revenue)}</TableCell>
                <TableCell className="text-right">{formatNumber(item.budget)}</TableCell>
                <TableCell className="text-right">{formatCurrency(item.balance)}</TableCell>
                <TableCell className="text-right">
                  <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-muted text-xs font-medium">
                    ${item.weight}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-medium ${getScoreBadgeColor(item.score)}`}>
                    {item.score}
                  </span>
                </TableCell>
              </TableRow>
            ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {tableData.length > itemsPerPage && (
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(endIndex, tableData.length)} of {tableData.length} results
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
  )
}

export default function AdPlacementPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<string>('all')
  const [selectedTab, setSelectedTab] = useState<string>('all')

  // Calculate counts for each placement based on country filter
  const placementCounts = React.useMemo(() => {
    const counts: Record<string, number> = {}

    // Count for each placement
    PLACEMENT_TABS.forEach((tab) => {
      if (tab.value === 'all') {
        // Count all items across all placements
        counts.all = mockData.filter((item) =>
          selectedCountry === 'all' || item.country === selectedCountry
        ).length
      } else {
        // Count for specific placement
        counts[tab.value] = mockData.filter((item) =>
          item.placement === tab.value &&
          (selectedCountry === 'all' || item.country === selectedCountry)
        ).length
      }
    })

    return counts
  }, [selectedCountry])

  const formatDateRange = () => {
    if (!dateRange?.from) return 'Select range'
    if (!dateRange.to) return format(dateRange.from, 'MMM d, yyyy')
    return `${format(dateRange.from, 'MMM d, yyyy')} - ${format(dateRange.to, 'MMM d, yyyy')}`
  }

  return (
    <div className="flex flex-col gap-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Ad Placement Report</CardTitle>
          <CardDescription>View performance metrics by placement type</CardDescription>
        </CardHeader>
        <CardContent>
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
            </div>
          </FieldGroup>

          {/* Tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList variant="line">
              {PLACEMENT_TABS.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label} <span className="ml-1.5 inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-muted text-xs font-medium">{placementCounts[tab.value] || 0}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={selectedTab} className="mt-6">
              {selectedTab === 'all' ? (
                <>
                  <PlacementTable placement="path" title="Path" allData={mockData} globalCountryFilter={selectedCountry} />
                  <PlacementTable placement="offer-1" title="Offer 1" allData={mockData} globalCountryFilter={selectedCountry} />
                  <PlacementTable placement="offer-2" title="Offer 2" allData={mockData} globalCountryFilter={selectedCountry} />
                  <PlacementTable placement="offer-3" title="Offer 3" allData={mockData} globalCountryFilter={selectedCountry} />
                  <PlacementTable placement="offer-4" title="Offer 4" allData={mockData} globalCountryFilter={selectedCountry} />
                  <PlacementTable placement="serp-offer" title="SERP Offer" allData={mockData} globalCountryFilter={selectedCountry} />
                  <PlacementTable placement="listical" title="Listical" allData={mockData} globalCountryFilter={selectedCountry} />
                </>
              ) : (
                <PlacementTable
                  placement={selectedTab as PlacementSlug}
                  title={PLACEMENT_TABS.find(t => t.value === selectedTab)?.label || ''}
                  allData={mockData}
                  globalCountryFilter={selectedCountry}
                />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

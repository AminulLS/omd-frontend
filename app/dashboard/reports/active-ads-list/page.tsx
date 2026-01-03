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
  SearchIcon,
  CalendarIcon,
  FileDownIcon,
  CopyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { PLACEMENTS, getPlacementLabel, type PlacementSlug } from '@/lib/constants/placements'
import { COUNTRIES } from '@/lib/constants/countries'

type ActiveAd = {
  id: string
  partnerId: string
  partner: string
  position: PlacementSlug
  title: string
  nickname: string
  country: keyof typeof COUNTRIES
  impressions: number
  clicks: number
  avgCpc: number
  ctr: number
  conversionsPercentage: number
  cpa: number
  tCpa: number
  rpm: number
  revenue: number
  budget: number
  weight: number
}

// Mock data for active ads report
const mockData: ActiveAd[] = [
  {
    id: '1',
    partnerId: '1',
    partner: 'Google',
    position: 'redirect',
    title: 'Best Remote Jobs 2024',
    nickname: 'google-remote-jobs',
    country: 'US' as keyof typeof COUNTRIES,
    impressions: 125000,
    clicks: 3125,
    avgCpc: 2.45,
    ctr: 2.5,
    conversionsPercentage: 3.2,
    cpa: 76.56,
    tCpa: 82.34,
    rpm: 24.50,
    revenue: 3062.50,
    budget: 5000,
    weight: 10,
  },
  {
    id: '2',
    partnerId: '2',
    partner: 'Indeed',
    position: 'serp-top',
    title: 'Hiring Now - Tech Jobs',
    nickname: 'indeed-tech-jobs',
    country: 'CA' as keyof typeof COUNTRIES,
    impressions: 98000,
    clicks: 2450,
    avgCpc: 1.85,
    ctr: 2.5,
    conversionsPercentage: 2.8,
    cpa: 66.07,
    tCpa: 71.23,
    rpm: 18.50,
    revenue: 1813.00,
    budget: 3500,
    weight: 8,
  },
  {
    id: '3',
    partnerId: '3',
    partner: 'LinkedIn',
    position: 'serp-mid',
    title: 'Premium Job Listings',
    nickname: 'linkedin-premium',
    country: 'GB' as keyof typeof COUNTRIES,
    impressions: 76000,
    clicks: 1824,
    avgCpc: 3.20,
    ctr: 2.4,
    conversionsPercentage: 4.1,
    cpa: 78.05,
    tCpa: 84.56,
    rpm: 32.00,
    revenue: 2432.00,
    budget: 4000,
    weight: 9,
  },
  {
    id: '4',
    partnerId: '4',
    partner: 'Monster',
    position: 'return',
    title: 'Find Your Dream Job',
    nickname: 'monster-dream-job',
    country: 'US' as keyof typeof COUNTRIES,
    impressions: 65000,
    clicks: 1625,
    avgCpc: 1.65,
    ctr: 2.5,
    conversionsPercentage: 2.5,
    cpa: 66.00,
    tCpa: 69.80,
    rpm: 16.50,
    revenue: 1072.50,
    budget: 2500,
    weight: 7,
  },
  {
    id: '5',
    partnerId: '5',
    partner: 'CareerBuilder',
    position: 'bb',
    title: 'Top Remote Opportunities',
    nickname: 'cb-remote',
    country: 'IN' as keyof typeof COUNTRIES,
    impressions: 54000,
    clicks: 1350,
    avgCpc: 2.10,
    ctr: 2.5,
    conversionsPercentage: 3.0,
    cpa: 70.00,
    tCpa: 75.40,
    rpm: 21.00,
    revenue: 1134.00,
    budget: 3000,
    weight: 6,
  },
  {
    id: '6',
    partnerId: '6',
    partner: 'ZipRecruiter',
    position: 'flow',
    title: 'Apply with One Click',
    nickname: 'zip-one-click',
    country: 'ZA' as keyof typeof COUNTRIES,
    impressions: 89000,
    clicks: 2225,
    avgCpc: 2.75,
    ctr: 2.5,
    conversionsPercentage: 3.5,
    cpa: 78.57,
    tCpa: 83.21,
    rpm: 27.50,
    revenue: 2447.50,
    budget: 4500,
    weight: 8,
  },
  {
    id: '7',
    partnerId: '7',
    partner: 'Glassdoor',
    position: 'pec',
    title: 'Salary & Company Reviews',
    nickname: 'glassdoor-reviews',
    country: 'FR' as keyof typeof COUNTRIES,
    impressions: 72000,
    clicks: 1800,
    avgCpc: 2.30,
    ctr: 2.5,
    conversionsPercentage: 2.9,
    cpa: 79.31,
    tCpa: 85.12,
    rpm: 23.00,
    revenue: 1656.00,
    budget: 3200,
    weight: 7,
  },
  {
    id: '8',
    partnerId: '8',
    partner: 'Dice',
    position: 'offer-1',
    title: 'Tech & IT Jobs',
    nickname: 'dice-tech',
    country: 'DE' as keyof typeof COUNTRIES,
    impressions: 61000,
    clicks: 1525,
    avgCpc: 2.90,
    ctr: 2.5,
    conversionsPercentage: 3.8,
    cpa: 76.32,
    tCpa: 81.45,
    rpm: 29.00,
    revenue: 1769.00,
    budget: 3800,
    weight: 9,
  },
  {
    id: '9',
    partnerId: '9',
    partner: 'SimplyHired',
    position: 'serp-bottom',
    title: 'Local Job Search',
    nickname: 'simplyhired-local',
    country: 'US' as keyof typeof COUNTRIES,
    impressions: 48000,
    clicks: 1200,
    avgCpc: 1.95,
    ctr: 2.5,
    conversionsPercentage: 2.6,
    cpa: 75.00,
    tCpa: 79.80,
    rpm: 19.50,
    revenue: 936.00,
    budget: 2200,
    weight: 5,
  },
  {
    id: '10',
    partnerId: '10',
    partner: 'Snagajob',
    position: 'path',
    title: 'Hourly Jobs Near You',
    nickname: 'snagajob-hourly',
    country: 'CA' as keyof typeof COUNTRIES,
    impressions: 57000,
    clicks: 1425,
    avgCpc: 1.75,
    ctr: 2.5,
    conversionsPercentage: 2.7,
    cpa: 64.81,
    tCpa: 68.90,
    rpm: 17.50,
    revenue: 997.50,
    budget: 2400,
    weight: 6,
  },
  {
    id: '11',
    partnerId: '11',
    partner: 'Adzuna',
    position: 'return-2',
    title: 'Millions of Jobs',
    nickname: 'adzuna-millions',
    country: 'GB' as keyof typeof COUNTRIES,
    impressions: 69000,
    clicks: 1725,
    avgCpc: 2.25,
    ctr: 2.5,
    conversionsPercentage: 3.1,
    cpa: 72.58,
    tCpa: 77.34,
    rpm: 22.50,
    revenue: 1552.50,
    budget: 3300,
    weight: 8,
  },
  {
    id: '12',
    partnerId: '12',
    partner: 'Idealist',
    position: 'flow-2',
    title: 'Non-Profit Careers',
    nickname: 'idealist-nonprofit',
    country: 'IN' as keyof typeof COUNTRIES,
    impressions: 42000,
    clicks: 1050,
    avgCpc: 1.85,
    ctr: 2.5,
    conversionsPercentage: 2.4,
    cpa: 77.08,
    tCpa: 82.15,
    rpm: 18.50,
    revenue: 777.00,
    budget: 2000,
    weight: 6,
  },
  {
    id: '13',
    partnerId: '13',
    partner: 'USAjobs',
    position: 'medicare',
    title: 'Government Positions',
    nickname: 'usajobs-gov',
    country: 'ZA' as keyof typeof COUNTRIES,
    impressions: 78000,
    clicks: 1950,
    avgCpc: 2.60,
    ctr: 2.5,
    conversionsPercentage: 3.3,
    cpa: 78.79,
    tCpa: 84.12,
    rpm: 26.00,
    revenue: 2028.00,
    budget: 4200,
    weight: 9,
  },
  {
    id: '14',
    partnerId: '14',
    partner: 'Remote.co',
    position: 'blur',
    title: 'Remote-First Companies',
    nickname: 'remoteco-first',
    country: 'FR' as keyof typeof COUNTRIES,
    impressions: 55000,
    clicks: 1375,
    avgCpc: 2.40,
    ctr: 2.5,
    conversionsPercentage: 3.0,
    cpa: 80.00,
    tCpa: 85.60,
    rpm: 24.00,
    revenue: 1320.00,
    budget: 2800,
    weight: 7,
  },
  {
    id: '15',
    partnerId: '15',
    partner: 'We Work Remotely',
    position: 'listical',
    title: 'Remote Jobs',
    nickname: 'wwr-remote',
    country: 'DE' as keyof typeof COUNTRIES,
    impressions: 63000,
    clicks: 1575,
    avgCpc: 2.80,
    ctr: 2.5,
    conversionsPercentage: 3.6,
    cpa: 77.78,
    tCpa: 83.12,
    rpm: 28.00,
    revenue: 1764.00,
    budget: 3600,
    weight: 8,
  },
  {
    id: '16',
    partnerId: '16',
    partner: 'FlexJobs',
    position: 'internal-email',
    title: 'Flexible Remote Work',
    nickname: 'flexjobs-flexible',
    country: 'US' as keyof typeof COUNTRIES,
    impressions: 44000,
    clicks: 1100,
    avgCpc: 2.15,
    ctr: 2.5,
    conversionsPercentage: 2.8,
    cpa: 76.79,
    tCpa: 81.90,
    rpm: 21.50,
    revenue: 946.00,
    budget: 2100,
    weight: 6,
  },
  {
    id: '17',
    partnerId: '17',
    partner: 'AngelList',
    title: 'Startup Jobs',
    nickname: 'angellist-startup',
    position: 'pec-2' as PlacementSlug,
    country: 'CA' as keyof typeof COUNTRIES,
    impressions: 67000,
    clicks: 1675,
    avgCpc: 3.10,
    ctr: 2.5,
    conversionsPercentage: 4.0,
    cpa: 77.50,
    tCpa: 82.80,
    rpm: 31.00,
    revenue: 2077.00,
    budget: 4100,
    weight: 9,
  },
  {
    id: '18',
    partnerId: '18',
    partner: 'Wellfound',
    position: 'pec-return',
    title: 'Tech Startup Careers',
    nickname: 'wellfound-startup',
    country: 'GB' as keyof typeof COUNTRIES,
    impressions: 59000,
    clicks: 1475,
    avgCpc: 2.95,
    ctr: 2.5,
    conversionsPercentage: 3.9,
    cpa: 75.64,
    tCpa: 80.45,
    rpm: 29.50,
    revenue: 1740.50,
    budget: 3900,
    weight: 7,
  },
  {
    id: '19',
    partnerId: '19',
    partner: 'Hired',
    position: 'offer-2',
    title: 'Tech Job Matching',
    nickname: 'hired-matching',
    country: 'IN' as keyof typeof COUNTRIES,
    impressions: 71000,
    clicks: 1775,
    avgCpc: 3.05,
    ctr: 2.5,
    conversionsPercentage: 4.2,
    cpa: 72.62,
    tCpa: 77.34,
    rpm: 30.50,
    revenue: 2165.50,
    budget: 4300,
    weight: 8,
  },
  {
    id: '20',
    partnerId: '20',
    partner: 'Talent.com',
    position: 'offer-3',
    title: 'Job Search Engine',
    nickname: 'talent-engine',
    country: 'ZA' as keyof typeof COUNTRIES,
    impressions: 52000,
    clicks: 1300,
    avgCpc: 2.20,
    ctr: 2.5,
    conversionsPercentage: 3.2,
    cpa: 68.75,
    tCpa: 73.20,
    rpm: 22.00,
    revenue: 1144.00,
    budget: 2600,
    weight: 7,
  },
  {
    id: '21',
    partnerId: '21',
    partner: 'Jobrapido',
    position: 'offer-4',
    title: 'Find Jobs Fast',
    nickname: 'jobrapido-fast',
    country: 'FR' as keyof typeof COUNTRIES,
    impressions: 46000,
    clicks: 1150,
    avgCpc: 1.90,
    ctr: 2.5,
    conversionsPercentage: 2.7,
    cpa: 70.37,
    tCpa: 74.80,
    rpm: 19.00,
    revenue: 874.00,
    budget: 2300,
    weight: 6,
  },
  {
    id: '22',
    partnerId: '22',
    partner: 'Jooble',
    position: 'serp-offer',
    title: 'Job Aggregator',
    nickname: 'jooble-aggregator',
    country: 'DE' as keyof typeof COUNTRIES,
    impressions: 64000,
    clicks: 1600,
    avgCpc: 2.55,
    ctr: 2.5,
    conversionsPercentage: 3.4,
    cpa: 75.00,
    tCpa: 79.80,
    rpm: 25.50,
    revenue: 1632.00,
    budget: 3400,
    weight: 8,
  },
  {
    id: '23',
    partnerId: '23',
    partner: 'Chron',
    position: 'offer-5',
    title: 'Career Resources',
    nickname: 'chron-career',
    country: 'US' as keyof typeof COUNTRIES,
    impressions: 39000,
    clicks: 975,
    avgCpc: 2.05,
    ctr: 2.5,
    conversionsPercentage: 2.6,
    cpa: 78.85,
    tCpa: 83.60,
    rpm: 20.50,
    revenue: 799.50,
    budget: 1900,
    weight: 5,
  },
  {
    id: '24',
    partnerId: '24',
    partner: 'The Muse',
    position: 'offer-6',
    title: 'Company Culture Jobs',
    nickname: 'muse-culture',
    country: 'CA' as keyof typeof COUNTRIES,
    impressions: 51000,
    clicks: 1275,
    avgCpc: 2.65,
    ctr: 2.5,
    conversionsPercentage: 3.5,
    cpa: 75.71,
    tCpa: 80.34,
    rpm: 26.50,
    revenue: 1351.50,
    budget: 3000,
    weight: 9,
  },
  {
    id: '25',
    partnerId: '25',
    partner: 'LinkUp',
    position: 'offer-7',
    title: 'Verified Job Listings',
    nickname: 'linkup-verified',
    country: 'GB' as keyof typeof COUNTRIES,
    impressions: 58000,
    clicks: 1450,
    avgCpc: 2.45,
    ctr: 2.5,
    conversionsPercentage: 3.3,
    cpa: 74.24,
    tCpa: 78.90,
    rpm: 24.50,
    revenue: 1421.00,
    budget: 3100,
    weight: 7,
  },
]

type DateRange = {
  from: Date | undefined
  to?: Date | undefined
}

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50, 100]

export default function ActiveAdsListPage() {
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
      item.partner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getPlacementLabel(item.position).toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nickname.toLowerCase().includes(searchQuery.toLowerCase())

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
  const convertToCSV = (data: ActiveAd[]) => {
    const headers = [
      'Partner',
      'Position',
      'Title',
      'Nickname',
      'Country',
      'Impressions',
      'Clicks',
      'Avg CPC',
      'CTR',
      'Conversions %',
      'CPA',
      'T-CPA',
      'RPM',
      'Revenue',
      'Budget',
      'Weight',
    ]
    const rows = data.map((item) => [
      item.partner,
      getPlacementLabel(item.position),
      item.title,
      item.nickname,
      COUNTRIES[item.country],
      item.impressions.toString(),
      item.clicks.toString(),
      item.avgCpc.toFixed(2),
      item.ctr.toFixed(2) + '%',
      item.conversionsPercentage.toFixed(2) + '%',
      item.cpa.toFixed(2),
      item.tCpa.toFixed(2),
      item.rpm.toFixed(2),
      item.revenue.toFixed(2),
      item.budget.toString(),
      item.weight.toString(),
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
    link.download = `active-ads-list-${new Date().toISOString().split('T')[0]}.csv`
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

  return (
    <div className="flex flex-col gap-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Active Ads List</CardTitle>
          <CardDescription>View performance metrics for all active ads</CardDescription>
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
                      placeholder="Search by partner, position, title, or nickname..."
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
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Partner</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Nickname</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead className="text-right">Impressions</TableHead>
                  <TableHead className="text-right">Clicks</TableHead>
                  <TableHead className="text-right">Avg CPC</TableHead>
                  <TableHead className="text-right">CTR</TableHead>
                  <TableHead className="text-right">Conv. %</TableHead>
                  <TableHead className="text-right">CPA</TableHead>
                  <TableHead className="text-right">T-CPA</TableHead>
                  <TableHead className="text-right">RPM</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Budget</TableHead>
                  <TableHead className="text-right">Weight</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={16} className="h-24 text-center">
                      No active ads found.
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
                      <TableCell>{getPlacementLabel(item.position)}</TableCell>
                      <TableCell>{item.title}</TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {item.nickname}
                        </code>
                      </TableCell>
                      <TableCell>{COUNTRIES[item.country]}</TableCell>
                      <TableCell className="text-right">{formatNumber(item.impressions)}</TableCell>
                      <TableCell className="text-right">{formatNumber(item.clicks)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.avgCpc)}</TableCell>
                      <TableCell className="text-right">{formatPercentage(item.ctr)}</TableCell>
                      <TableCell className="text-right">{formatPercentage(item.conversionsPercentage)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.cpa)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.tCpa)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.rpm)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.revenue)}</TableCell>
                      <TableCell className="text-right">{formatNumber(item.budget)}</TableCell>
                      <TableCell className="text-right">
                        <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-muted text-xs font-medium">
                          ${item.weight}
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
        </CardContent>
      </Card>
    </div>
  )
}

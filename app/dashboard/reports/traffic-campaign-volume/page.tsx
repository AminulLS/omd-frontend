"use client"

import * as React from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  SearchIcon,
  FileDownIcon,
  CopyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TrendingUpIcon,
  TrendingDownIcon,
} from 'lucide-react'
import { useState } from 'react'
import { COUNTRIES } from '@/lib/constants/countries'

type TrafficCampaignVolumeData = {
  id: string
  trafficName: string // alpha-num, 4 chars
  country: keyof typeof COUNTRIES
  todayClicks: number
  sdlwClicks: number // Same Day Last Week (7 days ago)
  yesterdayClicks: number
}

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50, 100]

// Deterministic pseudo-random number generator
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

// Helper to generate mock traffic campaign volume data
const generateMockData = (count: number): TrafficCampaignVolumeData[] => {
  const countries: (keyof typeof COUNTRIES)[] = ['US', 'CA', 'GB', 'DE', 'FR', 'IN', 'ZA', 'AU', 'JP', 'BR']
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

  const data: TrafficCampaignVolumeData[] = []

  for (let i = 0; i < count; i++) {
    // Generate traffic name deterministically using seeded random
    let trafficName = ''
    for (let j = 0; j < 4; j++) {
      const randomValue = seededRandom(i * 4 + j)
      trafficName += chars.charAt(Math.floor(randomValue * chars.length))
    }

    const country = countries[i % countries.length]

    const todayClicks = Math.floor(seededRandom(i * 10 + 1) * 5000) + 500
    const sdlwClicks = Math.floor(seededRandom(i * 10 + 2) * 5000) + 500
    const yesterdayClicks = Math.floor(seededRandom(i * 10 + 3) * 5000) + 500

    data.push({
      id: `${trafficName}-${country}`,
      trafficName,
      country,
      todayClicks,
      sdlwClicks,
      yesterdayClicks,
    })
  }

  return data
}

const mockData: TrafficCampaignVolumeData[] = generateMockData(100)

// Helper component to display clicks with comparison
function ClicksWithComparison({
  clicks,
  compareClicks,
  showLabel = true,
}: {
  clicks: number
  compareClicks: number
  showLabel?: boolean
}) {
  const percentage = compareClicks > 0 ? ((clicks - compareClicks) / compareClicks) * 100 : 0
  const isPositive = percentage >= 0
  const isSignificant = Math.abs(percentage) >= 10 // Alert threshold at 10%

  return (
    <div className="flex items-center justify-end gap-2">
      <span className="font-medium">{clicks.toLocaleString()}</span>
      {showLabel && compareClicks > 0 && (
        <span
          className={`text-xs flex items-center gap-1 ${
            isSignificant
              ? isPositive
                ? 'text-green-600 font-semibold'
                : 'text-red-600 font-semibold'
              : 'text-muted-foreground'
          }`}
        >
          {isPositive ? (
            <TrendingUpIcon className="size-3" />
          ) : (
            <TrendingDownIcon className="size-3" />
          )}
          ({percentage >= 0 ? '+' : ''}
          {percentage.toFixed(1)}%{isSignificant && '!'})
        </span>
      )}
    </div>
  )
}

export default function TrafficCampaignVolumePage() {
  const [selectedCountry, setSelectedCountry] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Filter data
  const filteredData = React.useMemo(() => {
    return mockData.filter((item) => {
      // Country filter
      const matchesCountry = selectedCountry === 'all' || item.country === selectedCountry

      // Search filter
      const matchesSearch =
        searchQuery === '' ||
        item.trafficName.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesCountry && matchesSearch
    })
  }, [selectedCountry, searchQuery])

  // Sort by traffic name
  const sortedData = React.useMemo(() => {
    return [...filteredData].sort((a, b) => a.trafficName.localeCompare(b.trafficName))
  }, [filteredData])

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedData = sortedData.slice(startIndex, endIndex)

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, itemsPerPage, selectedCountry])

  // Handle items per page change
  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value))
    setCurrentPage(1)
  }

  // Function to convert data to CSV format
  const convertToCSV = (data: TrafficCampaignVolumeData[]) => {
    const headers = [
      'Traffic Name',
      'Country',
      'Today Clicks',
      'SDLW Clicks',
      'Yesterday Clicks',
      'Today vs SDLW %',
      'Yesterday vs Today %',
    ]

    const rows = data.map((item) => {
      const todayVsSdlw = item.sdlwClicks > 0
        ? ((item.todayClicks - item.sdlwClicks) / item.sdlwClicks * 100).toFixed(1)
        : '0.0'
      const yesterdayVsToday = item.todayClicks > 0
        ? ((item.yesterdayClicks - item.todayClicks) / item.todayClicks * 100).toFixed(1)
        : '0.0'

      return [
        item.trafficName,
        COUNTRIES[item.country],
        item.todayClicks.toString(),
        item.sdlwClicks.toString(),
        item.yesterdayClicks.toString(),
        `${todayVsSdlw}%`,
        `${yesterdayVsToday}%`,
      ]
    })

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
    link.download = `traffic-campaign-volume-${new Date().toISOString().split('T')[0]}.csv`
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

  return (
    <div className="flex flex-col gap-y-4">
      <div>
        <div className="mb-4 border-b pb-2">
          <h2 className="text-lg font-semibold">Traffic Campaign Volume Report</h2>
          <p className="text-sm text-muted-foreground">View traffic campaign performance metrics with day-over-day comparisons</p>
        </div>

        {/* Global Filters */}
        <FieldGroup className="mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Country Filter */}
            <Field className="sm:w-45">
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

            {/* Search */}
            <Field className="flex-1">
              <FieldLabel>Search</FieldLabel>
              <FieldContent>
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by traffic name..."
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
                <TableHead>Traffic Name</TableHead>
                <TableHead>Country</TableHead>
                <TableHead className="text-right">Today Clicks</TableHead>
                <TableHead className="text-right">SDLW Clicks</TableHead>
                <TableHead className="text-right">Yesterday Clicks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No results found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {item.trafficName}
                      </code>
                    </TableCell>
                    <TableCell>{COUNTRIES[item.country]}</TableCell>
                    <TableCell>
                      <ClicksWithComparison clicks={item.todayClicks} compareClicks={item.sdlwClicks} />
                    </TableCell>
                    <TableCell className="text-right">
                      {item.sdlwClicks.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <ClicksWithComparison clicks={item.yesterdayClicks} compareClicks={item.todayClicks} />
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

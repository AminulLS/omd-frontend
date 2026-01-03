"use client"

import * as React from 'react'
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
  FileDownIcon,
  CopyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react'
import { useState } from 'react'

// Define the placement slugs for this report
type PlacementSlug =
  | 'all'
  | 'listical'
  | 'serp-offer'
  | 'blur'
  | 'serp-all'
  | 'offer-1'
  | 'offer-2'
  | 'offer-3'
  | 'offer-4'
  | 'path'
  | 'medicare'
  | 'internal-email'

// Placement tabs configuration
const PLACEMENT_TABS = [
  { value: 'all', label: 'All' },
  { value: 'listical', label: 'Listical' },
  { value: 'serp-offer', label: 'SERP Offer' },
  { value: 'blur', label: 'Blur' },
  { value: 'serp-all', label: 'SERP All' },
  { value: 'offer-1', label: 'Offer 1' },
  { value: 'offer-2', label: 'Offer 2' },
  { value: 'offer-3', label: 'Offer 3' },
  { value: 'offer-4', label: 'Offer 4' },
  { value: 'path', label: 'Path' },
  { value: 'medicare', label: 'Medicare' },
  { value: 'internal-email', label: 'Internal Email' },
] as const

type SourceAd = {
  id: string
  source: string // alpha-num, 5char
  placement: PlacementSlug
  availableAds: number
  nonSpecific: number
  onlyPrepop: number
  onlyNonPrepop: number
}

// Helper to generate mock source data (deterministic to avoid hydration errors)
const generateMockSourceData = (placement: PlacementSlug, count: number): SourceAd[] => {
  const sources = ['SRC01', 'SRC02', 'SRC03', 'SRC04', 'SRC05', 'SRC06', 'SRC07', 'SRC08', 'SRC09', 'SRC10',
                   'SRC11', 'SRC12', 'SRC13', 'SRC14', 'SRC15', 'SRC16', 'SRC17', 'SRC18', 'SRC19', 'SRC20']

  // Deterministic pseudo-random number generator
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000
    return x - Math.floor(x)
  }

  return Array.from({ length: count }, (_, i) => {
    const seed = `${placement}-${i}`.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const availableAds = Math.floor(seededRandom(seed + 1) * 100) + 10
    const nonSpecific = Math.floor(seededRandom(seed + 2) * availableAds * 0.3)
    const onlyPrepop = Math.floor(seededRandom(seed + 3) * (availableAds - nonSpecific) * 0.5)
    const onlyNonPrepop = availableAds - nonSpecific - onlyPrepop

    return {
      id: `${placement}-${i}`,
      source: sources[i % sources.length],
      placement,
      availableAds,
      nonSpecific,
      onlyPrepop,
      onlyNonPrepop,
    }
  })
}

// Generate mock data for each placement
const mockData: SourceAd[] = [
  ...generateMockSourceData('listical', 20),
  ...generateMockSourceData('serp-offer', 18),
  ...generateMockSourceData('blur', 15),
  ...generateMockSourceData('serp-all', 22),
  ...generateMockSourceData('offer-1', 25),
  ...generateMockSourceData('offer-2', 20),
  ...generateMockSourceData('offer-3', 18),
  ...generateMockSourceData('offer-4', 15),
  ...generateMockSourceData('path', 20),
  ...generateMockSourceData('medicare', 12),
  ...generateMockSourceData('internal-email', 10),
]

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50, 100]

// Summary Cards Component
function SummaryCards({ data }: { data: SourceAd[] }) {
  const stats = React.useMemo(() => {
    return {
      activeAds: data.reduce((sum, item) => sum + item.availableAds, 0),
      onlyPrepop: data.reduce((sum, item) => sum + item.onlyPrepop, 0),
      onlyNonPrepop: data.reduce((sum, item) => sum + item.onlyNonPrepop, 0),
      nonSpecified: data.reduce((sum, item) => sum + item.nonSpecific, 0),
    }
  }, [data])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <Card>
        <CardContent>
          <div className="text-sm text-muted-foreground">Active Ads</div>
          <div className="text-2xl font-bold">{stats.activeAds}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <div className="text-sm text-muted-foreground">Only Prepop</div>
          <div className="text-2xl font-bold">{stats.onlyPrepop}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <div className="text-sm text-muted-foreground">Only Non Prepop</div>
          <div className="text-2xl font-bold">{stats.onlyNonPrepop}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <div className="text-sm text-muted-foreground">Non Specified</div>
          <div className="text-2xl font-bold">{stats.nonSpecified}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <div className="text-sm text-muted-foreground">Total Sources</div>
          <div className="text-2xl font-bold">{data.length}</div>
        </CardContent>
      </Card>
    </div>
  )
}

// Individual table component with its own state
function PlacementTable({
  placement,
  title,
  allData,
}: {
  placement: PlacementSlug
  title: string
  allData: SourceAd[]
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Filter data for this placement
  const tableData = React.useMemo(() => {
    return allData.filter((item) => {
      const matchesPlacement = item.placement === placement
      const matchesSearch =
        searchQuery === '' ||
        item.source.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesPlacement && matchesSearch
    })
  }, [allData, placement, searchQuery])

  // Pagination
  const totalPages = Math.ceil(tableData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedData = tableData.slice(startIndex, endIndex)

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, itemsPerPage])

  // Handle items per page change
  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value))
    setCurrentPage(1)
  }

  // Function to convert data to CSV format
  const convertToCSV = (data: SourceAd[]) => {
    const headers = [
      'Source',
      'Available Ads',
      'Non Specific',
      'Only Prepop',
      'Only Non Prepop',
    ]
    const rows = data.map((item) => [
      item.source,
      item.availableAds.toString(),
      item.nonSpecific.toString(),
      item.onlyPrepop.toString(),
      item.onlyNonPrepop.toString(),
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
    link.download = `${placement}-source-block-${new Date().toISOString().split('T')[0]}.csv`
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

  return (
    <div className="mb-8">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        {tableData.length > 0 && (
          <p className="text-sm text-muted-foreground">
            {startIndex + 1}-{Math.min(endIndex, tableData.length)} of {tableData.length} sources
          </p>
        )}
      </div>

      {/* Summary Cards */}
      <SummaryCards data={tableData} />

      {/* Table-specific search and exports */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <Field className="flex-1">
          <FieldContent>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search by source..."
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
              <TableHead>Source</TableHead>
              <TableHead className="text-right">Available Ads</TableHead>
              <TableHead className="text-right">Non Specific</TableHead>
              <TableHead className="text-right">Only Prepop</TableHead>
              <TableHead className="text-right">Only Non Prepop</TableHead>
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
                  <TableCell className="font-medium">
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      {item.source}
                    </code>
                  </TableCell>
                  <TableCell className="text-right">{item.availableAds}</TableCell>
                  <TableCell className="text-right">{item.nonSpecific}</TableCell>
                  <TableCell className="text-right">{item.onlyPrepop}</TableCell>
                  <TableCell className="text-right">{item.onlyNonPrepop}</TableCell>
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

export default function AdSourceBlockPage() {
  const [selectedTab, setSelectedTab] = useState<string>('all')

  // Calculate counts for each placement
  const placementCounts = React.useMemo(() => {
    const counts: Record<string, number> = {}

    PLACEMENT_TABS.forEach((tab) => {
      if (tab.value === 'all') {
        counts.all = mockData.length
      } else {
        counts[tab.value] = mockData.filter((item) => item.placement === tab.value).length
      }
    })

    return counts
  }, [])

  return (
    <div className="flex flex-col gap-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Ad Source Block</CardTitle>
          <CardDescription>View source blocking information by placement type</CardDescription>
        </CardHeader>
        <CardContent>
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
                  <PlacementTable placement="listical" title="Listical" allData={mockData} />
                  <PlacementTable placement="serp-offer" title="SERP Offer" allData={mockData} />
                  <PlacementTable placement="blur" title="Blur" allData={mockData} />
                  <PlacementTable placement="serp-all" title="SERP All" allData={mockData} />
                  <PlacementTable placement="offer-1" title="Offer 1" allData={mockData} />
                  <PlacementTable placement="offer-2" title="Offer 2" allData={mockData} />
                  <PlacementTable placement="offer-3" title="Offer 3" allData={mockData} />
                  <PlacementTable placement="offer-4" title="Offer 4" allData={mockData} />
                  <PlacementTable placement="path" title="Path" allData={mockData} />
                  <PlacementTable placement="medicare" title="Medicare" allData={mockData} />
                  <PlacementTable placement="internal-email" title="Internal Email" allData={mockData} />
                </>
              ) : (
                <PlacementTable
                  placement={selectedTab as PlacementSlug}
                  title={PLACEMENT_TABS.find(t => t.value === selectedTab)?.label || ''}
                  allData={mockData}
                />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

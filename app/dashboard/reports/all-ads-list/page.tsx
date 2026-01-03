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
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { PLACEMENTS, getPlacementLabel, type PlacementSlug } from '@/lib/constants/placements'
import { COUNTRIES } from '@/lib/constants/countries'

type Ad = {
  id: string
  partner: string
  title: string
  weight: number
  status: 'active' | 'inactive'
  position: PlacementSlug
  country: keyof typeof COUNTRIES
}

// Mock data for ads
const mockAds: Ad[] = [
  // Redirect
  { id: '1', partner: 'Google', title: 'Best Remote Jobs 2024', weight: 10, status: 'active', position: 'redirect', country: 'US' as keyof typeof COUNTRIES },
  { id: '2', partner: 'Indeed', title: 'Hiring Now - Tech Jobs', weight: 8, status: 'active', position: 'redirect', country: 'CA' as keyof typeof COUNTRIES },

  // SERP Top
  { id: '3', partner: 'LinkedIn', title: 'Premium Job Listings', weight: 9, status: 'active', position: 'serp-top', country: 'GB' as keyof typeof COUNTRIES },
  { id: '4', partner: 'Monster', title: 'Find Your Dream Job', weight: 7, status: 'active', position: 'serp-top', country: 'US' as keyof typeof COUNTRIES },

  // Return
  { id: '5', partner: 'CareerBuilder', title: 'Top Remote Opportunities', weight: 6, status: 'active', position: 'return', country: 'IN' as keyof typeof COUNTRIES },
  { id: '6', partner: 'ZipRecruiter', title: 'Apply with One Click', weight: 8, status: 'inactive', position: 'return', country: 'ZA' as keyof typeof COUNTRIES },

  // External SMS
  { id: '7', partner: 'Glassdoor', title: 'Salary & Company Reviews', weight: 7, status: 'active', position: 'external-sms', country: 'FR' as keyof typeof COUNTRIES },

  // SERP Middle
  { id: '8', partner: 'Dice', title: 'Tech & IT Jobs', weight: 9, status: 'active', position: 'serp-mid', country: 'DE' as keyof typeof COUNTRIES },
  { id: '9', partner: 'SimplyHired', title: 'Local Job Search', weight: 5, status: 'active', position: 'serp-mid', country: 'US' as keyof typeof COUNTRIES },

  // SERP Bottom
  { id: '10', partner: 'Snagajob', title: 'Hourly Jobs Near You', weight: 6, status: 'active', position: 'serp-bottom', country: 'CA' as keyof typeof COUNTRIES },
  { id: '11', partner: 'Jobs.net', title: 'Browse Job Openings', weight: 7, status: 'inactive', position: 'serp-bottom', country: 'GB' as keyof typeof COUNTRIES },

  // BB
  { id: '12', partner: 'Adzuna', title: 'Millions of Jobs', weight: 8, status: 'active', position: 'bb', country: 'IN' as keyof typeof COUNTRIES },
  { id: '13', partner: 'Idealist', title: 'Non-Profit Careers', weight: 6, status: 'active', position: 'bb', country: 'ZA' as keyof typeof COUNTRIES },

  // Flow
  { id: '14', partner: 'USAjobs', title: 'Government Positions', weight: 9, status: 'active', position: 'flow', country: 'FR' as keyof typeof COUNTRIES },

  // Return 2
  { id: '15', partner: 'Remote.co', title: 'Remote-First Companies', weight: 7, status: 'active', position: 'return-2', country: 'DE' as keyof typeof COUNTRIES },

  // Path
  { id: '16', partner: 'We Work Remotely', title: 'Remote Jobs', weight: 8, status: 'active', position: 'path', country: 'US' as keyof typeof COUNTRIES },

  // Flow 2
  { id: '17', partner: 'FlexJobs', title: 'Flexible Remote Work', weight: 6, status: 'active', position: 'flow-2', country: 'CA' as keyof typeof COUNTRIES },

  // PEC
  { id: '18', partner: 'AngelList', title: 'Startup Jobs', weight: 9, status: 'active', position: 'pec', country: 'GB' as keyof typeof COUNTRIES },
  { id: '19', partner: 'Wellfound', title: 'Tech Startup Careers', weight: 7, status: 'inactive', position: 'pec', country: 'IN' as keyof typeof COUNTRIES },

  // PEC Return
  { id: '20', partner: 'Hired', title: 'Tech Job Matching', weight: 8, status: 'active', position: 'pec-return', country: 'ZA' as keyof typeof COUNTRIES },

  // Offer 1
  { id: '21', partner: 'Talent.com', title: 'Job Search Engine', weight: 7, status: 'active', position: 'offer-1', country: 'FR' as keyof typeof COUNTRIES },
  { id: '22', partner: 'Jobrapido', title: 'Find Jobs Fast', weight: 6, status: 'active', position: 'offer-1', country: 'DE' as keyof typeof COUNTRIES },

  // SERP
  { id: '23', partner: 'Jooble', title: 'Job Aggregator', weight: 8, status: 'active', position: 'serp', country: 'US' as keyof typeof COUNTRIES },

  // PEC 2
  { id: '24', partner: 'Chron', title: 'Career Resources', weight: 5, status: 'active', position: 'pec-2', country: 'CA' as keyof typeof COUNTRIES },

  // PEC Return 2
  { id: '25', partner: 'The Muse', title: 'Company Culture Jobs', weight: 9, status: 'inactive', position: 'pec-return-2', country: 'GB' as keyof typeof COUNTRIES },

  // SERP All
  { id: '26', partner: 'LinkUp', title: 'Verified Job Listings', weight: 7, status: 'active', position: 'serp-all', country: 'IN' as keyof typeof COUNTRIES },
  { id: '27', partner: 'Jobster', title: 'Social Recruiting', weight: 6, status: 'active', position: 'serp-all', country: 'ZA' as keyof typeof COUNTRIES },

  // Internal SMS
  { id: '28', partner: 'Beyond', title: 'Career Networking', weight: 8, status: 'active', position: 'internal-sms', country: 'FR' as keyof typeof COUNTRIES },

  // External Non-Billable SMS
  { id: '29', partner: 'Craigslist', title: 'Local Classifieds Jobs', weight: 5, status: 'active', position: 'external-nonbillable-sms', country: 'DE' as keyof typeof COUNTRIES },

  // Sponsored SERP
  { id: '30', partner: 'ZipRecruiter', title: 'Sponsored Job Listings', weight: 10, status: 'active', position: 'sponsored-serp', country: 'US' as keyof typeof COUNTRIES },

  // Sponsored BB
  { id: '31', partner: 'Indeed', title: 'Sponsored Positions', weight: 9, status: 'active', position: 'sponsored-bb', country: 'CA' as keyof typeof COUNTRIES },

  // SERP Large
  { id: '32', partner: 'LinkedIn', title: 'Premium Career Listings', weight: 8, status: 'active', position: 'serp-large', country: 'GB' as keyof typeof COUNTRIES },

  // Offer 2
  { id: '33', partner: 'Monster', title: 'Featured Opportunities', weight: 7, status: 'active', position: 'offer-2', country: 'IN' as keyof typeof COUNTRIES },
  { id: '34', partner: 'CareerBuilder', title: 'Top Picks', weight: 6, status: 'inactive', position: 'offer-2', country: 'ZA' as keyof typeof COUNTRIES },

  // Offer 3
  { id: '35', partner: 'Dice', title: 'Tech Hot Jobs', weight: 8, status: 'active', position: 'offer-3', country: 'FR' as keyof typeof COUNTRIES },

  // Offer 4
  { id: '36', partner: 'SimplyHired', title: 'Trending Roles', weight: 7, status: 'active', position: 'offer-4', country: 'DE' as keyof typeof COUNTRIES },

  // SERP Offer
  { id: '37', partner: 'Snagajob', title: 'Featured Hourly Jobs', weight: 9, status: 'active', position: 'serp-offer', country: 'US' as keyof typeof COUNTRIES },

  // Offer 6
  { id: '38', partner: 'Jobs.net', title: 'Special Offers', weight: 6, status: 'active', position: 'offer-6', country: 'CA' as keyof typeof COUNTRIES },

  // Offer 5
  { id: '39', partner: 'Adzuna', title: 'Exclusive Deals', weight: 8, status: 'inactive', position: 'offer-5', country: 'GB' as keyof typeof COUNTRIES },

  // Offer 7
  { id: '40', partner: 'Idealist', title: 'Mission-Driven Work', weight: 7, status: 'active', position: 'offer-7', country: 'IN' as keyof typeof COUNTRIES },

  // Medicare
  { id: '41', partner: 'USAjobs', title: 'Healthcare Careers', weight: 9, status: 'active', position: 'medicare', country: 'ZA' as keyof typeof COUNTRIES },

  // Blur
  { id: '42', partner: 'Remote.co', title: 'Work From Anywhere', weight: 6, status: 'active', position: 'blur', country: 'FR' as keyof typeof COUNTRIES },

  // Listical
  { id: '43', partner: 'We Work Remotely', title: 'Curated Remote Jobs', weight: 8, status: 'active', position: 'listical', country: 'DE' as keyof typeof COUNTRIES },
  { id: '44', partner: 'FlexJobs', title: 'Hand-Screened Roles', weight: 7, status: 'active', position: 'listical', country: 'US' as keyof typeof COUNTRIES },

  // Internal Email
  { id: '45', partner: 'AngelList', title: 'Weekly Job Digest', weight: 5, status: 'inactive', position: 'internal-email', country: 'CA' as keyof typeof COUNTRIES },
]

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50, 100]

export default function AllAdsListPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPosition, setSelectedPosition] = useState<PlacementSlug | null>(null)
  const [selectedCountry, setSelectedCountry] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [positionSearchQuery, setPositionSearchQuery] = useState('')
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Calculate ad counts per placement
  const adPositions = PLACEMENTS.map((placement) => ({
    id: placement.slug,
    name: placement.label,
    count: mockAds.filter((ad) => ad.position === placement.slug).length,
  })).filter((position) => position.count > 0) // Only show placements with ads

  // Filter positions based on search
  const filteredPositions = adPositions.filter((position) =>
    position.name.toLowerCase().includes(positionSearchQuery.toLowerCase())
  )

  // Filter ads based on search and selected position
  const filteredAds = mockAds.filter((ad) => {
    const matchesSearch =
      searchQuery === '' ||
      ad.partner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.title.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesPosition = !selectedPosition || ad.position === selectedPosition

    const matchesCountry = selectedCountry === 'all' || ad.country === selectedCountry

    return matchesSearch && matchesPosition && matchesCountry
  })

  // Pagination
  const totalPages = Math.ceil(filteredAds.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedAds = filteredAds.slice(startIndex, startIndex + itemsPerPage)

  // Function to convert data to CSV format
  const convertToCSV = (data: Ad[]) => {
    const headers = ['Partner', 'Title', 'Weight', 'Status', 'Country']
    const rows = data.map((item) => [
      item.partner,
      item.title,
      `$${item.weight}`,
      item.status,
      COUNTRIES[item.country],
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n')

    return csvContent
  }

  // Format status for display
  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  // Function to download as CSV
  const downloadCSV = () => {
    const csv = convertToCSV(filteredAds)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `all-ads-list-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  // Function to copy to clipboard
  const copyToClipboard = async () => {
    const csv = convertToCSV(filteredAds)
    try {
      await navigator.clipboard.writeText(csv)
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
    }
  }

  // Reset pagination when filters change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedPosition, selectedCountry, itemsPerPage])

  // Handle items per page change
  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value))
    setCurrentPage(1)
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div>
        <div className="mb-4 border-b pb-2">
          <h2 className="text-lg font-semibold">All Ads List</h2>
          <p className="text-sm text-muted-foreground">View and manage all ads across different positions</p>
        </div>
        <div className="flex gap-4">
          {/* Left Sidebar - Ad Positions */}
          <div className="w-64 shrink-0 border-r pr-4 flex flex-col">
            <h3 className="font-semibold mb-4 text-sm">Ad Positions</h3>

            {/* Position Search */}
            <div className="relative mb-3 shrink-0">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input
                placeholder="Search positions..."
                value={positionSearchQuery}
                onChange={(e) => setPositionSearchQuery(e.target.value)}
                className="pl-8 h-8 text-sm"
              />
            </div>

            <nav className="space-y-1 overflow-y-auto flex-1 min-h-0">
              <button
                onClick={() => setSelectedPosition(null)}
                className={cn(
                  "w-full text-left px-3 py-2 text-sm transition-colors flex items-center justify-between",
                  selectedPosition === null
                    ? "bg-primary text-primary-foreground font-medium"
                    : "hover:bg-muted"
                )}
              >
                <span>All Positions</span>
                <span className={cn(
                  "text-xs",
                  selectedPosition === null ? "text-primary-foreground/70" : "text-muted-foreground"
                )}>
                  {mockAds.length}
                </span>
              </button>
              {filteredPositions.map((position) => (
                <button
                  key={position.id}
                  onClick={() => setSelectedPosition(position.id)}
                  className={cn(
                    "w-full text-left px-3 py-2 text-sm transition-colors flex items-center justify-between",
                    selectedPosition === position.id
                      ? "bg-primary text-primary-foreground font-medium"
                      : "hover:bg-muted"
                  )}
                >
                  <span>{position.name}</span>
                  <span className={cn(
                    "text-xs",
                    selectedPosition === position.id ? "text-primary-foreground/70" : "text-muted-foreground"
                  )}>
                    {position.count}
                  </span>
                </button>
              ))}
              {filteredPositions.length === 0 && (
                <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                  No positions found
                </div>
              )}
            </nav>
          </div>

          {/* Right Side - Table */}
          <div className="flex-1 flex flex-col gap-4">
            {/* Search and Export */}
            <FieldGroup>
              <div className="flex gap-3">
                {/* Search */}
                <Field className="flex-1">
                  <FieldLabel>Search</FieldLabel>
                  <FieldContent>
                    <div className="relative">
                      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by partner or title..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </FieldContent>
                </Field>

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

            {/* Table Container */}
            <div className="border">
              <Table>
                <TableHeader>
                <TableRow>
                  <TableHead>Partner</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="text-right">Weight</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead>Country</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedAds.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No ads found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedAds.map((ad) => (
                    <TableRow key={ad.id}>
                      <TableCell className="font-medium">{ad.partner}</TableCell>
                      <TableCell>{ad.title}</TableCell>
                      <TableCell className="text-right">
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-muted text-xs font-medium">
                          ${ad.weight}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={cn(
                            "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border",
                            ad.status === 'active'
                              ? "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
                              : "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20"
                          )}
                        >
                          {formatStatus(ad.status)}
                        </span>
                      </TableCell>
                      <TableCell>{COUNTRIES[ad.country]}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            </div>

            {/* Pagination - Aligned with table */}
            {filteredAds.length > 0 && (
              <div className="flex items-center justify-between border-t pt-4">
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground">
                    Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredAds.length)} of {filteredAds.length} results
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
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
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
    </div>
  )
}
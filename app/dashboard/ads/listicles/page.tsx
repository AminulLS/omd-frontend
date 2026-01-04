"use client"

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  SearchIcon,
  FileDownIcon,
  CopyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreVerticalIcon,
  EyeIcon,
  EditIcon,
  Copy as DuplicateIcon,
  TrashIcon,
} from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

type Listicle = {
  id: string
  image: string
  title: string
  slug: string
  listicleAdsCount: number
  blurAdsCount: number
  lastUpdated: string
}

// Mock data for listicles
const mockListicles: Listicle[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=100&h=100&fit=crop',
    title: 'Top 10 Remote Work Tools',
    slug: 'top-10-remote-work-tools',
    listicleAdsCount: 5,
    blurAdsCount: 3,
    lastUpdated: '2024-01-15',
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=100&h=100&fit=crop',
    title: 'Best Job Search Strategies',
    slug: 'best-job-search-strategies',
    listicleAdsCount: 8,
    blurAdsCount: 2,
    lastUpdated: '2024-01-14',
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=100&h=100&fit=crop',
    title: 'Career Development Tips',
    slug: 'career-development-tips',
    listicleAdsCount: 12,
    blurAdsCount: 5,
    lastUpdated: '2024-01-13',
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&h=100&fit=crop',
    title: 'Resume Writing Guide',
    slug: 'resume-writing-guide',
    listicleAdsCount: 6,
    blurAdsCount: 1,
    lastUpdated: '2024-01-12',
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    title: 'Interview Preparation',
    slug: 'interview-preparation',
    listicleAdsCount: 10,
    blurAdsCount: 4,
    lastUpdated: '2024-01-11',
  },
  {
    id: '6',
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=100&h=100&fit=crop',
    title: 'Workplace Productivity Hacks',
    slug: 'workplace-productivity-hacks',
    listicleAdsCount: 7,
    blurAdsCount: 2,
    lastUpdated: '2024-01-10',
  },
  {
    id: '7',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=100&h=100&fit=crop',
    title: 'Team Building Activities',
    slug: 'team-building-activities',
    listicleAdsCount: 4,
    blurAdsCount: 3,
    lastUpdated: '2024-01-09',
  },
  {
    id: '8',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=100&h=100&fit=crop',
    title: 'Freelance Job Opportunities',
    slug: 'freelance-job-opportunities',
    listicleAdsCount: 9,
    blurAdsCount: 6,
    lastUpdated: '2024-01-08',
  },
  {
    id: '9',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=100&h=100&fit=crop',
    title: 'Tech Industry Trends',
    slug: 'tech-industry-trends',
    listicleAdsCount: 15,
    blurAdsCount: 4,
    lastUpdated: '2024-01-07',
  },
  {
    id: '10',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=100&h=100&fit=crop',
    title: 'Salary Negotiation Tips',
    slug: 'salary-negotiation-tips',
    listicleAdsCount: 11,
    blurAdsCount: 2,
    lastUpdated: '2024-01-06',
  },
  {
    id: '11',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=100&h=100&fit=crop',
    title: 'Startup Company Culture',
    slug: 'startup-company-culture',
    listicleAdsCount: 6,
    blurAdsCount: 3,
    lastUpdated: '2024-01-05',
  },
  {
    id: '12',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=100&h=100&fit=crop',
    title: 'Leadership Skills',
    slug: 'leadership-skills',
    listicleAdsCount: 13,
    blurAdsCount: 5,
    lastUpdated: '2024-01-04',
  },
]

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50, 100]

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function ListiclesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [listicles, setListicles] = useState<Listicle[]>(mockListicles)

  // Filter listicles based on search
  const filteredListicles = listicles.filter((listicle) => {
    const matchesSearch =
      searchQuery === '' ||
      listicle.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listicle.slug.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSearch
  })

  // Pagination
  const totalPages = Math.ceil(filteredListicles.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedListicles = filteredListicles.slice(startIndex, endIndex)

  // Function to convert data to CSV format
  const convertToCSV = (data: Listicle[]) => {
    const headers = ['Image', 'Title', 'Slug', 'Listical Ads Count', 'Blur Ads Count', 'Last Updated']
    const rows = data.map((item) => [
      item.image,
      item.title,
      item.slug,
      item.listicleAdsCount.toString(),
      item.blurAdsCount.toString(),
      item.lastUpdated,
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n')

    return csvContent
  }

  // Function to download as CSV
  const downloadCSV = () => {
    const csv = convertToCSV(filteredListicles)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `listicles-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  // Function to copy to clipboard
  const copyToClipboard = async () => {
    const csv = convertToCSV(filteredListicles)
    try {
      await navigator.clipboard.writeText(csv)
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
    }
  }

  // Handle delete
  const handleDelete = (id: string) => {
    setDeleteId(id)
  }

  const confirmDelete = () => {
    if (deleteId) {
      setListicles(listicles.filter(l => l.id !== deleteId))
      setDeleteId(null)
    }
  }

  // Handle duplicate
  const handleDuplicate = (listicle: Listicle) => {
    const newListicle: Listicle = {
      ...listicle,
      id: Date.now().toString(),
      title: `${listicle.title} (Copy)`,
      slug: `${listicle.slug}-copy`,
      lastUpdated: new Date().toISOString().split('T')[0],
    }
    setListicles([...listicles, newListicle])
  }

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  // Handle items per page change
  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value))
    setCurrentPage(1)
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div>
        <div className="mb-4 border-b pb-2">
          <h2 className="text-lg font-semibold">Listicles</h2>
          <p className="text-sm text-muted-foreground">Manage all listicle ads and their configurations</p>
        </div>

        <div className="flex flex-col gap-4">
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
                      placeholder="Search by title or slug..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value)
                        setCurrentPage(1)
                      }}
                      className="pl-9"
                    />
                  </div>
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
                  <TableHead>Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead className="text-center">Listicles</TableHead>
                  <TableHead className="text-center">Blurs</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="w-12.5"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedListicles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No listicles found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedListicles.map((listicle) => (
                    <TableRow key={listicle.id}>
                      <TableCell>
                        <div className="size-12 rounded overflow-hidden bg-muted">
                          <img
                            src={listicle.image}
                            alt={listicle.title}
                            className="size-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{listicle.title}</TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {listicle.slug}
                        </code>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
                          {listicle.listicleAdsCount}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
                          {listicle.blurAdsCount}
                        </span>
                      </TableCell>
                      <TableCell>{formatDate(listicle.lastUpdated)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon-xs">
                              <MoreVerticalIcon className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/ads/listicles/${listicle.id}`}>
                                <EyeIcon className="size-4 mr-2" />
                                View
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/ads/listicles/${listicle.id}/edit`}>
                                <EditIcon className="size-4 mr-2" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicate(listicle)}>
                              <DuplicateIcon className="size-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  variant="destructive"
                                  onSelect={(e) => {
                                    e.preventDefault()
                                    handleDelete(listicle.id)
                                  }}
                                >
                                  <TrashIcon className="size-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Listicle</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{listicle.title}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel onClick={() => setDeleteId(null)}>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={confirmDelete} variant="destructive">
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {filteredListicles.length > 0 && (
            <div className="flex items-center justify-between border-t pt-4">
              <div className="flex items-center gap-4">
                <span className="text-xs text-muted-foreground">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredListicles.length)} of {filteredListicles.length} results
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
  )
}

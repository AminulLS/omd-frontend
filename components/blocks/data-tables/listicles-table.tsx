'use client'
import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DataTable, ColumnDef, DataTableActions } from '@/components/common/DataTable'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { designTypeVariantMap, designTypeLabelMap } from '@/lib/types/listicles'
import type { Listicle, ListicleDesignType } from '@/lib/types/listicles'
import { getAllListicles } from '@/lib/services/listicles-api'

import { PaginationControls } from '@/components/common/pagination-controls'

interface ListiclesTableProps {
  onEdit?: (listicle: Listicle) => void;
  onDelete?: (id: string) => void;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function ListiclesTable({ onEdit, onDelete }: ListiclesTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const [searchQuery, setSearchQuery] = useState('')
  const [designTypeFilter, setDesignTypeFilter] = useState<string>('all')

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['listicles', currentPage, itemsPerPage, searchQuery, designTypeFilter],
    queryFn: () =>
      getAllListicles({
        page: currentPage,
        per_page: itemsPerPage,
        search: searchQuery || undefined,
        design_type: designTypeFilter !== 'all' ? (designTypeFilter as ListicleDesignType) : undefined,
      }),
  })

  const columns: ColumnDef<Listicle>[] = [
    {
      key: 'image',
      header: 'Image',
      cell: (row) => (
        <div className="size-12 rounded overflow-hidden bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {row.image ? <img src={row.image} alt={row.image_alt || row.title} className="size-full object-cover" /> :
            <div className="size-full flex items-center justify-center text-muted-foreground text-xs">No image</div>}
        </div>
      ),
    },
    {
      key: 'title',
      header: 'Title',
      sortable: true,
      cell: (row) => (
        <Link href={`/dashboard/ads/listicles/${row.id}`} className="hover:underline font-medium">
          {row.title}
        </Link>
      ),
    },
    {
      key: 'slug',
      header: 'Slug',
      sortable: true,
      cell: (row) => <code className="text-xs bg-muted px-2 py-1 rounded">{row.slug}</code>,
    },
    {
      key: 'design_type',
      header: 'Design Type',
      sortable: true,
      cell: (row) =>
        <Badge variant={designTypeVariantMap[row.design_type]}>{designTypeLabelMap[row.design_type]}</Badge>,
    },
    {
      key: 'created_at',
      header: 'Created At',
      sortable: true,
      sortValue: (row) => new Date(row.created_at),
      cell: (row) => formatDate(row.created_at),
    },
    {
      key: 'updated_at',
      header: 'Last Updated',
      sortable: true,
      sortValue: (row) => new Date(row.updated_at),
      cell: (row) => formatDate(row.updated_at),
    },
  ]

  const actions: DataTableActions<Listicle> = {
    onEdit: onEdit,
    onDelete: onDelete ? (listicle) => onDelete(listicle.id) : undefined,
  }

  const { startIndex, endIndex, totalPages, totalItems } = useMemo(() => {
    if (!data?.meta) {
      return {
        startIndex: 0,
        endIndex: 0,
        totalPages: 0,
        totalItems: 0,
      }
    }

    return {
      startIndex: data?.meta?.from || 1 - 1,
      endIndex: data.meta.to || 1,
      totalPages: data.meta.last_page,
      totalItems: data.meta.total,
    }
  }, [data])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value))
    setCurrentPage(1)
  }

  const handleFilterChange = (setter: (value: string) => void) => (value: string) => {
    setter(value)
    setCurrentPage(1)
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-destructive">Error loading
            listicles: {error?.message || 'Unknown error'}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col gap-2">
            <Label>Search</Label>
            <Input
              placeholder="Search by title or slug..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="w-62.5"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Design Type</Label>
            <Select value={designTypeFilter} onValueChange={handleFilterChange(setDesignTypeFilter)}>
              <SelectTrigger className="w-50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Design Types</SelectItem>
                {Object.entries(designTypeLabelMap).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="border-t pt-4">
        <DataTable columns={columns} data={data?.data || []} actions={actions} isLoading={isLoading} emptyMessage="No listicles found" exportFileName="listicles" />
      </div>

      <div>
        {data?.data && data.data.length > 0 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
            startIndex={startIndex}
            endIndex={endIndex}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        )}
      </div>
    </div>
  )
}

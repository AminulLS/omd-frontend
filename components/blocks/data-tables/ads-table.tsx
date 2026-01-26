'use client'

import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'

import { DataTable, ColumnDef, DataTableActions } from '@/components/common/DataTable'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import {
  statusVariantMap,
  statusLabelMap,
  pricingTypeVariantMap,
  pricingTypeLabelMap,
  placementLabelMap,
} from '@/lib/types/ads'
import type { Ad, AdStatus, AdPricingType } from '@/lib/types/ads'
import { getAllAds } from '@/lib/services/ad-api'
import { COUNTRIES } from '@/lib/constants/countries'
import { PLACEMENTS } from '@/lib/constants/placements'

import { PaginationControls } from '@/components/common/pagination-controls'

interface AdsTableProps {
  partner_id?: string;
  onEdit?: (ad: Ad) => void;
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

export function AdsTable({ onEdit, onDelete, partner_id }: AdsTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const [searchQuery, setSearchQuery] = useState('')
  const [countryFilter, setCountryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [placementFilter, setPlacementFilter] = useState<string>('all')
  const [pricingTypeFilter, setPricingTypeFilter] = useState<string>('all')
  const [partnerIdFilter, setPartnerIdFilter] = useState('')

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['ads', currentPage, itemsPerPage, searchQuery, countryFilter, partnerIdFilter, statusFilter, placementFilter, pricingTypeFilter],
    queryFn: () =>
      getAllAds({
        page: currentPage,
        per_page: itemsPerPage,
        search: searchQuery || undefined,
        country: countryFilter !== 'all' ? countryFilter : undefined,
        status: statusFilter !== 'all' ? (statusFilter as AdStatus) : undefined,
        placement: placementFilter !== 'all' ? placementFilter : undefined,
        pricing_type: pricingTypeFilter !== 'all' ? (pricingTypeFilter as AdPricingType) : undefined,
        partner_id: partner_id ? partner_id || undefined : partnerIdFilter || undefined,
      }),
  })

  const columns: ColumnDef<Ad>[] = [
    {
      key: 'title',
      header: 'Title',
      sortable: true,
      cell: (row) => (
        <Link href={`/dashboard/ads/sponsored/${row.id}`} className="hover:underline font-medium">
          {row.title}
        </Link>
      ),
    },
    {
      key: 'nickname',
      header: 'Nickname',
      sortable: true,
    },
    {
      key: 'partner_id',
      header: 'Partner',
      cell: (row) => (
        <Link href={`/dashboard/partners/${row.partner_id}/sponsored`} className="hover:underline text-primary">
          {row.partner?.name || row.partner_id}
        </Link>
      ),
    },
    {
      key: 'placement',
      header: 'Placement',
      sortable: true,
      cell: (row) => (
        <Badge variant="outline" className="text-[10px]">
          {placementLabelMap[row.placement] || row.placement}
        </Badge>
      ),
    },
    {
      key: 'pricing_type',
      header: 'Pricing Type',
      sortable: true,
      cell: (row) => (
        <div className="space-y-1">
          <Badge variant={pricingTypeVariantMap[row.pricing_type]}>{pricingTypeLabelMap[row.pricing_type]}</Badge>
        </div>
      ),
    },
    {
      key: 'pricing_type_value',
      header: 'Pricing',
      sortable: true,
      cell: (row) => (
        <div className="space-y-1">
          {row.pricing_type_value ? <div className="text-xs text-muted-foreground">${row.pricing_type_value}</div> : '—'}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      cell: (row) => <Badge variant={statusVariantMap[row.status]}>{statusLabelMap[row.status]}</Badge>,
    },
    {
      key: 'country',
      header: 'Country',
      sortable: true,
      cell: (row) => (
        <Badge variant="outline" className="text-[10px]">
          {row.country}
        </Badge>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
    },
    {
      key: 'created_at',
      header: 'Created At',
      sortable: true,
      sortValue: (row) => new Date(row.created_at),
      cell: (row) => formatDate(row.created_at),
    },
  ]

  const actions: DataTableActions<Ad> = {
    onEdit: onEdit,
    onDelete: onDelete ? (ad) => onDelete(ad.id) : undefined,
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
          <div className="text-center text-destructive">Error loading ads: {error?.message || 'Unknown error'}</div>
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
              placeholder="Search ads..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="w-62.5"
            />
          </div>

          {!partner_id && (
            <div className="flex flex-col gap-2">
              <Label>Partner ID</Label>
              <Input
                placeholder="Filter by Partner ID..."
                value={partnerIdFilter}
                onChange={(e) => {
                  setPartnerIdFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-62.5"
              />
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label>Country</Label>
            <Select value={countryFilter} onValueChange={handleFilterChange(setCountryFilter)}>
              <SelectTrigger className="w-50">
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
          </div>

          <div className="flex flex-col gap-2">
            <Label>Status</Label>
            <Select value={statusFilter} onValueChange={handleFilterChange(setStatusFilter)}>
              <SelectTrigger className="w-50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {Object.entries(statusLabelMap).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Placement</Label>
            <Select value={placementFilter} onValueChange={handleFilterChange(setPlacementFilter)}>
              <SelectTrigger className="w-50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Placements</SelectItem>
                {PLACEMENTS.map((placement) => (
                  <SelectItem key={placement.slug} value={placement.slug}>
                    {placement.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Pricing Type</Label>
            <Select value={pricingTypeFilter} onValueChange={handleFilterChange(setPricingTypeFilter)}>
              <SelectTrigger className="w-50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Pricing</SelectItem>
                {Object.entries(pricingTypeLabelMap).map(([value, label]) => (
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
        <DataTable columns={columns} data={data?.data || []} actions={actions} isLoading={isLoading} emptyMessage="No ads found" exportFileName="ads" />
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

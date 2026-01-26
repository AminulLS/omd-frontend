// components/xmls/xmls-table.tsx
'use client'

import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'

import { DataTable, ColumnDef, DataTableActions } from '@/components/common/DataTable'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { statusVariantMap, statusLabelMap } from '@/lib/types/xmls'
import type { Xml, XmlStatus } from '@/lib/types/xmls'
import { getAllXmls } from '@/lib/services/xmls-api'
import { COUNTRIES } from '@/lib/constants/countries'

import { PaginationControls } from '@/components/common/pagination-controls'

interface XmlsTableProps {
  partner_id?: string;
  onEdit?: (xml: Xml) => void;
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

export function XmlsTable({ onEdit, onDelete, partner_id }: XmlsTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const [searchQuery, setSearchQuery] = useState('')
  const [partnerIdFilter, setPartnerIdFilter] = useState('')
  const [countryFilter, setCountryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['xmls', currentPage, itemsPerPage, searchQuery, partnerIdFilter, countryFilter, statusFilter],
    queryFn: () =>
      getAllXmls({
        page: currentPage,
        per_page: itemsPerPage,
        search: searchQuery || undefined,
        partner_id: partner_id ? partner_id || undefined : partnerIdFilter || undefined,
        country: countryFilter !== 'all' ? countryFilter : undefined,
        status: statusFilter !== 'all' ? (statusFilter as XmlStatus) : undefined,
      }),
  })

  const columns: ColumnDef<Xml>[] = [
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      cell: (row) => (
        <Link href={`/dashboard/ads/xml/${row.id}`} className="hover:underline font-medium">
          {row.name}
        </Link>
      ),
    },
    {
      key: 'partner_id',
      header: 'Partner',
      cell: (row) => (
        <Link href={`/dashboard/partners/${row.partner_id}`} className="hover:underline text-primary">
          {row.partner?.name || row.partner_id}
        </Link>
      ),
    },
    {
      key: 'country',
      header: 'Country',
      sortable: true,
      cell: (row) => (
        <Badge variant="outline" className="text-[10px]">
          {COUNTRIES[row.country] || row.country}
        </Badge>
      ),
    },
    {
      key: 'budget',
      header: 'Budget',
      sortable: true,
      cell: (row) => `$${row.budget.toLocaleString()}`,
    },
    {
      key: 'monthly_budget',
      header: 'Monthly Budget',
      sortable: true,
      cell: (row) => `$${row.budget.toLocaleString()}`,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      cell: (row) => <Badge variant={statusVariantMap[row.status]}>{statusLabelMap[row.status]}</Badge>,
    },
    {
      key: 'updated_at',
      header: 'Last Updated',
      sortable: true,
      sortValue: (row) => new Date(row.updated_at),
      cell: (row) => formatDate(row.updated_at),
    },
    {
      key: 'created_at',
      header: 'Created At',
      sortable: true,
      sortValue: (row) => new Date(row.created_at),
      cell: (row) => formatDate(row.created_at),
    },
  ]

  const actions: DataTableActions<Xml> = {
    onEdit: onEdit,
    onDelete: onDelete ? (xml) => onDelete(xml.id) : undefined,
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
          <div className="text-center text-destructive">Error loading XMLs: {error?.message || 'Unknown error'}</div>
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
              placeholder="Search XMLs..."
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
        </div>
      </div>

      <div className="border-t pt-4">
        <DataTable columns={columns} data={data?.data || []} actions={actions} isLoading={isLoading} emptyMessage="No XMLs found" exportFileName="xmls" />
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

"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { FieldGroup } from "@/components/ui/field";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import * as React from "react";

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50, 100];

interface Ad {
  id: number;
  partnerId: number;
  title: string;
  placement: string;
  partner: string;
  nickname: string;
  uniqueId: string;
  status: string;
  country: string;
  dailyBudget: number;
  createdAt: string;
  updatedAt: string;
}

interface AdsSectionProps {
  adsData: Ad[];
}

export function AdsSection({ adsData }: AdsSectionProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [countryFilter, setCountryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter and paginate ads data
  const filteredAdsData = React.useMemo(() => {
    return adsData.filter((ad) => {
      const matchesSearch =
        searchQuery === "" ||
        ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ad.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ad.placement.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ad.uniqueId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ad.partner.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCountry = countryFilter === "all" || ad.country === countryFilter;
      const matchesStatus = statusFilter === "all" || ad.status === statusFilter;

      return matchesSearch && matchesCountry && matchesStatus;
    });
  }, [adsData, searchQuery, countryFilter, statusFilter]);

  const totalPages = Math.ceil(filteredAdsData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAdsData = filteredAdsData.slice(startIndex, endIndex);

  // Reset to page 1 when filters or items per page change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, countryFilter, statusFilter, itemsPerPage]);

  return (
    <Card size="sm">
      <CardHeader>
        {/* Filters */}
        <FieldGroup>
          <div className="flex flex-wrap gap-4">
            {/* Search Filter */}
            <div className="flex flex-col gap-2">
              <Label>Search</Label>
              <Input placeholder="Search ads..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-62.5" />
            </div>

            {/* Country Filter */}
            <div className="flex flex-col gap-2">
              <Label>Country</Label>
              <Select value={countryFilter} onValueChange={setCountryFilter}>
                <SelectTrigger className="w-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  <SelectItem value="US">United States</SelectItem>
                  <SelectItem value="UK">United Kingdom</SelectItem>
                  <SelectItem value="CA">Canada</SelectItem>
                  <SelectItem value="AU">Australia</SelectItem>
                  <SelectItem value="DE">Germany</SelectItem>
                  <SelectItem value="FR">France</SelectItem>
                  <SelectItem value="JP">Japan</SelectItem>
                  <SelectItem value="IN">India</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="flex flex-col gap-2">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </FieldGroup>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Partner</TableHead>
              <TableHead>Placement</TableHead>
              <TableHead>Nickname</TableHead>
              <TableHead>Unique ID</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Daily Budget</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedAdsData.length > 0 ? (
              paginatedAdsData.map((ad) => (
                <TableRow key={ad.id}>
                  <TableCell>
                    <Link href={`/dashboard/ads/sponsored/${ad.id}`} className="text-primary hover:underline font-medium">
                      {ad.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/dashboard/partners/${ad.partnerId}/sponsored`} className="text-primary hover:underline font-medium">
                      {ad.partner}
                    </Link>
                  </TableCell>
                  <TableCell>{ad.placement}</TableCell>
                  <TableCell>{ad.nickname}</TableCell>
                  <TableCell>{ad.uniqueId}</TableCell>
                  <TableCell>{ad.country}</TableCell>
                  <TableCell>
                    <Badge variant={ad.status === "active" ? "default" : ad.status === "paused" ? "destructive" : "secondary"}>{ad.status}</Badge>
                  </TableCell>
                  <TableCell>${ad.dailyBudget.toFixed(2)}</TableCell>
                  <TableCell>{ad.createdAt}</TableCell>
                  <TableCell>{ad.updatedAt}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="text-center text-muted-foreground py-8">
                  No ads found matching the current filters
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {filteredAdsData.length > 0 && (
          <div className="flex items-center justify-between p-4 border-t">
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredAdsData.length)} of {filteredAdsData.length} results
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Rows per page:</span>
                <Select value={itemsPerPage.toString()} onValueChange={(v) => setItemsPerPage(Number(v))}>
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
              <Button variant="outline" size="sm" type="button" onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))} disabled={currentPage === 1}>
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  const showPage = page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1);

                  if (!showPage) {
                    if (page === currentPage - 2 || page === currentPage + 2) {
                      return (
                        <span key={page} className="px-2 text-xs text-muted-foreground">
                          ...
                        </span>
                      );
                    }
                    return null;
                  }

                  return (
                    <Button key={page} variant={currentPage === page ? "default" : "outline"} size="sm" type="button" onClick={() => setCurrentPage(page)} className="min-w-8 px-2">
                      {page}
                    </Button>
                  );
                })}
              </div>

              <Button variant="outline" size="sm" type="button" onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages || totalPages === 0}>
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

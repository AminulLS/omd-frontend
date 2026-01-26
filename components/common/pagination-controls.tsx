"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50, 100];

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (value: string) => void;
  name?: string;
}

export function PaginationControls({ currentPage, totalPages, itemsPerPage, totalItems, startIndex, endIndex, onPageChange, onItemsPerPageChange, name = "results" }: PaginationControlsProps) {
  if (totalItems === 0) return null;

  return (
    <div className="flex items-center justify-between mt-4">
      <div className="flex items-center gap-4">
        <span className="text-xs text-muted-foreground">
          Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} {name}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Rows per page:</span>
          <Select value={itemsPerPage.toString()} onValueChange={onItemsPerPageChange}>
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
        <Button variant="outline" size="sm" type="button" onClick={() => onPageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>
          <ChevronLeftIcon className="size-4" />
          Previous
        </Button>

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
              <Button key={page} variant={currentPage === page ? "default" : "outline"} size="sm" type="button" onClick={() => onPageChange(page)} className="min-w-8 px-2">
                {page}
              </Button>
            );
          })}
        </div>

        <Button variant="outline" size="sm" type="button" onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages || totalPages === 0}>
          Next
          <ChevronRightIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
}

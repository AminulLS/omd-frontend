import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ArrowUp, ArrowDown, Download, Printer, Copy } from "lucide-react";
import { useState, useMemo } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export interface ColumnDef<T> {
  key: string;
  header: string;
  cell?: (row: T) => React.ReactNode;
  className?: string;
  sortable?: boolean;
  sortValue?: (row: T) => string | number | Date;
}

export interface DataTableActions<T> {
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  actions?: DataTableActions<T>;
  isLoading?: boolean;
  emptyMessage?: string;
  exportFileName?: string;
}

export function DataTable<T extends { id: string | number }>({ columns, data, actions, isLoading = false, emptyMessage = "No data available" }: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const sortedData = useMemo(() => {
    if (!sortConfig) return data;

    const sorted = [...data].sort((a, b) => {
      const column = columns.find((col) => col.key === sortConfig.key);
      if (!column) return 0;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const aValue = column.sortValue ? column.sortValue(a) : (a as any)[sortConfig.key];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const bValue = column.sortValue ? column.sortValue(b) : (b as any)[sortConfig.key];

      if (aValue == null) return 1;
      if (bValue == null) return -1;

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
      }

      if (aValue instanceof Date && bValue instanceof Date) {
        return sortConfig.direction === "asc" ? aValue.getTime() - bValue.getTime() : bValue.getTime() - aValue.getTime();
      }

      const aString = String(aValue).toLowerCase();
      const bString = String(bValue).toLowerCase();

      return sortConfig.direction === "asc" ? aString.localeCompare(bString) : bString.localeCompare(aString);
    });

    return sorted;
  }, [data, sortConfig, columns]);

  const handleSort = (columnKey: string) => {
    const column = columns.find((col) => col.key === columnKey);
    if (!column?.sortable) return;

    setSortConfig((current) => {
      if (current?.key === columnKey) {
        if (current.direction === "asc") {
          return { key: columnKey, direction: "desc" };
        } else {
          return null;
        }
      }
      return { key: columnKey, direction: "asc" };
    });
  };

  const getSortIcon = (columnKey: string) => {
    if (!sortConfig || sortConfig.key !== columnKey) {
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
    }
    return sortConfig.direction === "asc" ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />;
  };

  // Dummy export functions for now
  const exportToCSV = () => {
    console.log("Export to CSV - Not implemented yet");
  };

  // Dummy print functions for now
  const printTable = () => {
    console.log("Print table - Not implemented yet");
  };

  // Dummy copy functions for now
  const handleCopy = () => {
    console.log("Copy - Not implemented yet");
  };

  // Dummy download functions for now
  const handleDownloadCSV = () => {
    console.log("Download - Not implemented yet");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-2">
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleCopy} className="cursor-pointer">
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          <Button size="sm" variant="outline" onClick={exportToCSV} className="cursor-pointer">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadCSV} className="cursor-pointer">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={printTable} className="cursor-pointer">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      <div className="border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} className={column.className}>
                  {column.sortable ? (
                    <button onClick={() => handleSort(column.key)} className="flex items-center hover:text-foreground transition-colors">
                      {column.header}
                      {getSortIcon(column.key)}
                    </button>
                  ) : (
                    column.header
                  )}
                </TableHead>
              ))}
              {actions && <TableHead className="w-17.5">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          {isLoading ? (
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      <div className="h-4 w-full bg-muted animate-pulse rounded" />
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell>
                      <div className="h-8 w-8 bg-muted animate-pulse rounded" />
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          ) : (
            <TableBody>
              {sortedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + (actions ? 1 : 0)} className="h-24 text-center text-muted-foreground">
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                sortedData.map((row) => (
                  <TableRow key={row.id}>
                    {columns.map((column) => (
                      <TableCell key={column.key} className={column.className}>
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {column.cell ? column.cell(row) : (row as any)[column.key]}
                      </TableCell>
                    ))}
                    {actions && (
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <span className="sr-only">Open menu</span>
                              <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="1" />
                                <circle cx="12" cy="5" r="1" />
                                <circle cx="12" cy="19" r="1" />
                              </svg>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {actions.onView && <DropdownMenuItem onClick={() => actions.onView!(row)}>View</DropdownMenuItem>}
                            {actions.onEdit && <DropdownMenuItem onClick={() => actions.onEdit!(row)}>Edit</DropdownMenuItem>}
                            {actions.onDelete && (
                              <DropdownMenuItem onClick={() => actions.onDelete!(row)} className="text-destructive">
                                Delete
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          )}
        </Table>
      </div>
    </div>
  );
}

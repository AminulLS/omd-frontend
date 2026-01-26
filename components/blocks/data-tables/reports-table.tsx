"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import * as React from "react";

const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50, 100];

interface HourlyBarChartProps {
  data: number[];
  maxBars?: number;
}

function HourlyBarChart({ data, maxBars = 24 }: HourlyBarChartProps) {
  const max = Math.max(...data);
  const bars = data.slice(0, maxBars);

  return (
    <div className="flex items-end gap-0.5 h-4 w-full">
      {bars.map((value, idx) => (
        <div key={idx} className="flex-1 bg-primary/80 hover:bg-primary transition-colors" style={{ height: `${(value / max) * 100}%` }} title={`${idx}:00 - ${value} clicks`} />
      ))}
    </div>
  );
}

interface ReportTableProps {
  columns: string[];
  data: Record<string, string | number | number[]>[];
  linkColumn?: string;
  linkPath?: string;
  linkSuffix?: string;
  linkColumns?: Record<string, { path: string; suffix?: string }>;
  showTotals?: boolean;
}

export function ReportTable({ columns, data, linkColumn, linkPath, linkSuffix, linkColumns, showTotals = true }: ReportTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  const formatValue = (columnName: string, value: string | number | number[]): string => {
    if (Array.isArray(value)) {
      return "";
    }

    if (typeof value === "number") {
      const lowerCol = columnName.toLowerCase();

      if (columnName === "Indexing Speed" || columnName === "Total Time Indexing") {
        return formatTime(value);
      }

      if (lowerCol.includes("revenue") || lowerCol.includes("cpc") || lowerCol.includes("cpa") || lowerCol.includes("rpm")) {
        return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      }

      if (lowerCol.includes("ctr") || lowerCol === "conversion %") {
        return `${value.toFixed(2)}%`;
      }

      if (lowerCol.includes("impression") || lowerCol.includes("click") || lowerCol.includes("conversion") || lowerCol.includes("ls") || lowerCol === "jobs") {
        return value.toLocaleString();
      }

      return value.toString();
    }

    return value;
  };

  const handleCopy = () => {
    const headers = columns.join(",");
    const rows = data.map((row) =>
      Object.values(row)
        .map((value, idx) => {
          if (Array.isArray(value)) {
            return JSON.stringify(value);
          }
          return formatValue(columns[idx], value);
        })
        .join(",")
    );
    const csv = [headers, ...rows].join("\n");
    navigator.clipboard.writeText(csv);
  };

  const handleDownloadCSV = () => {
    const headers = columns.join(",");
    const rows = data.map((row) =>
      Object.values(row)
        .map((value, idx) => {
          if (Array.isArray(value)) {
            return JSON.stringify(value);
          }
          return formatValue(columns[idx], value);
        })
        .join(",")
    );
    const csv = [headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const calculateTotals = () => {
    const totalsArray = new Array(columns.length - 1).fill(0);
    const countArray = new Array(columns.length - 1).fill(0);
    const averageColumns = ["CPC", "CTR", "Conversion %"];

    data.forEach((row) => {
      columns.slice(1).forEach((colName, idx) => {
        let dataKey = colName.toLowerCase().replace(/ /g, "").replace("%", "percentage");

        if (colName === "Clicks Hourly") dataKey = "clicksHourly";
        if (colName === "Avg. CPC") dataKey = "avgCpc";
        if (colName === "Conversion %") dataKey = "conversionPercentage";
        if (colName === "LS #s") dataKey = "lsNumbers";
        if (colName === "API Key") dataKey = "apiKey";
        if (colName === "Last Updated") dataKey = "lastUpdated";
        if (colName === "Next Run") dataKey = "nextRun";
        if (colName === "Last Status") dataKey = "lastStatus";
        if (colName === "Indexing Speed") dataKey = "indexingSpeed";
        if (colName === "Total Time Indexing") dataKey = "totalTimeIndexing";
        if (colName === "Min. CPC") dataKey = "minCpc";
        if (colName === "Max. CPC") dataKey = "maxCpc";

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const value = (row as any)[dataKey];
        if (typeof value === "number") {
          const shouldAverage = averageColumns.some((avgCol) => colName.includes(avgCol));

          if (shouldAverage) {
            totalsArray[idx] += value;
            countArray[idx]++;
          } else {
            totalsArray[idx] += value;
          }
        }
      });
    });

    averageColumns.forEach((avgCol) => {
      columns.slice(1).forEach((colName, idx) => {
        if (colName.includes(avgCol) && countArray[idx] > 0) {
          totalsArray[idx] = totalsArray[idx] / countArray[idx];
        }
      });
    });

    return totalsArray;
  };

  const totals = calculateTotals();

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  return (
    <Card size="sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Report</CardTitle>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleCopy}>
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
            <Button size="sm" variant="outline" onClick={handleDownloadCSV}>
              <Download className="h-4 w-4 mr-2" />
              CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col, idx) => (
                <TableHead key={idx}>{col}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((row, idx) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const rowId = (row as any).id;
              return (
                <TableRow key={idx}>
                  {columns.map((columnName, cellIdx) => {
                    let dataKey = columnName.toLowerCase().replace(/ /g, "").replace("%", "percentage");

                    if (columnName === "Clicks Hourly") dataKey = "clicksHourly";
                    if (columnName === "Avg. CPC") dataKey = "avgCpc";
                    if (columnName === "Conversion %") dataKey = "conversionPercentage";
                    if (columnName === "LS #s") dataKey = "lsNumbers";
                    if (columnName === "API Key") dataKey = "apiKey";
                    if (columnName === "Last Updated") dataKey = "lastUpdated";
                    if (columnName === "Next Run") dataKey = "nextRun";
                    if (columnName === "Last Status") dataKey = "lastStatus";
                    if (columnName === "Indexing Speed") dataKey = "indexingSpeed";
                    if (columnName === "Total Time Indexing") dataKey = "totalTimeIndexing";
                    if (columnName === "Min. CPC") dataKey = "minCpc";
                    if (columnName === "Max. CPC") dataKey = "maxCpc";
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const value = (row as any)[dataKey];
                    const isLinkColumn = linkColumn && columnName === linkColumn;
                    const linkConfig = linkColumns?.[columnName];

                    if (Array.isArray(value)) {
                      return (
                        <TableCell key={cellIdx} className="min-w-25">
                          <HourlyBarChart data={value as number[]} />
                        </TableCell>
                      );
                    }

                    if (isLinkColumn && linkPath && rowId) {
                      return (
                        <TableCell key={cellIdx}>
                          <Link href={`${linkPath}/${rowId}${linkSuffix || ""}`} className="text-primary hover:underline font-medium">
                            {formatValue(columnName, value)}
                          </Link>
                        </TableCell>
                      );
                    }

                    if (linkConfig) {
                      let linkId = rowId;
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      if (columnName === "Feed") linkId = (row as any).feedId || rowId;
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      if (columnName === "Partner") linkId = (row as any).partnerId || rowId;
                      return (
                        <TableCell key={cellIdx}>
                          <Link href={`${linkConfig.path}/${linkId}${linkConfig.suffix || ""}`} className="text-primary hover:underline font-medium">
                            {formatValue(columnName, value)}
                          </Link>
                        </TableCell>
                      );
                    }

                    return <TableCell key={cellIdx}>{formatValue(columnName, value)}</TableCell>;
                  })}
                </TableRow>
              );
            })}
            {showTotals && (
              <TableRow className="bg-muted/50 font-semibold">
                <TableCell>Totals</TableCell>
                {columns.slice(1).map((colName, idx) => {
                  const totalValue = totals[idx];
                  return <TableCell key={idx}>{totalValue !== undefined && totalValue > 0 ? formatValue(colName, totalValue) : "-"}</TableCell>;
                })}
              </TableRow>
            )}
          </TableBody>
        </Table>

        {data.length > 0 && (
          <div className="flex items-center justify-between p-4 border-t">
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground">
                Showing {startIndex + 1}-{Math.min(endIndex, data.length)} of {data.length} results
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
              <Button variant="outline" size="sm" type="button" onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))} disabled={currentPage === 1}>
                <ChevronLeft className="h-4 w-4" />
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

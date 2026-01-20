"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const mockStatsData = [
  { date: "01/09/2026", impressions: 45230, clicks: 1234, ctr: 2.73, revenue: 245.67 },
  { date: "01/10/2026", impressions: 48120, clicks: 1456, ctr: 3.03, revenue: 298.45 },
  { date: "01/11/2026", impressions: 44560, clicks: 1189, ctr: 2.67, revenue: 212.34 },
  { date: "01/12/2026", impressions: 51230, clicks: 1567, ctr: 3.06, revenue: 312.56 },
  { date: "01/13/2026", impressions: 47890, clicks: 1345, ctr: 2.81, revenue: 267.89 },
  { date: "01/14/2026", impressions: 49340, clicks: 1423, ctr: 2.88, revenue: 278.9 },
  { date: "01/15/2026", impressions: 50670, clicks: 1523, ctr: 3.01, revenue: 301.23 },
];

export function AdStatsTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Stats</CardTitle>
        <CardDescription>View your ad&apos;s performance metrics over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="border p-4">
            <div className="text-sm text-muted-foreground">Total Impressions</div>
            <div className="text-2xl font-bold">{mockStatsData.reduce((acc, row) => acc + row.impressions, 0).toLocaleString()}</div>
          </div>
          <div className="border p-4">
            <div className="text-sm text-muted-foreground">Total Clicks</div>
            <div className="text-2xl font-bold">{mockStatsData.reduce((acc, row) => acc + row.clicks, 0).toLocaleString()}</div>
          </div>
          <div className="border p-4">
            <div className="text-sm text-muted-foreground">Avg CTR</div>
            <div className="text-2xl font-bold">{(mockStatsData.reduce((acc, row) => acc + row.ctr, 0) / mockStatsData.length).toFixed(2)}%</div>
          </div>
          <div className="border p-4">
            <div className="text-sm text-muted-foreground">Total Revenue</div>
            <div className="text-2xl font-bold">${mockStatsData.reduce((acc, row) => acc + row.revenue, 0).toFixed(2)}</div>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Impressions</TableHead>
              <TableHead>Clicks</TableHead>
              <TableHead>CTR</TableHead>
              <TableHead>Revenue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockStatsData.map((stat, idx) => (
              <TableRow key={idx}>
                <TableCell>{stat.date}</TableCell>
                <TableCell>{stat.impressions.toLocaleString()}</TableCell>
                <TableCell>{stat.clicks.toLocaleString()}</TableCell>
                <TableCell>{stat.ctr}%</TableCell>
                <TableCell>${stat.revenue.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

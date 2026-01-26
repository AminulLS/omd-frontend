"use client";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HourlyChart } from "@/components/blocks/charts/hourly-chart";
import { MonthlyChart } from "@/components/blocks/charts/monthly-chart";
import { format } from "date-fns";
import * as React from "react";

interface AdsStatsProps {
  hourlyData: Array<{
    key: string;
    fields: {
      today_revenue: number;
      today_clicks: number;
      yesterday_revenue: number;
      yesterday_clicks: number;
      sdlw_revenue: number;
      sdlw_clicks: number;
    };
  }>;
  monthlyData: Array<{
    key: string;
    fields: {
      current: number;
      last: number;
    };
  }>;
  hourlyConfig: Record<string, { color: string; label: string }>;
  monthlyConfig: Record<string, { color: string; label: string }>;
}

export function AdsStats({ hourlyData, monthlyData, hourlyConfig, monthlyConfig }: AdsStatsProps) {
  const todayTotal = hourlyData.reduce((acc, curr) => acc + curr.fields.today_revenue, 0);
  const yesterdayTotal = hourlyData.reduce((acc, curr) => acc + curr.fields.yesterday_revenue, 0);
  const sdlwTotal = hourlyData.reduce((acc, curr) => acc + curr.fields.sdlw_revenue, 0);
  const currentMonthTotal = monthlyData.reduce((acc, curr) => acc + curr.fields.current, 0);
  const lastMonthTotal = monthlyData.reduce((acc, curr) => acc + curr.fields.last, 0);

  // Generate weekly table data
  const weeklyTableData = React.useMemo(
    () =>
      [...Array(7)].map((_, idx) => {
        // eslint-disable-next-line react-hooks/purity
        const revenue = (Math.random() * 1000.54 + 200).toLocaleString();
        // eslint-disable-next-line react-hooks/purity
        const sdlw = (Math.random() * 1000.74 + 200).toLocaleString();
        // eslint-disable-next-line react-hooks/purity
        const delta = (Math.random() * 1000.23 + 200).toLocaleString();
        return {
          date: new Date(2026, 1, 1 + idx),
          revenue,
          sdlw,
          delta,
        };
      }),
    []
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Monthly Chart */}
      <Card size="sm">
        <CardHeader>
          <CardTitle>Daily Revenue</CardTitle>
          <CardDescription>This month vs Last Month</CardDescription>
          <CardAction>
            <div className="flex gap-2">
              <Badge className="bg-chart-2 rounded-full">${currentMonthTotal.toLocaleString()}</Badge>
              <Badge className="bg-chart-3 rounded-full">${lastMonthTotal.toLocaleString()}</Badge>
            </div>
          </CardAction>
        </CardHeader>
        <CardContent>
          <MonthlyChart data={monthlyData} config={monthlyConfig} />
        </CardContent>
      </Card>

      <div className="flex gap-2">
        {/* Hourly Chart */}
        <Card size="sm" className="w-4/6">
          <CardHeader>
            <CardTitle>Recent Revenue</CardTitle>
            <CardAction>
              <span className="text-xs text-muted-foreground">Last Updated: {new Date().toLocaleString()}</span>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center gap-4 items-center mb-2">
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Today</div>
                <div className="text-lg font-semibold flex items-center gap-1">${todayTotal.toLocaleString()}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Yesterday</div>
                <div className="text-lg font-semibold flex items-center gap-1">${yesterdayTotal.toLocaleString()}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">SDLW</div>
                <div className="text-lg font-semibold flex items-center gap-1">${sdlwTotal.toLocaleString()}</div>
              </div>
            </div>
            <HourlyChart data={hourlyData} config={hourlyConfig} />
          </CardContent>
        </Card>

        {/* Weekly Table */}
        <Card size="sm" className="w-2/6">
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>SDLW</TableHead>
                  <TableHead>Delta</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {weeklyTableData.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableHead>
                      <span>{format(row.date, "MM/dd/yyyy")}</span>
                      <small> ({format(row.date, "ccc")})</small>
                    </TableHead>
                    <TableCell>${row.revenue}</TableCell>
                    <TableCell>${row.sdlw}</TableCell>
                    <TableCell>${row.delta}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableHead className="text-right font-semibold">Totals</TableHead>
                  {/* eslint-disable-next-line react-hooks/purity */}
                  <TableCell>${(Math.random() * 1000.54 + 200).toLocaleString()}</TableCell>
                  {/* eslint-disable-next-line react-hooks/purity */}
                  <TableCell>${(Math.random() * 1000.54 + 200).toLocaleString()}</TableCell>
                  {/* eslint-disable-next-line react-hooks/purity */}
                  <TableCell>${(Math.random() * 1000.54 + 200).toLocaleString()}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

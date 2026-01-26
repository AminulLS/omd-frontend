"use client";

import * as React from "react";
import { AdsStats } from "@/components/blocks/stats/ads-stats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { XmlsTable } from "@/components/blocks/data-tables/xml-table";
import ReportsSection, { reportTypes } from "@/components/blocks/reports/ads-reports";

const data = (hours = 24) => {
  return [...Array(hours)].map((_, h) => {
    const format = (h: number) => `${h % 12 || 12}${h < 12 ? "am" : "pm"}`;
    return {
      key: format(h),
      fields: {
        today_revenue: Math.floor(Math.random() * 1000) + 200,
        today_clicks: Math.floor(Math.random() * 1000) + 200,
        yesterday_revenue: Math.floor(Math.random() * 1000) + 200,
        yesterday_clicks: Math.floor(Math.random() * 1000) + 200,
        sdlw_revenue: Math.floor(Math.random() * 1000) + 200,
        sdlw_clicks: Math.floor(Math.random() * 1000) + 200,
      },
    };
  });
};

const config = {
  today_revenue: {
    color: "#F96E5B",
    label: "Today Revenue",
  },
  today_clicks: {
    color: "#FFE2AF",
    label: "Today Clicks",
  },
  yesterday_revenue: {
    color: "#79C9C5",
    label: "Yesterday Revenue",
  },
  yesterday_clicks: {
    color: "#3F9AAE",
    label: "Yesterday Clicks",
  },
  sdlw_revenue: {
    color: "#BDE8F5",
    label: "SDLW Revenue",
  },
  sdlw_clicks: {
    color: "#4988C4",
    label: "SDLW Clicks",
  },
};

const dataTwoMonth = () => {
  const daysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  const now = new Date();
  const currentMonthDays = daysInMonth(now.getMonth(), now.getFullYear());
  const lastMonthDays = daysInMonth(now.getMonth() - 1 < 0 ? 11 : now.getMonth() - 1, now.getMonth() - 1 < 0 ? now.getFullYear() - 1 : now.getFullYear());
  const data = [];

  for (let i = 1; i <= currentMonthDays; i++) {
    data[i - 1] = {
      key: i.toString().padStart(2, "0"),
      fields: {
        current: Math.floor(Math.random() * 1000) + 200,
        last: 0,
      },
    };
  }

  for (let i = 1; i <= lastMonthDays; i++) {
    if (!data[i - 1]) {
      data[i - 1] = {
        key: i.toString().padStart(2, "0"),
        fields: {
          current: 0,
          last: 0,
        },
      };
    }

    data[i - 1].fields.last = Math.floor(Math.random() * 1000) + 200;
  }

  return data;
};

const configTwoMonth = {
  current: {
    color: "var(--chart-2)",
    label: "This Month",
  },
  last: {
    color: "var(--chart-3)",
    label: "Last Month",
  },
};

export default function Page() {
  const hourlyData = React.useMemo(() => data(), []);
  const monthlyData = React.useMemo(() => dataTwoMonth(), []);
  return (
    <div>
      <div className="mb-4 border-b pb-2">
        <h2 className="text-lg font-semibold">XML Direct Listings</h2>
        <p className="text-sm text-muted-foreground">Manage all of the XML Direct Listings</p>
      </div>

      <AdsStats hourlyData={hourlyData} monthlyData={monthlyData} hourlyConfig={config} monthlyConfig={configTwoMonth} />

      <Tabs defaultValue="reports" className="mt-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="ads">XML</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="pt-2">
          <ReportsSection reports={[reportTypes.partners, reportTypes.parsing, reportTypes.campaigns, reportTypes.categories]} />
        </TabsContent>

        <TabsContent value="ads" className="pt-2">
          <XmlsTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}

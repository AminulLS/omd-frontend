"use client";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FieldGroup } from "@/components/ui/field";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useState, useMemo } from "react";
import { ReportTable } from "../data-tables/reports-table";

const generateMockPartnerData = () =>
  [...Array(50)].map((_, idx) => {
    const lsOptions = ["", "yes", "no"];
    const randomLs = lsOptions[Math.floor(Math.random() * lsOptions.length)];

    return {
      id: idx + 1,
      date: format(new Date(2026, 0, 1 + (idx % 30)), "MM/dd/yyyy"),
      partner: `Partner ${idx + 1}`,
      impressions: Math.floor(Math.random() * 50000) + 10000,
      clicks: Math.floor(Math.random() * 1000) + 100,
      cpc: Math.round((Math.random() * 2 + 0.5) * 100) / 100,
      ctr: Math.round((Math.random() * 5 + 1) * 100) / 100,
      rpm: Math.round((Math.random() * 10 + 5) * 100) / 100,
      conversion: Math.floor(Math.random() * 100) + 10,
      conversionPercentage: Math.round((Math.random() * 10 + 1) * 100) / 100,
      cpa: Math.round((Math.random() * 50 + 10) * 100) / 100,
      revenue: Math.round((Math.random() * 5000 + 500) * 100) / 100,
      lsNumbers: randomLs,
      clicksHourly: [...Array(24)].map(() => Math.floor(Math.random() * 100)),
    };
  });

const generateMockBoardData = () =>
  [...Array(50)].map((_, idx) => ({
    date: format(new Date(2026, 0, 1 + (idx % 30)), "MM/dd/yyyy"),
    board: `Board ${idx + 1}`,
    impressions: Math.floor(Math.random() * 50000) + 10000,
    clicks: Math.floor(Math.random() * 1000) + 100,
    ctr: Math.round((Math.random() * 5 + 1) * 100) / 100,
    rpm: Math.round((Math.random() * 10 + 5) * 100) / 100,
    revenue: Math.round((Math.random() * 5000 + 500) * 100) / 100,
  }));

const generateMockPlacementData = () =>
  [...Array(50)].map((_, idx) => ({
    date: format(new Date(2026, 0, 1 + (idx % 30)), "MM/dd/yyyy"),
    placement: `Placement ${idx + 1}`,
    impressions: Math.floor(Math.random() * 50000) + 10000,
    clicks: Math.floor(Math.random() * 1000) + 100,
    avgCpc: Math.round((Math.random() * 2 + 0.5) * 100) / 100,
    ctr: Math.round((Math.random() * 5 + 1) * 100) / 100,
    rpm: Math.round((Math.random() * 10 + 5) * 100) / 100,
    conversion: Math.floor(Math.random() * 100) + 10,
    conversionPercentage: Math.round((Math.random() * 10 + 1) * 100) / 100,
    cpa: Math.round((Math.random() * 50 + 10) * 100) / 100,
    revenue: Math.round((Math.random() * 5000 + 500) * 100) / 100,
  }));

const generateMockSourceData = () =>
  [...Array(50)].map((_, idx) => ({
    date: format(new Date(2026, 0, 1 + (idx % 30)), "MM/dd/yyyy"),
    source: `Source ${idx + 1}`,
    impressions: Math.floor(Math.random() * 50000) + 10000,
    clicks: Math.floor(Math.random() * 1000) + 100,
    avgCpc: Math.round((Math.random() * 2 + 0.5) * 100) / 100,
    ctr: Math.round((Math.random() * 5 + 1) * 100) / 100,
    rpm: Math.round((Math.random() * 10 + 5) * 100) / 100,
    conversion: Math.floor(Math.random() * 100) + 10,
    conversionPercentage: Math.round((Math.random() * 10 + 1) * 100) / 100,
    cpa: Math.round((Math.random() * 50 + 10) * 100) / 100,
    revenue: Math.round((Math.random() * 5000 + 500) * 100) / 100,
  }));

const generateMockMediumData = () =>
  [...Array(50)].map((_, idx) => ({
    date: format(new Date(2026, 0, 1 + (idx % 30)), "MM/dd/yyyy"),
    medium: `Medium ${idx + 1}`,
    impressions: Math.floor(Math.random() * 50000) + 10000,
    clicks: Math.floor(Math.random() * 1000) + 100,
    avgCpc: Math.round((Math.random() * 2 + 0.5) * 100) / 100,
    ctr: Math.round((Math.random() * 5 + 1) * 100) / 100,
    rpm: Math.round((Math.random() * 10 + 5) * 100) / 100,
    conversion: Math.floor(Math.random() * 100) + 10,
    conversionPercentage: Math.round((Math.random() * 10 + 1) * 100) / 100,
    cpa: Math.round((Math.random() * 50 + 10) * 100) / 100,
    revenue: Math.round((Math.random() * 5000 + 500) * 100) / 100,
  }));

const generateMockKeywordsData = () =>
  [...Array(50)].map((_, idx) => ({
    date: format(new Date(2026, 0, 1 + (idx % 30)), "MM/dd/yyyy"),
    keyword: `Keyword ${idx + 1}`,
    impressions: Math.floor(Math.random() * 50000) + 10000,
    clicks: Math.floor(Math.random() * 1000) + 100,
    avgCpc: Math.round((Math.random() * 2 + 0.5) * 100) / 100,
    ctr: Math.round((Math.random() * 5 + 1) * 100) / 100,
    rpm: Math.round((Math.random() * 10 + 5) * 100) / 100,
    conversion: Math.floor(Math.random() * 100) + 10,
    conversionPercentage: Math.round((Math.random() * 10 + 1) * 100) / 100,
    cpa: Math.round((Math.random() * 50 + 10) * 100) / 100,
    revenue: Math.round((Math.random() * 5000 + 500) * 100) / 100,
  }));

const generateMockCompaniesData = () =>
  [...Array(50)].map((_, idx) => ({
    date: format(new Date(2026, 0, 1 + (idx % 30)), "MM/dd/yyyy"),
    company: `Company ${idx + 1}`,
    impressions: Math.floor(Math.random() * 50000) + 10000,
    clicks: Math.floor(Math.random() * 1000) + 100,
    avgCpc: Math.round((Math.random() * 2 + 0.5) * 100) / 100,
    ctr: Math.round((Math.random() * 5 + 1) * 100) / 100,
    rpm: Math.round((Math.random() * 10 + 5) * 100) / 100,
    conversion: Math.floor(Math.random() * 100) + 10,
    conversionPercentage: Math.round((Math.random() * 10 + 1) * 100) / 100,
    cpa: Math.round((Math.random() * 50 + 10) * 100) / 100,
    revenue: Math.round((Math.random() * 5000 + 500) * 100) / 100,
  }));

const generateMockApiKeyData = () =>
  [...Array(50)].map((_, idx) => ({
    id: idx + 1,
    date: format(new Date(2026, 0, 1 + (idx % 30)), "MM/dd/yyyy"),
    apiKey: `key-${Math.random().toString(36).substring(7)}`,
    impressions: Math.floor(Math.random() * 50000) + 10000,
    clicks: Math.floor(Math.random() * 1000) + 100,
    avgCpc: Math.round((Math.random() * 2 + 0.5) * 100) / 100,
    ctr: Math.round((Math.random() * 5 + 1) * 100) / 100,
    rpm: Math.round((Math.random() * 10 + 5) * 100) / 100,
    conversion: Math.floor(Math.random() * 100) + 10,
    conversionPercentage: Math.round((Math.random() * 10 + 1) * 100) / 100,
    cpa: Math.round((Math.random() * 50 + 10) * 100) / 100,
    revenue: Math.round((Math.random() * 5000 + 500) * 100) / 100,
  }));

const generateMockParsingData = () =>
  [...Array(50)].map((_, idx) => {
    const cyclesCompleted = Math.floor(Math.random() * 100) + 1;
    const cyclesTotal = cyclesCompleted + Math.floor(Math.random() * 10);
    const indexingSpeedSeconds = Math.floor(Math.random() * 86400) + 60; // Up to 24 hours in seconds
    const totalTimeSeconds = Math.floor(Math.random() * 86400) + 60;

    return {
      id: idx + 1,
      feedId: idx + 1,
      partnerId: (idx % 10) + 1,
      feed: `Feed ${idx + 1}`,
      partner: `Partner ${(idx % 10) + 1}`,
      jobs: Math.floor(Math.random() * 5000) + 100,
      lastUpdated: format(new Date(2026, 0, 1 + idx), "MM/dd/yyyy HH:mm"),
      nextRun: format(new Date(2026, 0, 1 + idx + 1), "MM/dd/yyyy HH:mm"),
      cycles: `${cyclesCompleted}/${cyclesTotal}`,
      lastStatus: ["success", "failed", "running", "pending"][Math.floor(Math.random() * 4)],
      indexingSpeed: indexingSpeedSeconds,
      totalTimeIndexing: totalTimeSeconds,
    };
  });

const generateMockCampaignData = () =>
  [...Array(50)].map((_, idx) => ({
    id: idx + 1,
    feedId: idx + 1,
    partnerId: (idx % 10) + 1,
    date: format(new Date(2026, 0, 1 + (idx % 30)), "MM/dd/yyyy"),
    feed: `Feed ${idx + 1}`,
    partner: `Partner ${(idx % 10) + 1}`,
    jobs: Math.floor(Math.random() * 5000) + 100,
    clicks: Math.floor(Math.random() * 1000) + 100,
    avgCpc: Math.round((Math.random() * 2 + 0.5) * 100) / 100,
    ctr: Math.round((Math.random() * 5 + 1) * 100) / 100,
    rpm: Math.round((Math.random() * 10 + 5) * 100) / 100,
    conversion: Math.floor(Math.random() * 100) + 10,
    conversionPercentage: Math.round((Math.random() * 10 + 1) * 100) / 100,
    cpa: Math.round((Math.random() * 50 + 10) * 100) / 100,
    revenue: Math.round((Math.random() * 5000 + 500) * 100) / 100,
  }));

const generateMockCategoryData = () =>
  [...Array(50)].map((_, idx) => {
    const categories = ["Technology", "Healthcare", "Finance", "Education", "Retail", "Manufacturing", "Transportation", "Entertainment"];
    const category = categories[idx % categories.length];
    return {
      date: format(new Date(2026, 0, 1 + (idx % 30)), "MM/dd/yyyy"),
      category: `${category} ${Math.floor(idx / categories.length) + 1}`,
      impressions: Math.floor(Math.random() * 50000) + 10000,
      clicks: Math.floor(Math.random() * 1000) + 100,
      minCpc: Math.round((Math.random() * 1 + 0.3) * 100) / 100,
      avgCpc: Math.round((Math.random() * 2 + 0.5) * 100) / 100,
      maxCpc: Math.round((Math.random() * 4 + 2) * 100) / 100,
      ctr: Math.round((Math.random() * 5 + 1) * 100) / 100,
      rpm: Math.round((Math.random() * 10 + 5) * 100) / 100,
      conversion: Math.floor(Math.random() * 100) + 10,
      conversionPercentage: Math.round((Math.random() * 10 + 1) * 100) / 100,
      cpa: Math.round((Math.random() * 50 + 10) * 100) / 100,
      revenue: Math.round((Math.random() * 5000 + 500) * 100) / 100,
    };
  });

type DateRange = {
  from: Date | undefined;
  to?: Date | undefined;
};

interface ReportType {
  value: string;
  title: string;
}
interface ReportsSectionProps {
  reports: ReportType[];
}

export const reportTypes = {
  partners: { value: "partners", title: "Partners" },
  boards: { value: "boards", title: "Boards" },
  placements: { value: "placements", title: "Placements" },
  sources: { value: "sources", title: "Sources" },
  mediums: { value: "mediums", title: "Mediums" },
  keywords: { value: "keywords", title: "Keywords" },
  companies: { value: "companies", title: "Companies" },
  apikeys: { value: "apikeys", title: "Api Keys" },
  parsing: { value: "parsing", title: "Parsing" },
  campaigns: { value: "campaigns", title: "Campaigns" },
  categories: { value: "categories", title: "Categories" },
};

export default function ReportsSection({ reports }: ReportsSectionProps) {
  const partnerData = useMemo(() => generateMockPartnerData(), []);
  const boardData = useMemo(() => generateMockBoardData(), []);
  const placementData = useMemo(() => generateMockPlacementData(), []);
  const sourceData = useMemo(() => generateMockSourceData(), []);
  const mediumData = useMemo(() => generateMockMediumData(), []);
  const keywordsData = useMemo(() => generateMockKeywordsData(), []);
  const companiesData = useMemo(() => generateMockCompaniesData(), []);
  const apiKeyData = useMemo(() => generateMockApiKeyData(), []);
  const parsingData = useMemo(() => generateMockParsingData(), []);
  const campaignData = useMemo(() => generateMockCampaignData(), []);
  const categoryData = useMemo(() => generateMockCategoryData(), []);

  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>("all");

  const formatDateRange = () => {
    if (!dateRange?.from) return "Select range";
    if (!dateRange.to) return format(dateRange.from, "MMM d, yyyy");
    return `${format(dateRange.from, "MMM d, yyyy")} - ${format(dateRange.to, "MMM d, yyyy")}`;
  };

  return (
    <div className="space-y-4">
      <FieldGroup>
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col gap-2">
            <Label>Date Range</Label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-70 justify-start text-left font-normal" type="button">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {formatDateRange()}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={
                    dateRange?.from && dateRange?.to
                      ? {
                          from: dateRange.from,
                          to: dateRange.to,
                        }
                      : undefined
                  }
                  onSelect={(range) => {
                    if (range?.from) {
                      setDateRange({
                        from: range.from,
                        to: range.to,
                      });
                    }
                  }}
                  numberOfMonths={2}
                  initialFocus
                />
                <div className="p-3 border-t">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      size="sm"
                      onClick={() => {
                        setDateRange(undefined);
                      }}
                    >
                      Clear
                    </Button>
                    <Button
                      className="flex-1"
                      size="sm"
                      onClick={() => {
                        setIsCalendarOpen(false);
                      }}
                      disabled={!dateRange?.from}
                    >
                      Confirm
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Country</Label>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="w-50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                <SelectItem value="US">United States</SelectItem>
                <SelectItem value="UK">United Kingdom</SelectItem>
                <SelectItem value="CA">Canada</SelectItem>
                <SelectItem value="AU">Australia</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </FieldGroup>

      <Tabs defaultValue="partners">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          {reports && reports.length > 0
            ? reports?.map((report) => (
                <TabsTrigger key={report?.value} value={report?.value}>
                  {report?.title || ""}
                </TabsTrigger>
              ))
            : "No Reports"}
        </TabsList>

        {/* Partner Table */}
        <TabsContent value="partners" className="pt-2">
          <ReportTable
            columns={["Date", "Partner", "Impressions", "Clicks", "CPC", "CTR", "RPM", "Conversion", "Conversion %", "CPA", "Revenue", "LS #s", "Clicks Hourly"]}
            data={partnerData}
            linkColumn="Partner"
            linkPath="/dashboard/partners"
            linkSuffix="/sponsored"
          />
        </TabsContent>

        {/* Boards Table */}
        <TabsContent value="boards" className="pt-2">
          <ReportTable columns={["Date", "Board", "Impressions", "Clicks", "CTR", "RPM", "Revenue"]} data={boardData} />
        </TabsContent>

        {/* Placements Table */}
        <TabsContent value="placements" className="pt-2">
          <ReportTable columns={["Date", "Placement", "Impressions", "Clicks", "Avg. CPC", "CTR", "RPM", "Conversion", "Conversion %", "CPA", "Revenue"]} data={placementData} />
        </TabsContent>

        {/* Sources Table */}
        <TabsContent value="sources" className="pt-2">
          <ReportTable columns={["Date", "Source", "Impressions", "Clicks", "Avg. CPC", "CTR", "RPM", "Conversion", "Conversion %", "CPA", "Revenue"]} data={sourceData} />
        </TabsContent>

        {/* Mediums Table */}
        <TabsContent value="mediums" className="pt-2">
          <ReportTable columns={["Date", "Medium", "Impressions", "Clicks", "Avg. CPC", "CTR", "RPM", "Conversion", "Conversion %", "CPA", "Revenue"]} data={mediumData} />
        </TabsContent>

        {/* Keywords Table */}
        <TabsContent value="keywords" className="pt-2">
          <ReportTable columns={["Date", "Keyword", "Impressions", "Clicks", "Avg. CPC", "CTR", "RPM", "Conversion", "Conversion %", "CPA", "Revenue"]} data={keywordsData} />
        </TabsContent>

        {/* Companies Table */}
        <TabsContent value="companies" className="pt-2">
          <ReportTable columns={["Date", "Company", "Impressions", "Clicks", "Avg. CPC", "CTR", "RPM", "Conversion", "Conversion %", "CPA", "Revenue"]} data={companiesData} />
        </TabsContent>

        {/* API Key Table */}
        <TabsContent value="apikeys" className="pt-2">
          <ReportTable columns={["Date", "API Key", "Impressions", "Clicks", "Avg. CPC", "CTR", "RPM", "Conversion", "Conversion %", "CPA", "Revenue"]} data={apiKeyData} linkColumn="API Key" linkPath="/dashboard/publishers/syndicates" />
        </TabsContent>

        {/* Parsing Table */}
        <TabsContent value="parsing" className="pt-2">
          <ReportTable
            columns={["Feed", "Partner", "Jobs", "Last Updated", "Next Run", "Cycles", "Last Status", "Indexing Speed", "Total Time Indexing"]}
            data={parsingData}
            linkColumns={{
              Feed: { path: "/dashboard/ads/xml" },
              Partner: { path: "/dashboard/partners", suffix: "/xml" },
            }}
            showTotals={false}
          />
        </TabsContent>

        {/* Campaigns Table */}
        <TabsContent value="campaigns" className="pt-2">
          <ReportTable
            columns={["Date", "Feed", "Partner", "Clicks", "Avg. CPC", "CTR", "RPM", "Conversion", "Conversion %", "CPA", "Revenue"]}
            data={campaignData}
            linkColumns={{
              Feed: { path: "/dashboard/ads/xml" },
              Partner: { path: "/dashboard/partners", suffix: "/xml" },
            }}
          />
        </TabsContent>

        {/* Categories Table */}
        <TabsContent value="categories" className="pt-2">
          <ReportTable columns={["Date", "Category", "Impressions", "Clicks", "Min. CPC", "Avg. CPC", "Max. CPC", "CTR", "RPM", "Conversion", "Conversion %", "CPA", "Revenue"]} data={categoryData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

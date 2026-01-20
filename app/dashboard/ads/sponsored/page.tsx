"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ReportsSection, { reportTypes } from "@/components/blocks/reports/ads-reports";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdsTable } from "@/components/blocks/data-tables/ads-table";
import { AdsStats } from "@/components/blocks/stats/ads-stats";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Plus } from "lucide-react";

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

const hourlyConfig = {
  today_revenue: { color: "#F96E5B", label: "Today Revenue" },
  today_clicks: { color: "#FFE2AF", label: "Today Clicks" },
  yesterday_revenue: { color: "#79C9C5", label: "Yesterday Revenue" },
  yesterday_clicks: { color: "#3F9AAE", label: "Yesterday Clicks" },
  sdlw_revenue: { color: "#BDE8F5", label: "SDLW Revenue" },
  sdlw_clicks: { color: "#4988C4", label: "SDLW Clicks" },
};

const monthlyConfig = {
  current: { color: "var(--chart-2)", label: "This Month" },
  last: { color: "var(--chart-3)", label: "Last Month" },
};

const mockPartners = [
  { id: 1, name: "Partner 1" },
  { id: 2, name: "Partner 2" },
  { id: 3, name: "Partner 3" },
  { id: 4, name: "Partner 4" },
  { id: 5, name: "Partner 5" },
];

export default function Page() {
  const router = useRouter();
  const [isCreateAdOpen, setIsCreateAdOpen] = useState(false);
  const [createAdForm, setCreateAdForm] = useState({
    name: "",
    partner: "",
  });
  const [createAdErrors, setCreateAdErrors] = useState<Record<string, string>>({});

  const hourlyData = useMemo(() => data(), []);
  const monthlyData = useMemo(() => dataTwoMonth(), []);

  const handleCreateAdSubmit = async () => {
    const errors: Record<string, string> = {};
    if (!createAdForm.name || createAdForm.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }
    if (!createAdForm.partner) {
      errors.partner = "Partner is required";
    }
    setCreateAdErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }
    const newAdId = Date.now();
    router.push(`/dashboard/ads/sponsored/${newAdId}`);
  };

  return (
    <div>
      <div>
        <div className="mb-4 border-b pb-2 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Ads</h2>
            <p className="text-sm text-muted-foreground">Manage all of the sponsored ads</p>
          </div>
          <Sheet open={isCreateAdOpen} onOpenChange={setIsCreateAdOpen}>
            <SheetTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Ad
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-96">
              <SheetHeader>
                <SheetTitle>Create New Ad</SheetTitle>
                <SheetDescription>Fill in the details to create a new sponsored ad.</SheetDescription>
              </SheetHeader>
              <div className="py-4 px-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ad-name">Name *</Label>
                  <Input id="ad-name" placeholder="Enter ad name" value={createAdForm.name} onChange={(e) => setCreateAdForm({ ...createAdForm, name: e.target.value })} />
                  {createAdErrors.name && <p className="text-sm text-destructive">{createAdErrors.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ad-partner">Partner *</Label>
                  <Select value={createAdForm.partner} onValueChange={(value) => setCreateAdForm({ ...createAdForm, partner: value })}>
                    <SelectTrigger id="ad-partner">
                      <SelectValue placeholder="Select a partner" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockPartners.map((partner) => (
                        <SelectItem key={partner.id} value={partner.id.toString()}>
                          {partner.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {createAdErrors.partner && <p className="text-sm text-destructive">{createAdErrors.partner}</p>}
                </div>
              </div>
              <SheetFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreateAdOpen(false);
                    setCreateAdForm({ name: "", partner: "" });
                    setCreateAdErrors({});
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateAdSubmit}>Create Ad</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <AdsStats hourlyData={hourlyData} monthlyData={monthlyData} hourlyConfig={hourlyConfig} monthlyConfig={monthlyConfig} />

      <Tabs defaultValue="reports" className="mt-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="ads">Ads</TabsTrigger>
        </TabsList>

        <TabsContent value="reports">
          <ReportsSection reports={[reportTypes.sources, reportTypes.placements, reportTypes.partners, reportTypes.parsing, reportTypes.mediums, reportTypes.keywords, reportTypes.companies, reportTypes.apikeys]} />
        </TabsContent>

        <TabsContent value="ads">
          <AdsTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}

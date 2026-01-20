"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReportsSection, { reportTypes } from "@/components/blocks/reports/ads-reports";
import { CampaignsTable } from "@/components/blocks/data-tables/campaigns-table";

interface PartnerCampaignProps {
  partner_id: string;
}

export default function PartnerCampaignPage({ partner_id }: PartnerCampaignProps) {
  return (
    <>
      <Tabs defaultValue="reports" className="mt-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="ads">Publisher</TabsTrigger>
        </TabsList>

        <TabsContent value="reports">
          <ReportsSection reports={[reportTypes.partners, reportTypes.campaigns]} />
        </TabsContent>

        <TabsContent value="ads">
          <CampaignsTable partner_id={partner_id} />
        </TabsContent>
      </Tabs>
    </>
  );
}

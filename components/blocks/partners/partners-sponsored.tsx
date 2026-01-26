'use client'

import { AdsTable } from '@/components/blocks/data-tables/ads-table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ReportsSection, { reportTypes } from '@/components/blocks/reports/ads-reports'

interface PartnerSponsoredProps {
  partner_id: string;
}

export default function PartnerSponsoredPage({ partner_id }: PartnerSponsoredProps) {
  return (
    <>
      <Tabs defaultValue="reports" className="mt-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="ads">Ads</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="pt-2">
          <ReportsSection reports={[reportTypes.sources, reportTypes.placements, reportTypes.partners, reportTypes.parsing, reportTypes.mediums, reportTypes.keywords, reportTypes.companies, reportTypes.apikeys]} />
        </TabsContent>

        <TabsContent value="ads" className="pt-2">
          <AdsTable partner_id={partner_id} />
        </TabsContent>
      </Tabs>
    </>
  )
}

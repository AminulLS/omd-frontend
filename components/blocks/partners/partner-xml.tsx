'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ReportsSection, { reportTypes } from '@/components/blocks/reports/ads-reports'
import { XmlsTable } from '@/components/blocks/data-tables/xml-table'

interface PartnerXMLProps {
  partner_id: string;
}

export default function PartnerXMLPage({ partner_id }: PartnerXMLProps) {
  return (
    <>
      <Tabs defaultValue="reports" className="mt-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="ads">XML</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="pt-2">
          <ReportsSection reports={[reportTypes.partners, reportTypes.parsing, reportTypes.campaigns, reportTypes.categories]} />
        </TabsContent>

        <TabsContent value="ads" className="pt-2">
          <XmlsTable partner_id={partner_id} />
        </TabsContent>
      </Tabs>
    </>
  )
}

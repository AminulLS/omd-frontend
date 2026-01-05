import { redirect } from 'next/navigation'
import { partnersData } from '../constants'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function PartnerDetailsPage({ params }: PageProps) {
  // Always redirect to the first partner's first product
  const { id } = await params
  const firstPartner = partnersData[id]

  if (!firstPartner || firstPartner.products.length === 0) {
    redirect('/dashboard/partners')
  }

  redirect(`/dashboard/partners/${id}/${firstPartner.products[0]}`)
}
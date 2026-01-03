import { redirect } from 'next/navigation'
import { partnersData } from '../constants'

export default async function PartnerDetailsPage() {
  // Always redirect to the first partner's first product
  const firstPartner = partnersData['1']

  if (!firstPartner || firstPartner.products.length === 0) {
    redirect('/dashboard/partners')
  }

  redirect(`/dashboard/partners/1/${firstPartner.products[0]}`)
}
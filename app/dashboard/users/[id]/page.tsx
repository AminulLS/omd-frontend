import { redirect } from 'next/navigation'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function UserDetailsPage({ params }: PageProps) {
  const { id } = await params
  // Redirect to the profile tab
  redirect(`/dashboard/users/${id}/profile`)
}

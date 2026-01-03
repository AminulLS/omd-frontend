"use client"

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { TabNavigation } from '@/components/dashboard/tab-navigation'
import { HandshakeIcon, UserIcon, CalendarIcon } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getUserById } from '@/lib/api/users-api'
import { User, PartnerAssignment } from '@/lib/types/users'

const tabs = [
  { value: 'profile', label: 'Profile', href: '/dashboard/users/[id]/profile' },
  { value: 'roles', label: 'Roles', href: '/dashboard/users/[id]/roles' },
  { value: 'partners', label: 'Partners', href: '/dashboard/users/[id]/partners' },
  { value: 'activity', label: 'Activity', href: '/dashboard/users/[id]/activity' },
]

const roleVariantMap: Record<string, "default" | "secondary" | "outline"> = {
  main_user: 'default',
  manager: 'secondary',
}

const roleLabelMap: Record<string, string> = {
  main_user: 'Main User',
  manager: 'Manager',
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function UserPartnersPage() {
  const params = useParams()
  const userId = params.id as string
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      const response = await getUserById(userId)
      if (response.success && response.data) {
        setUser(response.data[0])
      }
      setIsLoading(false)
    }
    loadUser()
  }, [userId])

  if (isLoading) {
    return <div className="p-6">Loading...</div>
  }

  if (!user) {
    return <div className="p-6">User not found</div>
  }

  // Update tabs with actual ID
  const updatedTabs = tabs.map(tab => ({
    ...tab,
    href: tab.href.replace('[id]', userId),
  }))

  return (
    <div className="flex flex-col gap-y-4">
      <TabNavigation tabs={updatedTabs} />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <HandshakeIcon className="size-5" />
                Partner Assignments
              </CardTitle>
              <CardDescription>
                Partners this user is associated with and their role in each
              </CardDescription>
            </div>
            <Button size="sm">
              Assign Partner
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {user.partners.length === 0 ? (
            <div className="text-center py-12">
              <HandshakeIcon className="size-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">This user is not assigned to any partners yet.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Partner</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {user.partners.map((assignment) => (
                  <PartnerRow key={assignment.partnerId} assignment={assignment} />
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function PartnerRow({ assignment }: { assignment: PartnerAssignment }) {
  return (
    <TableRow>
      <TableCell>
        <Link
          href={`/dashboard/partners/${assignment.partnerId}`}
          className="font-medium hover:underline flex items-center gap-2"
        >
          <HandshakeIcon className="size-4 text-muted-foreground" />
          {assignment.partnerName}
        </Link>
      </TableCell>
      <TableCell>
        <Badge variant={roleVariantMap[assignment.role]} className="flex items-center gap-1 w-fit">
          <UserIcon className="size-3" />
          {roleLabelMap[assignment.role]}
        </Badge>
      </TableCell>
      <TableCell>
        <Button variant="ghost" size="sm">
          Remove
        </Button>
      </TableCell>
    </TableRow>
  )
}

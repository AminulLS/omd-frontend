import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ProductTypeNotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <h2 className="text-2xl font-semibold">Invalid Product Type</h2>
      <p className="text-muted-foreground">The product type you're looking for doesn't exist for this partner.</p>
      <Button asChild variant="outline">
        <Link href="/dashboard/partners">
          <ArrowLeft className="mr-2 size-4" />
          Back to Partners
        </Link>
      </Button>
    </div>
  )
}

"use client";
import { ListiclesTable } from "@/components/blocks/data-tables/listicles-table";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export default function ListiclesPage() {
  return (
    <div className="flex flex-col gap-y-4">
      <div>
        <div className="flex items-center justify-between mb-4 border-b pb-2">
          <div>
            <h2 className="text-lg font-semibold">Listicles</h2>
            <p className="text-sm text-muted-foreground">Manage listicle content and ads</p>
          </div>
          <Link href="/dashboard/ads/listicles/create">
            <Button size="sm">
              <PlusIcon className="size-4 mr-2" />
              Add Listicle
            </Button>
          </Link>
        </div>
        <ListiclesTable />
      </div>
    </div>
  );
}

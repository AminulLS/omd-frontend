"use client";

import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface ListicleEditHeaderProps {
  isCreate?: boolean;
}

export function ListicleEditHeader({ isCreate = false }: ListicleEditHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between border-b pb-2">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon-sm" onClick={() => router.push("/dashboard/ads/listicles")}>
          <ArrowLeftIcon className="size-4" />
        </Button>
        <div>
          <h2 className="text-lg font-semibold">{isCreate ? "Create Listicle" : "Edit Listicle"}</h2>
          <p className="text-sm text-muted-foreground">{isCreate ? "Fill in the details to create a new listicle" : "Update listicle information and content"}</p>
        </div>
      </div>
    </div>
  );
}

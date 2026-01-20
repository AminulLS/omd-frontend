"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { SyndicateForm } from "./syndicate-form";
import type { Syndicate, SyndicateFormData } from "@/lib/types/syndicates";

interface SyndicateSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingSyndicate: Syndicate | null;
  onSubmit: (data: SyndicateFormData) => void;
  isSubmitting?: boolean;
  partners?: Array<{ id: string; name: string }>;
}

export function SyndicateSheet({ open, onOpenChange, editingSyndicate, onSubmit, isSubmitting, partners }: SyndicateSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{editingSyndicate ? "Edit Syndicate" : "Add New Syndicate"}</SheetTitle>
          <SheetDescription>{editingSyndicate ? "Update syndicate information below." : "Fill in the details to add a new syndicate."}</SheetDescription>
        </SheetHeader>

        <div className="mt-4 px-4">
          <SyndicateForm defaultValues={editingSyndicate || undefined} onSubmit={onSubmit} isSubmitting={isSubmitting} partners={partners} />
        </div>

        <SheetFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" form="syndicate-form" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : editingSyndicate ? "Update Syndicate" : "Create Syndicate"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

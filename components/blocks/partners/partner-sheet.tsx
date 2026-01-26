"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { PartnerForm } from "./partner-form";
import type { Partner, PartnerFormData } from "@/lib/types/partners";

interface PartnerSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingPartner: Partner | null;
  onSubmit: (data: PartnerFormData) => void;
  isSubmitting?: boolean;
}

export function PartnerSheet({ open, onOpenChange, editingPartner, onSubmit, isSubmitting }: PartnerSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{editingPartner ? "Edit Partner" : "Add New Partner"}</SheetTitle>
          <SheetDescription>{editingPartner ? "Update partner information below." : "Fill in the details to add a new partner."}</SheetDescription>
        </SheetHeader>

        <div className="mt-4 px-4">
          <PartnerForm defaultValues={editingPartner || undefined} onSubmit={onSubmit} isSubmitting={isSubmitting} />
        </div>

        <SheetFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" form="partner-form" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : editingPartner ? "Update Partner" : "Create Partner"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

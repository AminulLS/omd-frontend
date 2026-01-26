"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CampaignForm } from "./campaign-form";
import type { Campaign, CampaignFormData } from "@/lib/types/campaigns";

interface CampaignSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingCampaign: Campaign | null;
  onSubmit: (data: CampaignFormData) => void;
  isSubmitting?: boolean;
  partners?: Array<{ id: string; name: string }>;
}

export function CampaignSheet({ open, onOpenChange, editingCampaign, onSubmit, isSubmitting, partners }: CampaignSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{editingCampaign ? "Edit Campaign" : "Add New Campaign"}</SheetTitle>
          <SheetDescription>{editingCampaign ? "Update campaign information below." : "Fill in the details to add a new campaign."}</SheetDescription>
        </SheetHeader>

        <div className="mt-4 px-4">
          <CampaignForm defaultValues={editingCampaign || undefined} onSubmit={onSubmit} isSubmitting={isSubmitting} partners={partners} />
        </div>

        <SheetFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" form="campaign-form" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : editingCampaign ? "Update Campaign" : "Create Campaign"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

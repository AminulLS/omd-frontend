"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CampaignsHeader } from "@/components/blocks/campaign/campaign-header";
import { CampaignsTable } from "@/components/blocks/data-tables/campaigns-table";
import { CampaignSheet } from "@/components/blocks/campaign/campaign-sheet";

import { createCampaign, updateCampaign, deleteCampaign } from "@/lib/services/campaigns-api";
import { getAllPartners } from "@/lib/services/partners-api";
import type { Campaign, CampaignFormData } from "@/lib/types/campaigns";

export default function CampaignsPage() {
  const queryClient = useQueryClient();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

  const { data: partnersData } = useQuery({
    queryKey: ["partners"],
    queryFn: () => getAllPartners({ per_page: 1000 }),
  });

  const partners = partnersData?.data.map((p) => ({ id: p.id, name: p.name })) || [];

  const createMutation = useMutation({
    mutationFn: createCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      toast.success("Campaign created successfully");
      setSheetOpen(false);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create campaign");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CampaignFormData }) => updateCampaign(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      toast.success("Campaign updated successfully");
      setSheetOpen(false);
      setEditingCampaign(null);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update campaign");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      toast.success("Campaign deleted successfully");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete campaign");
    },
  });

  const handleAdd = () => {
    setEditingCampaign(null);
    setSheetOpen(true);
  };

  const handleEdit = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setSheetOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleSubmit = (data: CampaignFormData) => {
    if (editingCampaign) {
      updateMutation.mutate({ id: editingCampaign.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleSheetClose = () => {
    setSheetOpen(false);
    setEditingCampaign(null);
  };

  return (
    <div className="flex flex-col gap-y-4">
      <CampaignsHeader onAddClick={handleAdd} />
      <CampaignsTable onEdit={handleEdit} onDelete={handleDelete} />
      <CampaignSheet open={sheetOpen} onOpenChange={handleSheetClose} editingCampaign={editingCampaign} onSubmit={handleSubmit} isSubmitting={createMutation.isPending || updateMutation.isPending} partners={partners} />
    </div>
  );
}

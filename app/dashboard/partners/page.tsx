"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PartnersHeader } from "@/components/blocks/partners/partners-header";
import { PartnersTable } from "@/components/blocks/data-tables/partners-table";
import { PartnerSheet } from "@/components/blocks/partners/partner-sheet";

import { createPartner, updatePartner, deletePartner } from "@/lib/services/partners-api";
import type { Partner, PartnerFormData } from "@/lib/types/partners";

export default function PartnersPage() {
  const queryClient = useQueryClient();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);

  const createMutation = useMutation({
    mutationFn: createPartner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partners"] });
      toast.success("Partner created successfully");
      setSheetOpen(false);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create partner");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: PartnerFormData }) => updatePartner(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partners"] });
      toast.success("Partner updated successfully");
      setSheetOpen(false);
      setEditingPartner(null);
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update partner");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePartner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partners"] });
      toast.success("Partner deleted successfully");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete partner");
    },
  });

  const handleAdd = () => {
    setEditingPartner(null);
    setSheetOpen(true);
  };

  const handleEdit = (partner: Partner) => {
    setEditingPartner(partner);
    setSheetOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleSubmit = (data: PartnerFormData) => {
    if (editingPartner) {
      updateMutation.mutate({ id: editingPartner.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleSheetClose = () => {
    setSheetOpen(false);
    setEditingPartner(null);
  };

  return (
    <div className="flex flex-col gap-y-4">
      <PartnersHeader onAddClick={handleAdd} />
      <PartnersTable onEdit={handleEdit} onDelete={handleDelete} />
      <PartnerSheet open={sheetOpen} onOpenChange={handleSheetClose} editingPartner={editingPartner} onSubmit={handleSubmit} isSubmitting={createMutation.isPending || updateMutation.isPending} />
    </div>
  );
}

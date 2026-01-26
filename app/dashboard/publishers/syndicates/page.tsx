"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { SyndicatesHeader } from "@/components/blocks/syndicate/syndicate-header";
import { SyndicatesTable } from "@/components/blocks/data-tables/syndicate-table";
import { SyndicateSheet } from "@/components/blocks/syndicate/syndicate-sheet";

import { createSyndicate, updateSyndicate, deleteSyndicate } from "@/lib/services/syndicates-api";
import { getAllPartners } from "@/lib/services/partners-api";
import type { Syndicate, SyndicateFormData } from "@/lib/types/syndicates";

export default function SyndicatesPage() {
  const queryClient = useQueryClient();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingSyndicate, setEditingSyndicate] = useState<Syndicate | null>(null);

  // Fetch partners for the dropdown
  const { data: partnersData } = useQuery({
    queryKey: ["partners"],
    queryFn: () => getAllPartners({ per_page: 1000 }),
  });

  const partners = partnersData?.data.map((p) => ({ id: p.id, name: p.name })) || [];

  const createMutation = useMutation({
    mutationFn: createSyndicate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["syndicates"] });
      toast.success("Syndicate created successfully");
      setSheetOpen(false);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create syndicate");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: SyndicateFormData }) => updateSyndicate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["syndicates"] });
      toast.success("Syndicate updated successfully");
      setSheetOpen(false);
      setEditingSyndicate(null);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update syndicate");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSyndicate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["syndicates"] });
      toast.success("Syndicate deleted successfully");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete syndicate");
    },
  });

  const handleAdd = () => {
    setEditingSyndicate(null);
    setSheetOpen(true);
  };

  const handleEdit = (syndicate: Syndicate) => {
    setEditingSyndicate(syndicate);
    setSheetOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleSubmit = (data: SyndicateFormData) => {
    if (editingSyndicate) {
      updateMutation.mutate({ id: editingSyndicate.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleSheetClose = () => {
    setSheetOpen(false);
    setEditingSyndicate(null);
  };

  return (
    <div className="flex flex-col gap-y-4">
      <SyndicatesHeader onAddClick={handleAdd} />
      <SyndicatesTable onEdit={handleEdit} onDelete={handleDelete} />
      <SyndicateSheet open={sheetOpen} onOpenChange={handleSheetClose} editingSyndicate={editingSyndicate} onSubmit={handleSubmit} isSubmitting={createMutation.isPending || updateMutation.isPending} partners={partners} />
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Settings, Calendar, Filter, FileText } from "lucide-react";

import { getAdById, updateAd } from "@/lib/services/ad-api";
import { adFormSchema } from "@/lib/schemas/ad-schema";
import type { AdFormData } from "@/lib/types/ads";

import { AdDetailsHeader } from "@/components/blocks/ads/ad-details-header";
import { AdStatsTab } from "@/components/blocks/ads/stats-tab";
import { AdSettingsTab } from "@/components/blocks/ads/ad-settings";
import { AdSchedulesTab } from "@/components/blocks/ads/ad-schedule";
import { AdFiltersTab } from "@/components/blocks/ads/ad-filter";
import { AdAuditLogsTab } from "@/components/blocks/ads/audit-tab";
import { AdPreviewSidebar } from "@/components/blocks/ads/ad-preview";
export default function AdDetailsPage() {
  const params = useParams();
  const queryClient = useQueryClient();
  const adId = params.id as string;

  const {
    data: ad,
    isLoading: isLoadingAd,
    isError: isAdError,
  } = useQuery({
    queryKey: ["ad", adId],
    queryFn: () => getAdById(adId),
    retry: 1,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, dirtyFields },
    setValue,
    watch,
    reset,
    control,
  } = useForm<AdFormData>({
    resolver: zodResolver(adFormSchema),
    defaultValues: {
      partner_id: "",
      copy: "",
      nickname: "",
      title: "",
      public_nickname: "",
      image_url: null,
      image_priority: "any",
      placement: "path",
      pricing_type: "cpc",
      pricing_type_value: null,
      original_url: "",
      append_reg_key: null,
      append_reg_key_ssl: null,
      status: "pending",
      gtm_tracking: "",
      conversion_window: null,
      newalg: null,
      notes: null,
      category: "",
      country: "US",
      boards: [],
      filters: [],
      meta: {},
      schedules: {},
      prepop: null,
      target_cpa: null,
      org_url: "",
      duplicate_window: null,
      no_click_tcpa_alg: null,
    },
  });
  useEffect(() => {
    if (ad) {
      reset({
        partner_id: ad.partner_id,
        copy: ad.copy,
        nickname: ad.nickname,
        title: ad.title,
        public_nickname: ad.public_nickname,
        image_url: ad.image_url,
        image_priority: ad.image_priority,
        placement: ad.placement,
        pricing_type: ad.pricing_type,
        pricing_type_value: String(ad.pricing_type_value),
        original_url: ad.original_url,
        append_reg_key: ad.append_reg_ssl || null,
        append_reg_key_ssl: ad.append_reg_key_ssl,
        status: ad.status,
        gtm_tracking: ad.gtm_tracking,
        conversion_window: ad.conversion_window ? String(ad.conversion_window) : null,
        newalg: ad.newalg,
        notes: ad.notes,
        category: ad.category,
        country: ad.country,
        boards: ad.boards,
        filters: ad.filters,
        meta: ad.meta || {},
        schedules: ad.schedules,
        duplicate_window: null,
        no_click_tcpa_alg: null,
      });
    }
  }, [ad, reset]);

  const updateMutation = useMutation({
    mutationFn: (data: AdFormData) => updateAd(adId, data),
    onSuccess: () => {
      toast.success("Ad updated successfully");
      queryClient.invalidateQueries({ queryKey: ["ads"] });
      queryClient.invalidateQueries({ queryKey: ["ad", adId] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update ad");
    },
  });

  const onSubmit = (data: AdFormData) => {
    updateMutation.mutate({ ...data, pricing_type_value: String(data?.pricing_type_value || "") });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onError = (errors: any) => {
    console.log("Please fix validation errors before saving", errors);
    toast.error("Please fix validation errors before saving");
  };

  const isDirty = Object.keys(dirtyFields).length > 0;

  const settingsDirtyFields = [
    "status",
    "gtm_tracking",
    "category",
    "nickname",
    "public_nickname",
    "notes",
    "pricing_type",
    "pricing_type_value",
    "duplicate_window",
    "no_click_tcpa_alg",
    "title",
    "copy",
    "meta",
    "image_url",
    "image_priority",
    "original_url",
    "boards",
    "country",
    "placement",
    "append_reg_key",
    "append_reg_key_ssl",
  ];

  const isSectionDirty = (fields: string[]): boolean => {
    return fields.some((field) => {
      const parts = field.split(".");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let current: any = dirtyFields;
      for (const part of parts) {
        if (!current) return false;
        current = current[part];
      }
      return !!current;
    });
  };

  const isSettingsDirty = isSectionDirty(settingsDirtyFields);
  const isSchedulesDirty = isSectionDirty(["schedules"]);
  const isFiltersDirty = isSectionDirty(["filters"]);

  if (isLoadingAd) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading ad details...</div>
      </div>
    );
  }

  if (isAdError || !ad) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-destructive mb-4">Failed to load ad</p>
          <Link href="/dashboard/ads/sponsored">
            <Button variant="outline">Back to Ads</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="flex flex-col gap-y-4">
      <AdDetailsHeader adName={ad.title} uniqueId={ad.id} partner={ad.partner_id} status={ad.status} isDirty={isDirty} isSaving={isSubmitting || updateMutation.isPending} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="stats" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="stats">
                <BarChart3 className="h-4 w-4 mr-2" />
                Stats
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings className="h-4 w-4 mr-2" />
                Settings
                {isSettingsDirty && (
                  <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                    •
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="schedules">
                <Calendar className="h-4 w-4 mr-2" />
                Schedules
                {isSchedulesDirty && (
                  <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                    •
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="filters">
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {isFiltersDirty && (
                  <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                    •
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="audit-logs">
                <FileText className="h-4 w-4 mr-2" />
                Audit Logs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="stats">
              <AdStatsTab />
            </TabsContent>

            <TabsContent value="settings">
              <AdSettingsTab register={register} errors={errors} watch={watch} setValue={setValue} />
            </TabsContent>

            <TabsContent value="schedules">
              <AdSchedulesTab watch={watch} setValue={setValue} />
            </TabsContent>

            <TabsContent value="filters">
              <AdFiltersTab watch={watch} setValue={setValue} control={control} />
            </TabsContent>

            <TabsContent value="audit-logs">
              <AdAuditLogsTab />
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-1">
          <AdPreviewSidebar watch={watch} createdAt={ad.created_at} updatedAt={ad.updated_at} />
        </div>
      </div>
    </form>
  );
}

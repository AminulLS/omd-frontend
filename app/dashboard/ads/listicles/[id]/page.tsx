"use client";

import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ListicleEditHeader } from "@/components/blocks/listicles/header";
import { ListicleGeneralCard } from "@/components/blocks/listicles/general-card";
import { ListicleImageCard } from "@/components/blocks/listicles/image-section";
import { ListicleContentCard } from "@/components/blocks/listicles/listicles-ads";

import { getListicleById, updateListicle } from "@/lib/services/listicles-api";
import { listicleFormSchema } from "@/lib/schemas/listicle-schema";
import { isListicleWithAds } from "@/lib/types/listicles";
import type { ListicleFormData } from "@/lib/types/listicles";

export default function EditListiclePage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const listicleId = params.id as string;

  const {
    data: listicle,
    isLoading: isLoadingListicle,
    isError: isListicleError,
  } = useQuery({
    queryKey: ["listicle", listicleId],
    queryFn: () => getListicleById(listicleId, { with: "contents,blurs" }),
    retry: 1,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<ListicleFormData>({
    resolver: zodResolver(listicleFormSchema),
    defaultValues: {
      contents: [],
      blurs: [],
      copy: "",
      design_type: "style1",
      image: "",
      image_alt: null,
      image_caption: null,
      slug: "",
      title: "",
    },
  });

  useEffect(() => {
    if (listicle && isListicleWithAds(listicle)) {
      reset({
        contents: listicle.contents?.map((ad) => ad.id) || [],
        blurs: listicle.blurs?.map((ad) => ad.id) || [],
        copy: listicle.copy,
        design_type: listicle.design_type,
        image: listicle.image || "",
        image_alt: listicle.image_alt,
        image_caption: listicle.image_caption,
        slug: listicle.slug,
        title: listicle.title,
      });
    }
  }, [listicle, reset]);

  const updateMutation = useMutation({
    mutationFn: (data: ListicleFormData) => updateListicle(listicleId, data),
    onSuccess: () => {
      toast.success("Listicle updated successfully");
      queryClient.invalidateQueries({ queryKey: ["listicles"] });
      queryClient.invalidateQueries({ queryKey: ["listicle", listicleId] });
      router.push("/dashboard/ads/listicles");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update listicle");
    },
  });

  const onSubmit = (data: ListicleFormData) => {
    updateMutation.mutate(data);
  };

  if (isLoadingListicle) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading listicle...</div>
      </div>
    );
  }

  if (isListicleError || !listicle) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-destructive mb-4">Failed to load listicle</p>
          <Link href="/dashboard/ads/listicles">
            <Button variant="outline">Back to Listicles</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
      <ListicleEditHeader />

      <div className="grid grid-cols-6 gap-4 items-stretch">
        <div className="col-span-4 h-full flex">
          <ListicleGeneralCard register={register} errors={errors} watch={watch} setValue={setValue} />
        </div>

        <div className="col-span-2 h-full flex">
          <ListicleImageCard register={register} errors={errors} watch={watch} />
        </div>

        <div className="col-span-6">
          <ListicleContentCard watch={watch} setValue={setValue} />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Link href="/dashboard/ads/listicles">
          <Button variant="outline" type="button" disabled={isSubmitting || updateMutation.isPending}>
            Cancel
          </Button>
        </Link>
        <Button type="submit" disabled={isSubmitting || updateMutation.isPending}>
          {isSubmitting || updateMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}

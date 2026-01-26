"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ListicleEditHeader } from "@/components/blocks/listicles/header";
import { ListicleGeneralCard } from "@/components/blocks/listicles/general-card";
import { ListicleImageCard } from "@/components/blocks/listicles/image-section";
import { ListicleContentCard } from "@/components/blocks/listicles/listicles-ads";

import { createListicle } from "@/lib/services/listicles-api";
import { listicleFormSchema } from "@/lib/schemas/listicle-schema";
import type { ListicleFormData } from "@/lib/types/listicles";

export default function CreateListiclePage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
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

  const createMutation = useMutation({
    mutationFn: createListicle,
    onSuccess: () => {
      toast.success("Listicle created successfully");
      queryClient.invalidateQueries({ queryKey: ["listicles"] });
      router.push("/dashboard/ads/listicles");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create listicle");
    },
  });

  const onSubmit = (data: ListicleFormData) => {
    createMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
      <ListicleEditHeader isCreate />

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
          <Button variant="outline" type="button" disabled={isSubmitting || createMutation.isPending}>
            Cancel
          </Button>
        </Link>
        <Button type="submit" disabled={isSubmitting || createMutation.isPending}>
          {isSubmitting || createMutation.isPending ? "Creating..." : "Create Listicle"}
        </Button>
      </div>
    </form>
  );
}

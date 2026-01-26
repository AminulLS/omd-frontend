"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ArrowLeft, EditIcon } from "lucide-react";
import Link from "next/link";
import { useState, use } from "react";
import { TabNavigation } from "@/components/dashboard/tab-navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPartnerById, updatePartner } from "@/lib/services/partners-api";
import type { PartnerFormData, PartnerStatus, PartnerType, ProductType, User } from "@/lib/types/partners";
import { toast } from "sonner";
import { PartnerForm } from "@/components/blocks/partners/partner-form";
import PartnersStats from "@/components/blocks/stats/partners-stats";
import PartnerSponsoredPage from "@/components/blocks/partners/partners-sponsored";
import PartnerXMLPage from "@/components/blocks/partners/partner-xml";
import PartnerSyndicatePage from "@/components/blocks/partners/partners-syndicate";
import PartnerCampaignPage from "@/components/blocks/partners/partners-campaigns";

const statusVariantMap: Record<PartnerStatus, "default" | "secondary" | "destructive" | "outline"> = {
  active: "default",
  inactive: "secondary",
  pending: "outline",
  suspended: "destructive",
};

const typeVariantMap: Record<PartnerType, "default" | "secondary" | "outline"> = {
  internal: "secondary",
  external: "outline",
};

const productLabelMap: Record<ProductType, string> = {
  sponsored: "Sponsored",
  xml: "XML",
  publisher: "Publisher",
  syndication: "Syndication",
};

const typeLabelMap: Record<PartnerType, string> = {
  internal: "Internal",
  external: "External",
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

interface PageProps {
  params: Promise<{
    id: string;
    productType: ProductType;
  }>;
}

export default function PartnerProductPage({ params }: PageProps) {
  const { id, productType } = use(params);
  const queryClient = useQueryClient();

  const [sheetOpen, setSheetOpen] = useState(false);

  const {
    data: partner,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["partner", id],
    queryFn: () => getPartnerById(id),
  });

  const updateMutation = useMutation({
    mutationFn: (data: PartnerFormData) => updatePartner(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partner", id] });
      queryClient.invalidateQueries({ queryKey: ["partners"] });
      toast.success("Partner updated successfully");
      setSheetOpen(false);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update partner");
    },
  });

  const handleEdit = () => {
    setSheetOpen(true);
  };

  const handleSubmit = (data: PartnerFormData) => {
    updateMutation.mutate(data);
  };

  const getMainUser = (users?: User[]) => {
    return users?.find((u) => u.role === "main_user");
  };

  const getManagerCount = (users?: User[]) => {
    return users?.filter((u) => u.role === "manager").length || 0;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading partner details...</p>
        </div>
      </div>
    );
  }

  if (error || !partner) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="text-6xl">😕</div>
          <h3 className="text-lg font-semibold">Partner Not Found</h3>
          <p className="text-sm text-muted-foreground">The partner you&apos;re looking for doesn&apos;t exist or has been deleted.</p>
          <Button asChild>
            <Link href="/dashboard/partners">Back to Partners</Link>
          </Button>
        </div>
      </div>
    );
  }

  const mockProducts: ProductType[] = ["sponsored", "xml", "publisher", "syndication"];
  const isValidProduct = mockProducts.includes(productType);

  const tabs = mockProducts.map((product) => ({
    value: product,
    label: productLabelMap[product],
    href: `/dashboard/partners/${id}/${product}`,
  }));

  return (
    <div className="flex flex-col gap-y-4">
      <div className="pb-2 space-y-3.5 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="icon">
              <Link href={`/dashboard/partners`}>
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold">{partner.name}</h2>
                <Badge variant={typeVariantMap[partner.type]}>{typeLabelMap[partner.type]}</Badge>
                <Badge variant={statusVariantMap[partner.status]}>{partner.status.charAt(0).toUpperCase() + partner.status.slice(1)}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {partner.email} • {partner.phone} •{" "}
                {partner.website && (
                  <>
                    <a href={partner.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {partner.website}
                    </a>{" "}
                    •
                  </>
                )}
                {partner.users && partner.users.length > 0 ? (
                  <span>
                    {getMainUser(partner.users)?.name}
                    {getManagerCount(partner.users) > 0 && ` +${getManagerCount(partner.users)} manager${getManagerCount(partner.users) > 1 ? "s" : ""}`}
                  </span>
                ) : (
                  <span>No users assigned</span>
                )}{" "}
                • Created {formatDate(partner.created_at)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-2 flex-wrap">
              {partner.products && partner.products.length > 0
                ? partner.products.map((product) => (
                    <Badge key={product} variant="outline">
                      {productLabelMap[product]}
                    </Badge>
                  ))
                : mockProducts.map((product) => (
                    <Badge key={product} variant="outline">
                      {productLabelMap[product]}
                    </Badge>
                  ))}
            </div>
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button size="sm" onClick={handleEdit}>
                  <EditIcon className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Edit Partner</SheetTitle>
                  <SheetDescription>Update partner information below.</SheetDescription>
                </SheetHeader>

                <div className="mt-4 px-4">
                  <PartnerForm defaultValues={partner} onSubmit={handleSubmit} isSubmitting={updateMutation.isPending} />
                </div>

                <SheetFooter className="mt-4">
                  <Button variant="outline" onClick={() => setSheetOpen(false)} disabled={updateMutation.isPending}>
                    Cancel
                  </Button>
                  <Button type="submit" form="partner-form" disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? "Updating..." : "Update Partner"}
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <TabNavigation tabs={tabs} />

      {isValidProduct ? (
        <div className="flex flex-col gap-12 mb-4">
          <PartnersStats productType={productType} />
          {productType === "sponsored" && <PartnerSponsoredPage partner_id={id} />}
          {productType === "xml" && <PartnerXMLPage partner_id={id} />}
          {productType === "syndication" && <PartnerSyndicatePage partner_id={id} />}
          {productType === "publisher" && <PartnerCampaignPage partner_id={id} />}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center text-center space-y-3">
              <div className="text-6xl">🔍</div>
              <h3 className="text-lg font-semibold">Product Not Found</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                The product <span className="font-mono font-medium">{productType}</span> is not available for <span className="font-medium">{partner.name}</span>.
                <br />
                <br />
                Available products:
              </p>
              <div className="flex gap-2 flex-wrap justify-center">
                {mockProducts.map((product) => (
                  <Button key={product} asChild variant="outline" size="sm">
                    <Link href={`/dashboard/partners/${id}/${product}`}>{productLabelMap[product]}</Link>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

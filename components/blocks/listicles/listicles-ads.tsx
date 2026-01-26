"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { UseFormWatch, UseFormSetValue } from "react-hook-form";
import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { EyeIcon, TrashIcon } from "lucide-react";

import { getAllAds } from "@/lib/services/ad-api";
import type { ListicleFormData } from "@/lib/types/listicles";

interface ListicleContentCardProps {
  watch: UseFormWatch<ListicleFormData>;
  setValue: UseFormSetValue<ListicleFormData>;
}

export function ListicleContentCard({ watch, setValue }: ListicleContentCardProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [contentAdToDelete, setContentAdToDelete] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [blurAdToDelete, setBlurAdToDelete] = useState<string | null>(null);

  // Watch form values
  const watchedContents = watch("contents");
  const watchedBlurs = watch("blurs");

  // Fetch all available ads for selection
  const { data: adsData, isLoading: isLoadingAds } = useQuery({
    queryKey: ["ads", "all"],
    queryFn: () => getAllAds({ per_page: 1000 }),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Get ads that are currently selected
  const selectedContentAds = adsData?.data?.filter((ad) => watchedContents.includes(ad.id)) || [];
  const selectedBlurAds = adsData?.data?.filter((ad) => watchedBlurs.includes(ad.id)) || [];

  // Get available ads (not already selected)
  const availableContentAds = adsData?.data?.filter((ad) => !watchedContents.includes(ad.id)) || [];
  const availableBlurAds = adsData?.data?.filter((ad) => !watchedBlurs.includes(ad.id)) || [];

  // Add ad handlers
  const handleAddContentAd = (adId: string) => {
    if (!watchedContents.includes(adId)) {
      setValue("contents", [...watchedContents, adId], { shouldDirty: true });
    }
  };

  const handleAddBlurAd = (adId: string) => {
    if (!watchedBlurs.includes(adId)) {
      setValue("blurs", [...watchedBlurs, adId], { shouldDirty: true });
    }
  };

  // Remove ad handlers
  const handleRemoveContentAd = (adId: string) => {
    setValue(
      "contents",
      watchedContents.filter((id) => id !== adId),
      { shouldDirty: true }
    );
    setContentAdToDelete(null);
  };

  const handleRemoveBlurAd = (adId: string) => {
    setValue(
      "blurs",
      watchedBlurs.filter((id) => id !== adId),
      { shouldDirty: true }
    );
    setBlurAdToDelete(null);
  };

  if (isLoadingAds) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
          <CardDescription>Manage ads displayed in this listicle</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-sm text-muted-foreground">Loading ads...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content</CardTitle>
        <CardDescription>Manage ads displayed in this listicle</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Listicle Ads</h3>
              <Select onValueChange={handleAddContentAd} value="">
                <SelectTrigger className="w-50">
                  <SelectValue placeholder="Add ad" />
                </SelectTrigger>
                <SelectContent>
                  {availableContentAds.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No ads available
                    </SelectItem>
                  ) : (
                    availableContentAds.map((ad) => (
                      <SelectItem key={ad.id} value={ad.id}>
                        {ad.title}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {selectedContentAds.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground border rounded">No ads added yet</div>
            ) : (
              <div className="border rounded">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-20">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedContentAds.map((ad) => (
                      <TableRow key={ad.id}>
                        <TableCell className="font-medium">{ad.title}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{ad.copy ? (ad.copy.length > 60 ? `${ad.copy.substring(0, 60)}...` : ad.copy) : "No description"}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon-xs" type="button" asChild>
                              <Link href={`/dashboard/ads/sponsored/${ad.id}`}>
                                <EyeIcon className="size-4" />
                              </Link>
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon-xs" type="button" onClick={() => setContentAdToDelete(ad.id)}>
                                  <TrashIcon className="size-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Remove Ad</AlertDialogTitle>
                                  <AlertDialogDescription>Are you sure you want to remove &quot;{ad.title}&quot; from listicle ads?</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel onClick={() => setContentAdToDelete(null)}>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleRemoveContentAd(ad.id)}>Remove</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Blur Ads</h3>
              <Select onValueChange={handleAddBlurAd} value="">
                <SelectTrigger className="w-50">
                  <SelectValue placeholder="Add ad" />
                </SelectTrigger>
                <SelectContent>
                  {availableBlurAds.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No ads available
                    </SelectItem>
                  ) : (
                    availableBlurAds.map((ad) => (
                      <SelectItem key={ad.id} value={ad.id}>
                        {ad.title}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {selectedBlurAds.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground border rounded">No ads added yet</div>
            ) : (
              <div className="border rounded">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Image</TableHead>
                      <TableHead className="w-20">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedBlurAds.map((ad) => (
                      <TableRow key={ad.id}>
                        <TableCell className="font-medium">{ad.title}</TableCell>
                        <TableCell>
                          {ad.image_url ? (
                            <div className="size-12 rounded overflow-hidden bg-muted">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={ad.image_url} alt={ad.title} className="size-full object-cover" />
                            </div>
                          ) : (
                            <div className="size-12 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">No img</div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon-xs" type="button" asChild>
                              <Link href={`/dashboard/ads/sponsored/${ad.id}`}>
                                <EyeIcon className="size-4" />
                              </Link>
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon-xs" type="button" onClick={() => setBlurAdToDelete(ad.id)}>
                                  <TrashIcon className="size-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Remove Ad</AlertDialogTitle>
                                  <AlertDialogDescription>Are you sure you want to remove &quot;{ad.title}&quot; from blur ads?</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel onClick={() => setBlurAdToDelete(null)}>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleRemoveBlurAd(ad.id)}>Remove</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { UseFormWatch, UseFormSetValue, FieldErrors } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { COUNTRIES } from "@/lib/constants/countries";
import { PLACEMENTS } from "@/lib/constants/placements";
import type { AdFormData, AdPlacement } from "@/lib/types/ads";

interface AdBoardFiltersCardProps {
  watch: UseFormWatch<AdFormData>;
  setValue: UseFormSetValue<AdFormData>;
  errors: FieldErrors<AdFormData>;
}

const boardCodes = [
  { value: "ALL", label: "All Boards" },
  { value: "ABC", label: "ABC" },
  { value: "DEF", label: "DEF" },
  { value: "GHI", label: "GHI" },
  { value: "JKL", label: "JKL" },
  { value: "MNO", label: "MNO" },
  { value: "PQR", label: "PQR" },
  { value: "STU", label: "STU" },
  { value: "VWX", label: "VWX" },
  { value: "YZ", label: "YZ" },
];

export function AdBoardFiltersCard({ watch, setValue, errors }: AdBoardFiltersCardProps) {
  const country = watch("country");
  const placement = watch("placement");
  const selectedBoards = watch("boards") || [];

  const toggleBoard = (boardValue: string) => {
    if (boardValue === "ALL") {
      setValue("boards", ["ALL"], { shouldDirty: true });
    } else {
      const newBoards = selectedBoards.includes(boardValue) ? selectedBoards.filter((b) => b !== boardValue) : [...selectedBoards.filter((b) => b !== "ALL"), boardValue];
      setValue("boards", newBoards, { shouldDirty: true });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Board Filters</CardTitle>
        <CardDescription>Country, Boards, Placement</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Field>
              <FieldLabel>Country Specific</FieldLabel>
              <FieldContent>
                <Select value={country} onValueChange={(value) => setValue("country", value, { shouldDirty: true })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(COUNTRIES).map(([code, name]) => (
                      <SelectItem key={code} value={code}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.country && <p className="text-sm text-destructive mt-1">{errors.country.message}</p>}
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Board Placement</FieldLabel>
              <FieldContent>
                <Select value={placement} onValueChange={(value: AdPlacement) => setValue("placement", value, { shouldDirty: true })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select placement" />
                  </SelectTrigger>
                  <SelectContent>
                    {PLACEMENTS.map((p) => (
                      <SelectItem key={p.slug} value={p.slug}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.placement && <p className="text-sm text-destructive mt-1">{errors.placement.message}</p>}
              </FieldContent>
            </Field>
          </div>

          <div className="space-y-4">
            <Field>
              <FieldLabel>Boards (Multi-select)</FieldLabel>
              <FieldContent>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      <span>{selectedBoards.length > 0 ? `${selectedBoards.length} board${selectedBoards.length > 1 ? "s" : ""} selected` : "Select boards"}</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <div className="max-h-60 overflow-y-auto p-2">
                      {boardCodes.map((board) => (
                        <div key={board.value} className="flex items-center space-x-2 p-2 hover:bg-muted cursor-pointer" onClick={() => toggleBoard(board.value)}>
                          <div className={`w-4 h-4 border flex items-center justify-center ${selectedBoards.includes(board.value) ? "bg-primary border-primary" : "border-border"}`}>
                            {selectedBoards.includes(board.value) && (
                              <svg className="w-3 h-3 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className="flex-1 text-sm">{board.label}</span>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
                <p className="text-xs text-muted-foreground mt-1">Selected: {selectedBoards.length > 0 ? selectedBoards.join(", ") : "None"}</p>
                {errors.boards && <p className="text-sm text-destructive mt-1">{errors.boards.message}</p>}
              </FieldContent>
            </Field>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

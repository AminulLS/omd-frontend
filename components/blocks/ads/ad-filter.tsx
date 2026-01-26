"use client";

import { useState } from "react";
import { UseFormWatch, UseFormSetValue, Control, useFieldArray } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import type { AdFormData, AdFilter, FilterOperator } from "@/lib/types/ads";

interface AdFiltersTabProps {
  watch: UseFormWatch<AdFormData>;
  setValue: UseFormSetValue<AdFormData>;
  control: Control<AdFormData>;
}

const AVAILABLE_FILTERS = [
  { id: "usertype", label: "User Type", category: "User Demographics" },
  { id: "filter_gender", label: "Gender", category: "User Demographics" },
  { id: "age", label: "Age", category: "User Demographics" },
  { id: "prepop", label: "Prepop", category: "Traffic Type" },
  { id: "keywords", label: "Keywords", category: "Keywords" },
  { id: "sources", label: "Sources", category: "Source" },
  { id: "sources_exclude_own", label: "Exclude Own Sources", category: "Source" },
  { id: "source_wildcards", label: "Source Wildcards", category: "Source" },
  { id: "mediums", label: "Mediums", category: "Mediums" },
  { id: "companies", label: "Companies", category: "Companies" },
  { id: "locations", label: "ZIP Codes", category: "Location" },
  { id: "locations_file", label: "Locations File", category: "Location" },
  { id: "states", label: "States", category: "Location" },
  { id: "education", label: "Education", category: "User Attributes" },
  { id: "device", label: "Device", category: "User Attributes" },
  { id: "browser_language", label: "Browser Language", category: "User Attributes" },
  { id: "employment_status", label: "Employment Status", category: "User Attributes" },
  { id: "m_device", label: "Mobile Device", category: "User Attributes" },
] as const;

type FilterKey = (typeof AVAILABLE_FILTERS)[number]["id"];

export function AdFiltersTab({ control }: AdFiltersTabProps) {
  const { fields, append, remove } = useFieldArray({ control, name: "filters" });

  const [addFilterOpen, setAddFilterOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<FilterKey | null>(null);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [tempShowValues, setTempShowValues] = useState("");
  const [tempHideValues, setTempHideValues] = useState("");

  const filtersByKey = fields.reduce((acc, field, index) => {
    if (!acc[field.key]) acc[field.key] = [];
    acc[field.key].push({ ...field, index });
    return acc;
  }, {} as Record<string, Array<AdFilter & { index: number }>>);

  const activeFilterKeys = Object.keys(filtersByKey) as FilterKey[];

  const handleAddFilter = (key: FilterKey) => {
    const defaults: Record<string, AdFilter[]> = {
      usertype: [{ key, op: "eq", value: "mixed" }],
      filter_gender: [{ key, op: "eq", value: "mixed" }],
      age: [{ key, op: "eq", value: 18 }],
      prepop: [{ key, op: "eq", value: "no" }],
      keywords: [
        { key, op: "in", value: [] },
        { key, op: "nin", value: [] },
      ],
      sources: [
        { key, op: "in", value: [] },
        { key, op: "nin", value: [] },
      ],
      sources_exclude_own: [{ key, op: "eq", value: false }],
      source_wildcards: [
        { key, op: "in", value: [] },
        { key, op: "nin", value: [] },
      ],
      mediums: [
        { key, op: "in", value: [] },
        { key, op: "nin", value: [] },
      ],
      companies: [
        { key, op: "in", value: [] },
        { key, op: "nin", value: [] },
      ],
      locations: [
        { key, op: "in", value: [] },
        { key, op: "nin", value: [] },
      ],
      locations_file: [{ key, op: "in", value: [] }],
      states: [
        { key, op: "in", value: [] },
        { key, op: "nin", value: [] },
      ],
      education: [{ key, op: "eq", value: "all" }],
      device: [{ key, op: "eq", value: "all" }],
      browser_language: [{ key, op: "eq", value: "all" }],
      employment_status: [{ key, op: "in", value: [] }],
      m_device: [{ key, op: "in", value: [] }],
    };

    (defaults[key] || [{ key, op: "eq", value: "" }]).forEach((filter) => append(filter));
    setAddFilterOpen(false);
    setEditingKey(key);
    setFilterModalOpen(true);
  };

  const handleRemoveFilter = (key: FilterKey) => {
    const indices = filtersByKey[key].map((f) => f.index).sort((a, b) => b - a);
    indices.forEach((index) => remove(index));
  };

  const getFilterDisplayValue = (key: FilterKey): string | React.ReactNode => {
    const filters = filtersByKey[key] || [];

    if (key === "age") {
      const rules = filters.map((f) => `${f.op === "eq" ? "=" : f.op === "neq" ? "≠" : f.op === "gt" ? ">" : f.op === "gte" ? "≥" : f.op === "lt" ? "<" : "≤"} ${f.value}`);
      return (
        <div className="flex flex-wrap gap-1">
          {rules.map((rule, i) => (
            <Badge key={i} variant="secondary" className="text-xs">
              {rule}
            </Badge>
          ))}
        </div>
      );
    }

    if (["keywords", "sources", "source_wildcards", "mediums", "companies", "locations", "states"].includes(key)) {
      const showFilter = filters.find((f) => f.op === "in");
      const hideFilter = filters.find((f) => f.op === "nin");
      const showValues = Array.isArray(showFilter?.value) ? showFilter.value : [];
      const hideValues = Array.isArray(hideFilter?.value) ? hideFilter.value : [];

      return (
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap gap-1 max-w-full">
            Show:{" "}
            {showValues.map((val, i) => (
              <Badge key={`show-${i}`} variant="default" className="text-xs bg-green-500/10 text-green-700 border-green-500/20">
                {val}
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap gap-1 max-w-full">
            Hide:{" "}
            {hideValues.map((val, i) => (
              <Badge key={`hide-${i}`} variant="default" className="text-xs bg-red-500/10 text-red-700 border-red-500/20">
                {val}
              </Badge>
            ))}
            {showValues.length === 0 && hideValues.length === 0 && <span className="text-muted-foreground">Not configured</span>}
          </div>
        </div>
      );
    }

    if (["employment_status", "m_device"].includes(key)) {
      const filter = filters[0];
      const values = Array.isArray(filter?.value) ? filter.value : [];
      return values.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {values.map((val, i) => (
            <Badge key={i} variant="secondary" className="text-xs">
              {val}
            </Badge>
          ))}
        </div>
      ) : (
        "Not configured"
      );
    }

    const filter = filters[0];
    return filter ? String(filter.value) : "Not configured";
  };

  const groupedAvailable = AVAILABLE_FILTERS.reduce((acc, filter) => {
    if (activeFilterKeys.includes(filter.id as FilterKey)) return acc;
    if (!acc[filter.category]) acc[filter.category] = [];
    acc[filter.category].push(filter);
    return acc;
  }, {} as Record<string, (typeof AVAILABLE_FILTERS)[number][]>);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Targeting Filters</h3>
            <CardDescription>Configure specific rules ({activeFilterKeys.length} active)</CardDescription>
          </div>
          <Popover open={addFilterOpen} onOpenChange={setAddFilterOpen}>
            <PopoverTrigger asChild>
              <Button type="button">
                <Plus className="h-4 w-4 mr-2" />
                Add Filter
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="max-h-96 overflow-y-auto">
                {Object.entries(groupedAvailable).map(([category, filterList]) => (
                  <div key={category}>
                    <div className="px-3 py-2 text-sm font-semibold text-muted-foreground bg-muted/50">{category}</div>
                    {filterList.map((filter) => (
                      <button key={filter.id} className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors" onClick={() => handleAddFilter(filter.id as FilterKey)}>
                        {filter.label}
                      </button>
                    ))}
                  </div>
                ))}
                {Object.keys(groupedAvailable).length === 0 && <div className="px-3 py-8 text-center text-sm text-muted-foreground">All filters are active</div>}
              </div>
            </PopoverContent>
          </Popover>
        </CardHeader>
        <CardContent>
          {activeFilterKeys.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg bg-muted/20">
              <p className="text-muted-foreground">No active filters. Click &quot;Add Filter&quot; to start targeting.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeFilterKeys.map((key) => {
                const filterDef = AVAILABLE_FILTERS.find((f) => f.id === key);
                return (
                  <div key={key} className="flex items-start justify-between p-3 border rounded-lg bg-card hover:border-primary/50 transition-colors group">
                    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{filterDef?.label}</span>
                        <Badge variant="secondary" className="text-[10px] font-normal uppercase">
                          {filterDef?.category}
                        </Badge>
                      </div>
                      <div className="text-xs">{getFilterDisplayValue(key)}</div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          setEditingKey(key);
                          setFilterModalOpen(true);
                        }}
                        type="button"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleRemoveFilter(key)} type="button">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filter Configuration Dialog */}
      <Dialog
        open={filterModalOpen}
        onOpenChange={(open) => {
          if (open && editingKey && ["keywords", "sources", "source_wildcards", "mediums", "companies", "locations", "states"].includes(editingKey)) {
            const showFilter = filtersByKey[editingKey]?.find((f) => f.op === "in");
            const hideFilter = filtersByKey[editingKey]?.find((f) => f.op === "nin");
            setTempShowValues(Array.isArray(showFilter?.value) ? showFilter.value.join(", ") : "");
            setTempHideValues(Array.isArray(hideFilter?.value) ? hideFilter.value.join(", ") : "");
          }
          setFilterModalOpen(open);
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Configure {AVAILABLE_FILTERS.find((f) => f.id === editingKey)?.label}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {editingKey && (
              <FilterConfigRenderer
                filterKey={editingKey}
                filters={filtersByKey[editingKey] || []}
                fields={fields}
                onUpdate={(updatedFilters) => {
                  const indices = (filtersByKey[editingKey] || []).map((f) => f.index).sort((a, b) => b - a);
                  indices.forEach((index) => remove(index));
                  updatedFilters.forEach((filter) => append(filter));
                }}
                tempShowValues={tempShowValues}
                tempHideValues={tempHideValues}
                onTempShowChange={setTempShowValues}
                onTempHideChange={setTempHideValues}
              />
            )}
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                if (editingKey && ["keywords", "sources", "source_wildcards", "mediums", "companies", "locations", "states"].includes(editingKey)) {
                  const showValues = tempShowValues
                    .split(/[\n,]/)
                    .map((v) => v.trim())
                    .filter(Boolean);
                  const hideValues = tempHideValues
                    .split(/[\n,]/)
                    .map((v) => v.trim())
                    .filter(Boolean);

                  const indices = (filtersByKey[editingKey] || []).map((f) => f.index).sort((a, b) => b - a);
                  indices.forEach((index) => remove(index));

                  const updatedFilters: AdFilter[] = [
                    { key: editingKey, op: "in" as const, value: showValues },
                    { key: editingKey, op: "nin" as const, value: hideValues },
                  ];

                  updatedFilters.forEach((filter) => append(filter));
                }
                setFilterModalOpen(false);
              }}
              type="button"
            >
              Close & Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function FilterConfigRenderer({
  filterKey,
  filters,
  onUpdate,
  tempShowValues,
  tempHideValues,
  onTempShowChange,
  onTempHideChange,
}: {
  filterKey: FilterKey;
  filters: Array<AdFilter & { index: number }>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields: any[];
  onUpdate: (filters: AdFilter[]) => void;
  tempShowValues?: string;
  tempHideValues?: string;
  onTempShowChange?: (val: string) => void;
  onTempHideChange?: (val: string) => void;
}) {
  if (["usertype", "filter_gender", "prepop", "education", "device", "browser_language"].includes(filterKey)) {
    const filter = filters[0] || { key: filterKey, op: "eq", value: "" };

    const options: Record<string, Array<{ value: string; label: string }>> = {
      usertype: [
        { value: "mixed", label: "Mixed (Uniques/Duplicates)" },
        { value: "uniques", label: "Uniques Only" },
        { value: "duplicates", label: "Duplicates Only" },
      ],
      filter_gender: [
        { value: "mixed", label: "Any (Male/Female)" },
        { value: "male", label: "Only Males" },
        { value: "female", label: "Only Females" },
      ],
      prepop: [
        { value: "no", label: "Any Traffic" },
        { value: "yes", label: "Only Prepop" },
        { value: "non", label: "Only Non-Prepop" },
      ],
      education: [
        { value: "all", label: "All" },
        { value: "yes", label: "Yes" },
        { value: "maybeyes", label: "Maybe Yes" },
        { value: "no", label: "No" },
      ],
      device: [
        { value: "all", label: "All" },
        { value: "mobile", label: "Mobile Only" },
        { value: "desktop", label: "Desktop Only" },
      ],
      browser_language: [
        { value: "all", label: "All" },
        { value: "en", label: "English" },
        { value: "es", label: "Spanish" },
      ],
    };

    return (
      <Field>
        <FieldLabel>{AVAILABLE_FILTERS.find((f) => f.id === filterKey)?.label}</FieldLabel>
        <FieldContent>
          <div className="space-y-2">
            {options[filterKey].map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={filter.value === opt.value} onChange={() => onUpdate([{ key: filterKey, op: "eq", value: opt.value }])} className="w-4 h-4" />
                <span className="text-sm">{opt.label}</span>
              </label>
            ))}
          </div>
        </FieldContent>
      </Field>
    );
  }

  if (filterKey === "sources_exclude_own") {
    const filter = filters[0] || { key: filterKey, op: "eq", value: false };
    return (
      <Field>
        <FieldLabel>Exclude Own Source Traffic</FieldLabel>
        <FieldContent>
          <div className="flex items-center gap-2">
            <Switch checked={filter.value === true} onCheckedChange={(checked) => onUpdate([{ key: filterKey, op: "eq", value: checked }])} />
            <span className="text-sm text-muted-foreground">{filter.value === true ? "Enabled" : "Disabled"}</span>
          </div>
        </FieldContent>
      </Field>
    );
  }

  if (filterKey === "age") {
    return (
      <Field>
        <div className="flex items-center justify-between">
          <FieldLabel>Age Rules</FieldLabel>
          <Button type="button" variant="outline" size="sm" onClick={() => onUpdate([...filters, { key: filterKey, op: "eq", value: 18 }])}>
            <Plus className="h-4 w-4 mr-1" />
            Add Rule
          </Button>
        </div>
        <FieldContent>
          {filters.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No age rules. Click &quot;Add Rule&quot; to create one.</p>
          ) : (
            <div className="space-y-2">
              {filters.map((filter, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Select
                    value={filter.op}
                    onValueChange={(op: FilterOperator) => {
                      const updated = [...filters];
                      updated[idx] = { ...filter, op };
                      onUpdate(updated);
                    }}
                  >
                    <SelectTrigger className="w-45">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="eq">Equals (=)</SelectItem>
                      <SelectItem value="neq">Not Equals (!=)</SelectItem>
                      <SelectItem value="gt">Greater (&gt;)</SelectItem>
                      <SelectItem value="gte">Greater/Equal (≥)</SelectItem>
                      <SelectItem value="lt">Less (&lt;)</SelectItem>
                      <SelectItem value="lte">Less/Equal (≤)</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    min="0"
                    max="120"
                    placeholder="Age"
                    value={Number(filter.value)}
                    onChange={(e) => {
                      const updated = [...filters];
                      updated[idx] = { ...filter, value: parseInt(e.target.value) || 0 };
                      onUpdate(updated);
                    }}
                    className="flex-1"
                  />
                  <Button type="button" variant="ghost" size="icon" onClick={() => onUpdate(filters.filter((_, i) => i !== idx))}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </FieldContent>
      </Field>
    );
  }

  if (["keywords", "sources", "source_wildcards", "mediums", "companies", "locations", "states"].includes(filterKey)) {
    return (
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Include
          </label>
          <Textarea rows={4} value={tempShowValues || ""} onChange={(e) => onTempShowChange?.(e.target.value)} placeholder="Enter comma-separated or one per line" className="font-mono text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            Exclude
          </label>
          <Textarea rows={4} value={tempHideValues || ""} onChange={(e) => onTempHideChange?.(e.target.value)} placeholder="Enter comma-separated or one per line" className="font-mono text-sm" />
        </div>
      </div>
    );
  }

  if (filterKey === "locations_file") {
    const filter = filters[0] || { key: filterKey, op: "in", value: [] };
    const url = Array.isArray(filter.value) ? filter.value[0] || "" : "";

    return (
      <Field>
        <FieldLabel>File URL</FieldLabel>
        <FieldContent>
          <Input value={url} onChange={(e) => onUpdate([{ key: filterKey, op: "in", value: e.target.value ? [e.target.value] : [] }])} placeholder="https://example.com/locations.csv" />
        </FieldContent>
      </Field>
    );
  }

  if (["employment_status", "m_device"].includes(filterKey)) {
    const filter = filters[0] || { key: filterKey, op: "in", value: [] };
    const values = (Array.isArray(filter.value) ? filter.value : []) as string[];

    const options: Record<string, Array<{ value: string; label: string }>> = {
      employment_status: [
        { value: "employed", label: "Employed" },
        { value: "unemployed", label: "Unemployed" },
        { value: "disability", label: "Disability" },
        { value: "student", label: "Student" },
        { value: "retired", label: "Retired" },
      ],
      m_device: [
        { value: "Samsung", label: "Samsung" },
        { value: "IOS", label: "iOS" },
        { value: "Other Android", label: "Other Android" },
      ],
    };

    return (
      <Field>
        <FieldLabel>{AVAILABLE_FILTERS.find((f) => f.id === filterKey)?.label}</FieldLabel>
        <FieldContent>
          <div className="space-y-2">
            {options[filterKey].map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={values.includes(opt.value)}
                  onChange={(e) => {
                    const updated: string[] = e.target.checked ? [...values, opt.value] : values.filter((v) => v !== opt.value);
                    onUpdate([{ key: filterKey, op: "in", value: updated as string | number | boolean | string[] | number[] }]);
                  }}
                  className="w-4 h-4"
                />
                <span className="text-sm">{opt.label}</span>
              </label>
            ))}
          </div>
        </FieldContent>
      </Field>
    );
  }
  return <div>Unknown filter type</div>;
}

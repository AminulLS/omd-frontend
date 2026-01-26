"use client";

import { useState } from "react";
import { Field, FieldContent, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchIcon, ShieldAlertIcon } from "lucide-react";

import { AuditLogDetailModal } from "@/components/blocks/audit/details-modal";

import type { AuditLog, AuditLogFilters, AuditAction, AuditResourceType } from "@/lib/types/audit";
import { AuditLogsTable } from "@/components/blocks/data-tables/audit-table";

export default function AuditLogsPage() {
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [filters, setFilters] = useState<AuditLogFilters>({
    search: "",
    action: "all",
    resourceType: "all",
  });

  const handleViewDetails = (log: AuditLog) => {
    setSelectedLog(log);
    setDetailModalOpen(true);
  };

  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
  };

  const handleActionChange = (value: AuditAction | "all") => {
    setFilters((prev) => ({ ...prev, action: value }));
  };

  const handleResourceTypeChange = (value: AuditResourceType | "all") => {
    setFilters((prev) => ({ ...prev, resourceType: value }));
  };

  return (
    <div className="flex flex-col gap-y-4">
      <div>
        <div className="flex items-center justify-between mb-4 border-b pb-2">
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <ShieldAlertIcon className="size-4" />
              Audit Logs
            </h2>
            <p className="text-sm text-muted-foreground">Track all system events, changes, and user activities</p>
          </div>
        </div>

        <FieldGroup className="mb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Field className="flex-1">
              <FieldLabel>Search</FieldLabel>
              <FieldContent>
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input placeholder="Search by actor, resource, or description..." value={filters.search} onChange={(e) => handleSearchChange(e.target.value)} className="pl-9" />
                </div>
              </FieldContent>
            </Field>

            <Field className="sm:w-45">
              <FieldLabel>Action</FieldLabel>
              <FieldContent>
                <Select value={filters.action} onValueChange={(value: AuditAction | "all") => handleActionChange(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="created">Created</SelectItem>
                    <SelectItem value="updated">Updated</SelectItem>
                    <SelectItem value="deleted">Deleted</SelectItem>
                  </SelectContent>
                </Select>
              </FieldContent>
            </Field>

            <Field className="sm:w-55">
              <FieldLabel>Resource Type</FieldLabel>
              <FieldContent>
                <Select value={filters.resourceType} onValueChange={(value: AuditResourceType | "all") => handleResourceTypeChange(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Resources</SelectItem>
                    <SelectItem value="campaign">Campaigns</SelectItem>
                    <SelectItem value="ad">Sponsored Ads</SelectItem>
                    <SelectItem value="partner">Partners</SelectItem>
                    <SelectItem value="user">Users</SelectItem>
                    <SelectItem value="xml">XMLs</SelectItem>
                    <SelectItem value="syndicate">Syndicates</SelectItem>
                    <SelectItem value="listicle">Listicles</SelectItem>
                    <SelectItem value="settings">Settings</SelectItem>
                    <SelectItem value="acl">Access Control</SelectItem>
                  </SelectContent>
                </Select>
              </FieldContent>
            </Field>
          </div>
        </FieldGroup>

        <AuditLogsTable filters={filters} onViewDetails={handleViewDetails} />
      </div>

      <AuditLogDetailModal log={selectedLog} open={detailModalOpen} onOpenChange={setDetailModalOpen} />
    </div>
  );
}

"use client";

import { useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { XIcon, UserIcon, ChevronDownIcon, ChevronRightIcon } from "lucide-react";

import { actionLabelMap, actionVariantMap, resourceTypeLabelMap, type AuditLog } from "@/lib/types/audit";

interface AuditLogDetailModalProps {
  log: AuditLog | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatJson(obj: any): string {
  return JSON.stringify(obj, null, 2);
}

function formatFullTimestamp(timestamp: string): string {
  return new Date(timestamp).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  });
}

export function AuditLogDetailModal({ log, open, onOpenChange }: AuditLogDetailModalProps) {
  const [expandedChanges, setExpandedChanges] = useState(false);

  if (!log) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0" showCloseButton={false}>
        <div className="flex items-center justify-between border-b px-6 py-4 shrink-0">
          <div className="flex items-center gap-3">
            <div>
              <DialogTitle className="text-base font-semibold">Audit Log Details</DialogTitle>
              <DialogDescription className="mt-0.5">
                {resourceTypeLabelMap[log.resourceType]} {actionLabelMap[log.action]} - {log.id}
              </DialogDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={actionVariantMap[log.action]}>{actionLabelMap[log.action]}</Badge>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="shrink-0">
                <XIcon className="size-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogClose>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          <div>
            <div className="text-sm font-medium mb-1">Timestamp</div>
            <div className="text-sm text-muted-foreground">{formatFullTimestamp(log.timestamp)}</div>
          </div>

          <div>
            <div className="text-sm font-medium mb-1">Description</div>
            <div className="text-sm text-muted-foreground">{log.description}</div>
          </div>

          <div className="border rounded-lg p-4">
            <div className="text-sm font-medium mb-3 flex items-center gap-2">
              <UserIcon className="size-4" />
              Actor (Who made the change)
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Name: </span>
                <span className="font-medium">{log.actorName}</span>
              </div>
              <div>
                <span className="text-muted-foreground">ID: </span>
                <span className="font-mono text-xs">{log.actorId}</span>
              </div>
              {log.actorEmail && (
                <div className="col-span-2">
                  <span className="text-muted-foreground">Email: </span>
                  {log.actorEmail}
                </div>
              )}
              {log.actorIpAddress && (
                <div>
                  <span className="text-muted-foreground">IP Address: </span>
                  {log.actorIpAddress}
                </div>
              )}
              {log.actorUserAgent && (
                <div className="col-span-2">
                  <span className="text-muted-foreground">User Agent: </span>
                  <span className="text-xs break-all">{log.actorUserAgent}</span>
                </div>
              )}
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <div className="text-sm font-medium mb-3">Target (What was affected)</div>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Type: </span>
                <span className="font-medium">{resourceTypeLabelMap[log.resourceType]}</span>
              </div>
              <div>
                <span className="text-muted-foreground">ID: </span>
                <span className="font-mono text-xs">{log.resourceId}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Name: </span>
                <span className="font-medium">{log.resourceName}</span>
              </div>
            </div>
          </div>

          {log.metadata?.footprints && (
            <div className="border rounded-lg p-4">
              <div className="text-sm font-medium mb-3">User Footprint</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                {log.metadata.footprints.browser && (
                  <div>
                    <span className="text-muted-foreground">Browser: </span>
                    {log.metadata.footprints.browser}
                  </div>
                )}
                {log.metadata.footprints.os && (
                  <div>
                    <span className="text-muted-foreground">OS: </span>
                    {log.metadata.footprints.os}
                  </div>
                )}
                {log.metadata.footprints.device && (
                  <div>
                    <span className="text-muted-foreground">Device: </span>
                    {log.metadata.footprints.device}
                  </div>
                )}
                {log.metadata.footprints.location && (
                  <div>
                    <span className="text-muted-foreground">Location: </span>
                    {log.metadata.footprints.location}
                  </div>
                )}
              </div>
            </div>
          )}

          {log.changes && Object.keys(log.changes).length > 0 && (
            <div className="border rounded-lg p-4">
              <div className="text-sm font-medium mb-3">Changed Fields ({Object.keys(log.changes).length})</div>
              <div className="flex flex-wrap gap-2">
                {Object.keys(log.changes).map((key) => (
                  <Badge key={key} variant="secondary" className="text-xs">
                    {key}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {(log.before || log.after) && (
            <div className="border rounded-lg p-4">
              <div className="text-sm font-medium cursor-pointer flex items-center gap-1 hover:text-primary mb-3" onClick={() => setExpandedChanges(!expandedChanges)}>
                {expandedChanges ? <ChevronDownIcon className="size-4" /> : <ChevronRightIcon className="size-4" />}
                Full Data (Before vs After)
              </div>
              {expandedChanges && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                  <div>
                    <div className="text-xs font-medium mb-2 text-muted-foreground uppercase tracking-wide">Before</div>
                    <pre className="bg-muted rounded-md p-3 text-xs overflow-x-auto max-h-100 overflow-y-auto">{log.before ? formatJson(log.before) : "null"}</pre>
                  </div>
                  <div>
                    <div className="text-xs font-medium mb-2 text-muted-foreground uppercase tracking-wide">After</div>
                    <pre className="bg-muted rounded-md p-3 text-xs overflow-x-auto max-h-100 overflow-y-auto">{log.after ? formatJson(log.after) : "null"}</pre>
                  </div>
                </div>
              )}
            </div>
          )}

          {log.changes && Object.keys(log.changes).length > 0 && expandedChanges && (
            <div className="border rounded-lg p-4">
              <div className="text-xs font-medium mb-2 text-muted-foreground uppercase tracking-wide">Changes Only (Diff)</div>
              <pre className="bg-muted rounded-md p-3 text-xs overflow-x-auto">{formatJson(log.changes)}</pre>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

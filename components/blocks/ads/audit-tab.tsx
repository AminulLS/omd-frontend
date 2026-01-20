"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const mockAuditLogsData = [
  { id: 1, action: "Status changed", details: "Changed from paused to active", user: "John Doe", timestamp: "2024-01-15 14:32:00" },
  { id: 2, action: "Budget updated", details: "Daily budget increased from $100 to $150", user: "Jane Smith", timestamp: "2024-01-14 09:15:00" },
  { id: 3, action: "Ad modified", details: "Updated title and description", user: "John Doe", timestamp: "2024-01-13 16:45:00" },
  { id: 4, action: "Schedule added", details: "Added new schedule: Morning Rush", user: "Jane Smith", timestamp: "2024-01-12 11:20:00" },
  { id: 5, action: "Created", details: "Campaign created", user: "John Doe", timestamp: "2024-01-01 08:00:00" },
];

export function AdAuditLogsTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Audit Logs</CardTitle>
        <CardDescription>Track all changes made to this ad</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Action</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockAuditLogsData.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-medium">{log.action}</TableCell>
                <TableCell>{log.details}</TableCell>
                <TableCell>{log.user}</TableCell>
                <TableCell className="text-muted-foreground">{log.timestamp}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

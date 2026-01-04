'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

type Snapshot = {
    revenue: number | string,
    total_revenue: number | string,
    clicks: number | string,
    cpc: number | string,
    cbh: number | string,
}

export default function SnapshotTable({ data }: {
    data: {
        today: Snapshot,
        yesterday: Snapshot,
        sdlw: Snapshot,
    }
}) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Label</TableHead>
                    <TableHead>Today</TableHead>
                    <TableHead>Yesterday</TableHead>
                    <TableHead>SDLW</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableHead>Revenue</TableHead>
                    <TableCell>${data.today.revenue.toLocaleString()}</TableCell>
                    <TableCell>${data.yesterday.revenue.toLocaleString()}</TableCell>
                    <TableCell>${data.sdlw.revenue.toLocaleString()}</TableCell>
                </TableRow>
                <TableRow>
                    <TableHead>Clicks</TableHead>
                    <TableCell>{data.today.clicks.toLocaleString()}</TableCell>
                    <TableCell>{data.yesterday.clicks.toLocaleString()}</TableCell>
                    <TableCell>{data.sdlw.clicks.toLocaleString()}</TableCell>
                </TableRow>
                <TableRow>
                    <TableHead>CPC</TableHead>
                    <TableCell>${data.today.cpc.toLocaleString()}</TableCell>
                    <TableCell>${data.yesterday.cpc.toLocaleString()}</TableCell>
                    <TableCell>${data.sdlw.cpc.toLocaleString()}</TableCell>
                </TableRow>
                <TableRow>
                    <TableHead>CBH</TableHead>
                    <TableCell>${data.today.cbh.toLocaleString()}</TableCell>
                    <TableCell>${data.yesterday.cbh.toLocaleString()}</TableCell>
                    <TableCell>${data.sdlw.cbh.toLocaleString()}</TableCell>
                </TableRow>
                <TableRow>
                    <TableHead>Total</TableHead>
                    <TableCell>${data.today.total_revenue.toLocaleString()}</TableCell>
                    <TableCell>${data.yesterday.total_revenue.toLocaleString()}</TableCell>
                    <TableCell>${data.sdlw.total_revenue.toLocaleString()}</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    )
}
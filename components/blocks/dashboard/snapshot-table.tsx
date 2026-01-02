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
                    <TableCell>${data.today.revenue}</TableCell>
                    <TableCell>${data.yesterday.revenue}</TableCell>
                    <TableCell>${data.sdlw.revenue}</TableCell>
                </TableRow>
                <TableRow>
                    <TableHead>Clicks</TableHead>
                    <TableCell>{data.today.clicks}</TableCell>
                    <TableCell>{data.yesterday.clicks}</TableCell>
                    <TableCell>{data.sdlw.clicks}</TableCell>
                </TableRow>
                <TableRow>
                    <TableHead>CPC</TableHead>
                    <TableCell>${data.today.cpc}</TableCell>
                    <TableCell>${data.yesterday.cpc}</TableCell>
                    <TableCell>${data.sdlw.cpc}</TableCell>
                </TableRow>
                <TableRow>
                    <TableHead>CBH</TableHead>
                    <TableCell>${data.today.cbh}</TableCell>
                    <TableCell>${data.yesterday.cbh}</TableCell>
                    <TableCell>${data.sdlw.cbh}</TableCell>
                </TableRow>
                <TableRow>
                    <TableHead>Total Revenue</TableHead>
                    <TableCell>${data.today.total_revenue}</TableCell>
                    <TableCell>${data.yesterday.total_revenue}</TableCell>
                    <TableCell>${data.sdlw.total_revenue}</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    )
}
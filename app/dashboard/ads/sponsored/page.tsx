import { HourlyChart } from '@/components/blocks/charts/hourly-chart'
import { MonthlyChart } from '@/components/blocks/charts/monthly-chart'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { format } from 'date-fns'

const data = (hours = 24) => {
    return [...Array(hours)].map((_, h) => {
        const format = (h: number) => `${h % 12 || 12}${h < 12 ? 'am' : 'pm'}`
        return {
            key: format(h),
            fields: {
                today_revenue: Math.floor(Math.random() * 1000) + 200,
                today_clicks: Math.floor(Math.random() * 1000) + 200,
                yesterday_revenue: Math.floor(Math.random() * 1000) + 200,
                yesterday_clicks: Math.floor(Math.random() * 1000) + 200,
                sdlw_revenue: Math.floor(Math.random() * 1000) + 200,
                sdlw_clicks: Math.floor(Math.random() * 1000) + 200,
            },
        }
    })
}
const config = {
    today_revenue: {
        color: '#F96E5B',
        label: 'Today Revenue',
    },
    today_clicks: {
        color: '#FFE2AF',
        label: 'Today Clicks',
    },
    yesterday_revenue: {
        color: '#79C9C5',
        label: 'Yesterday Revenue',
    },
    yesterday_clicks: {
        color: '#3F9AAE',
        label: 'Yesterday Clicks',
    },
    sdlw_revenue: {
        color: '#BDE8F5',
        label: 'SDLW Revenue',
    },
    sdlw_clicks: {
        color: '#4988C4',
        label: 'SDLW Clicks',
    },
}

const snapshotData = {
    today: {
        revenue: data().reduce((acc, curr) => acc + curr.fields.today_revenue, 0),
        clicks: data().reduce((acc, curr) => acc + curr.fields.today_clicks, 0),
        cpc: data().reduce((acc, curr) => acc + curr.fields.today_revenue / curr.fields.today_clicks, 0),
        cbh: data().reduce((acc, curr) => acc + curr.fields.today_clicks, 0),
        total_revenue: data().reduce((acc, curr) => acc + curr.fields.today_revenue, 0),
    },
    yesterday: {
        revenue: data().reduce((acc, curr) => acc + curr.fields.yesterday_revenue, 0),
        clicks: data().reduce((acc, curr) => acc + curr.fields.yesterday_clicks, 0),
        cpc: data().reduce((acc, curr) => acc + curr.fields.yesterday_revenue / curr.fields.yesterday_clicks, 0),
        cbh: data().reduce((acc, curr) => acc + curr.fields.yesterday_clicks, 0),
        total_revenue: data().reduce((acc, curr) => acc + curr.fields.yesterday_revenue, 0),
    },
    sdlw: {
        revenue: data().reduce((acc, curr) => acc + curr.fields.sdlw_revenue, 0),
        clicks: data().reduce((acc, curr) => acc + curr.fields.sdlw_clicks, 0),
        cpc: data().reduce((acc, curr) => acc + curr.fields.sdlw_revenue / curr.fields.sdlw_clicks, 0),
        cbh: data().reduce((acc, curr) => acc + curr.fields.sdlw_clicks, 0),
        total_revenue: data().reduce((acc, curr) => acc + curr.fields.sdlw_revenue, 0),
    },
}

const dataTwoMonth = () => {
    // get calendar days of current and last month:
    const daysInMonth = (month: number, year: number) => {
        return new Date(year, month + 1, 0).getDate()
    }
    const now = new Date()
    const currentMonthDays = daysInMonth(now.getMonth(), now.getFullYear())
    const lastMonthDays = daysInMonth(
        now.getMonth() - 1 < 0 ? 11 : now.getMonth() - 1,
        now.getMonth() - 1 < 0 ? now.getFullYear() - 1 : now.getFullYear(),
    )
    const data = []

    for (let i = 1; i <= currentMonthDays; i++) {
        data[i - 1] = {
            key: i.toString().padStart(2, '0'),
            fields: {
                current: Math.floor(Math.random() * 1000) + 200,
                last: 0,
            },
        }
    }

    for (let i = 1; i <= lastMonthDays; i++) {
        if (!data[i - 1]) {
            data[i - 1] = {
                key: i.toString().padStart(2, '0'),
                fields: {
                    current: 0,
                    last: 0,
                },
            }
        }

        data[i - 1].fields.last = Math.floor(Math.random() * 1000) + 200
    }

    return data
}

const configTwoMonth = {
    current: {
        color: 'var(--chart-2)',
        label: 'This Month',
    },
    last: {
        color: 'var(--chart-3)',
        label: 'Last Month',
    },
}

export default function Page() {
    return (
        <div>
            <div className="mb-4 border-b pb-2">
                <h2 className="text-lg font-semibold">Ads</h2>
                <p className="text-sm text-muted-foreground">Manage all of the sponsored ads</p>
            </div>

            <div className="flex flex-col gap-4">
                {/* Daily chart (current & last month) */}
                <Card size="sm">
                    <CardHeader>
                        <CardTitle>Daily Revenue</CardTitle>
                        <CardDescription>This month vs Last Month</CardDescription>
                        <CardAction>
                            <div className="flex gap-2">
                                <Badge className="bg-chart-2 rounded-full">
                                    ${dataTwoMonth().reduce((acc, curr) => acc + curr.fields.current, 0).toLocaleString()}
                                </Badge>
                                <Badge className="bg-chart-3 rounded-full">
                                    ${dataTwoMonth().reduce((acc, curr) => acc + curr.fields.last, 0).toLocaleString()}
                                </Badge>
                            </div>
                        </CardAction>
                    </CardHeader>
                    <CardContent>
                        <MonthlyChart data={dataTwoMonth()} config={configTwoMonth} />
                    </CardContent>
                </Card>

                <div className="flex gap-2">
                    {/* Hourly chart */}
                    <Card size="sm" className="w-4/6">
                        <CardHeader>
                            <CardTitle>Recent Revenue</CardTitle>
                            <CardAction>
                                <span className="text-xs text-muted-foreground">Last Updated: {new Date().toLocaleString()}</span>
                            </CardAction>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-center gap-4 items-center mb-2">
                                <div className="text-center">
                                    <div className="text-sm text-muted-foreground">Today</div>
                                    <div className="text-lg font-semibold flex items-center gap-1">
                                        ${data().reduce((acc, curr) => acc + curr.fields.today_revenue, 0).toLocaleString()}
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-sm text-muted-foreground">Yesterday</div>
                                    <div className="text-lg font-semibold flex items-center gap-1">
                                        ${data().reduce((acc, curr) => acc + curr.fields.yesterday_revenue, 0).toLocaleString()}
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-sm text-muted-foreground">SDLW</div>
                                    <div className="text-lg font-semibold flex items-center gap-1">
                                        ${data().reduce((acc, curr) => acc + curr.fields.sdlw_revenue, 0).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                            <HourlyChart data={data()} config={config} />
                        </CardContent>
                    </Card>

                    <Card size="sm" className="w-2/6">
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Revenue</TableHead>
                                        <TableHead>SDLW</TableHead>
                                        <TableHead>Delta</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {[...Array(7)].map((row, idx) => (
                                        <TableRow key={idx}>
                                            <TableHead>
                                                <span>{ format(new Date(2026, 1, 1+idx), `MM/dd/yyyy`) }</span>
                                                <small> ({ format(new Date(2026, 1, 1+idx), `ccc`) })</small>
                                            </TableHead>
                                            <TableCell>${(Math.random() * 1000.54 + 200).toLocaleString()}</TableCell>
                                            <TableCell>${(Math.random() * 1000.74 + 200).toLocaleString()}</TableCell>
                                            <TableCell>${(Math.random() * 1000.23 + 200).toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

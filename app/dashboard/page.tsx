import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { HourlyChart } from '@/components/blocks/charts/hourly-chart'
import SnapshotTable from '@/components/blocks/dashboard/snapshot-table'
import Link from 'next/link'
import { SquareArrowOutUpRight } from 'lucide-react'

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

export default function Page() {
    return (
        <div className="flex flex-col gap-y-4">
            <Card size="sm">
                <CardHeader>
                    <CardTitle>Global Ad Advertisers</CardTitle>
                    <CardDescription>Ad Revenue / Clicks By Hours</CardDescription>
                    <CardAction>
                        <Link href="/dashboard/ads/sponsored"><SquareArrowOutUpRight className="size-4" /></Link>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2">
                        <div className="w-4/6">
                            <HourlyChart data={data()} config={config} />
                        </div>
                        <div className="w-2/6">
                            <SnapshotTable data={snapshotData} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card size="sm">
                <CardHeader>
                    <CardTitle>Global XML Advertisers</CardTitle>
                    <CardDescription>Ad Revenue / Clicks By Hours</CardDescription>
                    <CardAction>
                        <Link href="/dashboard/ads/xml"><SquareArrowOutUpRight className="size-4" /></Link>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2">
                        <div className="w-4/6">
                            <HourlyChart data={data()} config={config} />
                        </div>
                        <div className="w-2/6">
                            <SnapshotTable data={snapshotData} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card size="sm">
                <CardHeader>
                    <CardTitle>Global Traffic Publishers</CardTitle>
                    <CardDescription>Ad Revenue / Clicks By Hours</CardDescription>
                    <CardAction>
                        <Link href="/dashboard/publishers/campaigns"><SquareArrowOutUpRight className="size-4" /></Link>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2">
                        <div className="w-4/6">
                            <HourlyChart data={data()} config={config} />
                        </div>
                        <div className="w-2/6">
                            <SnapshotTable data={snapshotData} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card size="sm">
                <CardHeader>
                    <CardTitle>Global Syndicate Publishers</CardTitle>
                    <CardDescription>Ad Revenue / Clicks By Hours</CardDescription>
                    <CardAction>
                        <Link href="/dashboard/publishers/syndicates"><SquareArrowOutUpRight className="size-4" /></Link>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2">
                        <div className="w-4/6">
                            <HourlyChart data={data()} config={config} />
                        </div>
                        <div className="w-2/6">
                            <SnapshotTable data={snapshotData} />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

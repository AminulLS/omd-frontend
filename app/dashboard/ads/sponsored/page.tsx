import { HourlyChart } from '@/components/blocks/dashboard/hourly-chart'
import SnapshotTable from '@/components/blocks/dashboard/snapshot-table'

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
        revenue: '26,070.66',
        clicks: '72,955',
        cpc: '0.357',
        cbh: '72,955',
        total_revenue: '26,070.66',
    },
    yesterday: {
        revenue: '26,070.66',
        clicks: '72,955',
        cpc: '0.357',
        cbh: '72,955',
        total_revenue: '26,070.66',
    },
    sdlw: {
        revenue: '26,070.66',
        clicks: '72,955',
        cpc: '0.357',
        cbh: '72,955',
        total_revenue: '26,070.66',
    },
}

export default function Page() {
    return (
        <div>
            <div className="mb-4 border-b pb-2">
                <h2 className="text-lg font-semibold">Ads</h2>
                <p className="text-sm text-muted-foreground">Manage all of the sponsored ads</p>
            </div>
            <div className="flex gap-2">
                <div className="w-4/6">
                    <HourlyChart data={data()} config={config} />
                </div>
                <div className="w-2/6">
                    <SnapshotTable data={snapshotData} />
                </div>
            </div>
        </div>
    )
}

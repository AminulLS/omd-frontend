'use client'

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import * as React from 'react'

export function MonthlyChart({
                                 data,
                                 config,
                             }: {
    data: {
        key: string;
        fields: Record<string, number>;
    }[],
    config: ChartConfig
}) {
    const chartData = data.map((d) => {
        return {
            ...d.fields,
            _ckf: d.key,
        }
    })

    return (

        <ChartContainer config={config} className="aspect-auto h-62.5 w-full">
            <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="_ckf"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                />

                {Object.keys(config).map((key) => {
                    const color = config[key].color || 'var(--chart-1)'

                    return (
                        <Bar key={key} dataKey={key} fill={color} />
                    )
                })}
            </BarChart>
        </ChartContainer>
    )
}

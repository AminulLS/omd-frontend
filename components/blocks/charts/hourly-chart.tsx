'use client'

import * as React from 'react'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
import {
    type ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart'

export function HourlyChart({
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
        <ChartContainer
            config={config}
            className="aspect-auto h-62.5 w-full"
        >
            <AreaChart data={chartData}>
                <defs>
                    {Object.keys(config).map((key) => {
                        const color = config[key].color || 'var(--chart-1)'

                        return (
                            <linearGradient key={key} id={`fill${key}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                                <stop offset="95%" stopColor={color} stopOpacity={0.1} />
                            </linearGradient>
                        )
                    })}
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="_ckf"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                />
                <ChartTooltip
                    cursor={false}
                    content={
                        <ChartTooltipContent indicator="line" />
                    }
                />
                {Object.keys(config).map((key) => {
                    const color = config[key].color || 'var(--chart-1)'
                    return (
                        <Area
                            key={key}
                            dataKey={key}
                            type="natural"
                            fill={`url(#fill${key})`}
                            stroke={color}
                            stackId="a"
                        />
                    )
                })}
                <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
        </ChartContainer>
    )
}

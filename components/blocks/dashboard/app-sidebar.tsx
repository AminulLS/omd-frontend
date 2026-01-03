'use client'

import * as React from 'react'
import {
    ChartNoAxesCombined,
    Handshake,
    HatGlasses, Logs,
    Newspaper,
    Rss,
    Settings,
    SquareTerminal,
    Users,
} from 'lucide-react'

import { NavMain } from '@/components/blocks/dashboard/nav-main'
import { NavUser } from '@/components/blocks/dashboard/nav-user'
import { SidebarLogo } from '@/components/blocks/dashboard/sidebar-logo'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar'

// This is sample data.
const data = {
    user: {
        name: 'aminul',
        email: 'aminul@employers.io',
        avatar: '/avatars/shadcn.jpg',
    },
    navMain: [
        {
            title: 'Partners',
            url: '/dashboard/partners',
            icon: Handshake,
        },
        {
            title: 'Ads',
            url: '/dashboard/ads',
            icon: SquareTerminal,
            isActive: false,
            items: [
                {
                    title: 'Sponsored',
                    url: '/dashboard/ads/sponsored',
                },
                {
                    title: 'XML Direct Listings',
                    url: '/dashboard/ads/xml-direct-listings',
                },
                {
                    title: 'Listicles',
                    url: '/dashboard/ads/listicles',
                    icon: Newspaper,
                },
            ],
        },
        {
            title: 'Publishers',
            url: '/dashboard/publishers',
            icon: Rss,
            isActive: false,
            items: [
                {
                    title: 'Traffic',
                    url: '/dashboard/publishers/traffics',
                },
                {
                    title: 'Syndicates',
                    url: '/dashboard/publishers/syndicates',
                },
            ],
        },
        {
            title: 'Reports',
            url: '#',
            icon: ChartNoAxesCombined,
            isActive: false,
            items: [
                {
                    title: 'No Inventory',
                    url: '/dashboard/reports/no-inventory',
                },
                {
                    title: 'All Ads List',
                    url: '/dashboard/reports/all-ads-list',
                },
                {
                    title: 'Active Ads List',
                    url: '/dashboard/reports/active-ads-list',
                },
                {
                    title: 'Ad Placement',
                    url: '/dashboard/reports/ad-placement',
                },
                {
                    title: 'Source Block',
                    url: '/dashboard/reports/source-block',
                },
                {
                    title: 'Source Placement',
                    url: '/dashboard/reports/source-placement',
                },
                {
                    title: 'Direct Job Bid',
                    url: '/dashboard/reports/direct-job-bid',
                },
                {
                    title: 'APIs',
                    url: '/dashboard/reports/api',
                },
                {
                    title: 'Traffic Campaign Volume',
                    url: '/dashboard/reports/traffic-campaign-volume',
                },
            ],
        },
    ],
    navSecondary: [
        {
            title: 'Users',
            url: '/dashboard/users',
            icon: Users,
        },
        {
            title: 'ACLs',
            url: '/dashboard/acls',
            icon: HatGlasses,
        },
        {
            title: 'Audit Logs',
            url: '/dashboard/audit-logs',
            icon: Logs,
        },
        {
            title: 'Settings',
            url: '/dashboard/settings',
            icon: Settings,
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarLogo />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} name="Platform" />
                <NavMain items={data.navSecondary} name="Setup" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}

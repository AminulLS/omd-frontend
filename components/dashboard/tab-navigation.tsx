"use client"

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export interface TabItem {
  value: string
  label: string
  href: string
}

interface TabNavigationProps {
  tabs: TabItem[]
  className?: string
}

export function TabNavigation({ tabs, className }: TabNavigationProps) {
  const pathname = usePathname()
  const activeTab = tabs.find(tab => pathname === tab.href)?.value || tabs[0]?.value

  return (
    <Tabs defaultValue={activeTab} value={activeTab}>
      <TabsList variant="line" className={cn(className)}>
        {tabs.map((tab) => {
          const isActive = pathname === tab.href
          return (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              asChild
              data-state={isActive ? 'active' : 'inactive'}
            >
              <Link href={tab.href}>{tab.label}</Link>
            </TabsTrigger>
          )
        })}
      </TabsList>
    </Tabs>
  )
}
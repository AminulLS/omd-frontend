import { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface TabConfig {
  value: string;
  label: string;
  content: ReactNode;
}

interface TabsViewProps {
  tabs: TabConfig[];
  defaultValue?: string;
  className?: string;
  tabsListClassName?: string;
  gridCols?: 2 | 3 | 4 | 5 | 6 | 7 | 8;
}

export function TabsView({ tabs, defaultValue, className = "mt-6", tabsListClassName, gridCols = 2 }: TabsViewProps) {
  const defaultTab = defaultValue || tabs[0]?.value;

  const gridColsClass = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
    7: "grid-cols-7",
    8: "grid-cols-8",
  }[gridCols];

  return (
    <Tabs defaultValue={defaultTab} className={className}>
      <TabsList className={`w-full max-w-md ${gridColsClass} ${tabsListClassName || ""}`}>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="space-y-4">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}

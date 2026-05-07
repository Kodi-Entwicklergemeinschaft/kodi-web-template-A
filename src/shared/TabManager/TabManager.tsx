import React from 'react';

import { useTranslation } from 'react-i18next';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type TabItem<TTranslation extends string> = {
  id: number;
  name: TTranslation;
};

type TabManagerProps<TTranslation extends string> = {
  tabs: TabItem<TTranslation>[];
  activeTab: TabItem<TTranslation>;
  setActiveTab: React.Dispatch<React.SetStateAction<TabItem<TTranslation>>>;
};

function TabManager<TTranslation extends string>({
  tabs,
  activeTab,
  setActiveTab,
}: TabManagerProps<TTranslation>) {
  const { t } = useTranslation();
  const handleValueChange = (value: string) => {
    const selectedTabData = tabs.find((tab) => tab.name === value)!;
    setActiveTab(selectedTabData);
  };

  return (
    <Tabs
      value={activeTab.name}
      onValueChange={handleValueChange}
      className="pt-4 pb-2 space-y-4"
    >
      <TabsList>
        {tabs.map((item) => (
          <TabsTrigger value={item.name} key={item.name} className="rounded-lg">
            {t(item.name)}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((item) => (
        <TabsContent value={item.name} key={item.name}>
          {/* whatever you show for this tab */}
          {/* e.g. <AllListingsTable /> / <PendingListings /> */}
        </TabsContent>
      ))}
    </Tabs>
  );
}

export default TabManager;

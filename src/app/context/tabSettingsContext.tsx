import React, { createContext, useContext, useState, type ReactNode } from 'react';

export type TabKey = 'feed' | 'future';

type ContextType = {
  currentTab: TabKey | null;
  setCurrentTab: (t: TabKey | null) => void;
};

const TabSettingsContext = createContext<ContextType | undefined>(undefined);

export function TabSettingsProvider({ children }: { children: ReactNode }) {
  const [currentTab, setCurrentTab] = useState<TabKey | null>(null);
  return (
    <TabSettingsContext.Provider value={{ currentTab, setCurrentTab }}>
      {children}
    </TabSettingsContext.Provider>
  );
}

export function useTabSettings() {
  const context = useContext(TabSettingsContext);
  if (!context) {
    throw new Error('useTabSettings must be used within a TabSettingsProvider');
  }
  return context;
}

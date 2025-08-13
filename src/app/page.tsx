"use client";
import React, { useState } from "react";
import LoginModal from "@/components/LoginModal";
import YoutubeFeed from "@/components/YoutubeFeed";
import { TabSettingsProvider, useTabSettings } from "@/app/context/tabSettingsContext";
import SettingsIcon from '@mui/icons-material/Settings';

function SettingsGear({ tab }: { tab: 'feed' | 'future' }) {
  const { currentTab, setCurrentTab } = useTabSettings();
  const toggle = () => {
    // toggle settings for the current tab
    setCurrentTab(currentTab === tab ? null : tab);
  };
  return (
    <button
      onClick={toggle}
      aria-label="Open settings for tab"
      className="p-2 rounded-full bg-[#313244] hover:bg-[#45475a]"
      title={`Settings for ${tab}`}
    >
      <SettingsIcon className="text-[#cdd6f4]" />
    </button>
  );
}

export default function Home() {
  const [tab, setTab] = useState<'feed' | 'future'>('feed');
  return (
    <TabSettingsProvider>
      <div className={`min-h-screen text-[#cdd6f4] ${tab === 'feed' ? 'bg-[#1e1e2e]' : 'bg-[#181825]'}`}>
        <header className={`pt-4 pb-0 px-4 flex justify-between items-center ${tab === 'feed' ? 'bg-[#1e1e2e]' : 'bg-[#181825]'}`}>
          <nav className="flex space-x-4 relative z-10">
            <button
              onClick={() => setTab('feed')}
              className={`px-4 py-2 rounded-t-md border border-[#313244] ${tab === 'feed' ? "bg-[#1e1e2e] text-[#cdd6f4] border-b-transparent" : "bg-[#181825] text-[#7f849c]"}`}
            >
              YouTube Feed
            </button>
            <button
              onClick={() => setTab('future')}
              className={`px-4 py-2 rounded-t-md border border-[#181825] ${tab === 'future' ? "bg-[#181825] text-[#cdd6f4] border-b-transparent" : "bg-[#181825] text-[#7f849c]"}`}
            >
              Future
            </button>
          </nav>
          <div className="flex items-center gap-2">
            <SettingsGear tab={tab} />
            <LoginModal />
          </div>
        </header>
        <main className={`p-0 bg-opacity-0 mt-[-1px] ${tab === 'feed' ? 'bg-[#1e1e2e] border border-[#313244] border-t-transparent' : 'bg-[#181825] border border-[#181825] border-t-transparent'}`}>
          {tab === 'feed' ? (
            <YoutubeFeed />
          ) : (
            <div className="p-10">
              <h1 className="text-3xl">Coming Soon</h1>
            </div>
          )}
        </main>
      </div>
    </TabSettingsProvider>
  );
}

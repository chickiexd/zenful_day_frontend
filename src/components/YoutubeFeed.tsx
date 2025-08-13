import React, { useMemo, useState } from "react";
import type { Video } from "@/constants/video";
import VideoGroup from "./VideoGroup";
import { useVideos } from "@/hooks/useVideos";
import { syncYoutubeFeed, markVideoAsSeen } from "@/services/api/videos";
import { useTabSettings } from "@/app/context/tabSettingsContext";
import YoutubeFeedSettings from "./YoutubeFeedSettings";

export default function YoutubeFeed() {
  const { videos, loading, error, refetch, removeVideo } = useVideos();
  const [syncing, setSyncing] = useState(false);
  const { currentTab } = useTabSettings();
  const showSettings = currentTab === 'feed';

  const groupedVideos = useMemo(() => {
    return videos.reduce<Record<string, Video[]>>((groups, video) => {
      const groupName = video.group;
      if (!groups[groupName]) groups[groupName] = [];
      groups[groupName].push(video);
      return groups;
    }, {} as Record<string, Video[]>);
  }, [videos]);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await syncYoutubeFeed();
      await refetch();
    } catch {
      alert("Failed to sync videos. Please try again.");
    }
    setSyncing(false);
  };

  const handleMarkGroupAsSeen = async (group: string) => {
    const groupVideos = groupedVideos[group] || [];
    try {
      await Promise.all(groupVideos.map((v) => markVideoAsSeen(v.id)));
      groupVideos.forEach((v) => removeVideo(v.id));
    } catch {
      alert(`Failed to mark all videos in ${group}.`);
    }
  };

  const handleMarkAllAsSeen = async () => {
    try {
      await Promise.all(videos.map((v) => markVideoAsSeen(v.id)));
      videos.forEach((v) => removeVideo(v.id));
    } catch {
      alert("Failed to mark all videos.");
    }
  };

  if (showSettings) {
    return <YoutubeFeedSettings />;
  }

  return (
    <div className="bg-[#1e1e2e] min-h-screen p-10 text-[#cdd6f4]">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-bold">YouTube Feed</h1>
        <div className="flex items-center gap-4"></div>
      </div>
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleSync}
          disabled={syncing}
          className="bg-[#89b4fa] hover:bg-[#74a8fc] text-[#1e1e2e] font-bold px-4 py-2 rounded"
        >
          {syncing ? "Syncing..." : "Sync Videos"}
        </button>
        <button
          onClick={handleMarkAllAsSeen}
          disabled={videos.length === 0}
          className="bg-[#a6e3a1] hover:bg-[#94e2d5] text-[#1e1e2e] font-bold px-4 py-2 rounded"
        >
          Mark All As Seen
        </button>
      </div>

      {loading && <p>Loading videos...</p>}
      {error && <p className="text-[#f38ba8]">Failed to load videos</p>}

      {!loading && !error && (
        Object.entries(groupedVideos).length === 0 ? (
          <p>No videos available.</p>
        ) : (
          Object.entries(groupedVideos).map(([group, vids]) => (
            <section key={group} className="mb-10">
              <VideoGroup
                group={group}
                videos={vids}
                onMarkGroupAsSeen={handleMarkGroupAsSeen}
                onVideoSeen={removeVideo}
              />
            </section>
          ))
        )
      )}
    </div>
  );
}

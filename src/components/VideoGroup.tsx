import React from "react";
import VideoCard from "./VideoCard";
import type { Video } from "@/constants/video";

interface VideoGroupProps {
  group: string;
  videos: Video[];
  onMarkGroupAsSeen?: (group: string) => void;
  onVideoSeen?: (id: string) => void;
}

export default function VideoGroup({ group, videos, onMarkGroupAsSeen, onVideoSeen }: VideoGroupProps) {
  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-5 border-b-2 border-[#f9e2af] pb-2">
        <h2 className="text-3xl font-bold capitalize text-[#cdd6f4] mb-2 border-[#f9e2af] pb-1">{group}</h2>
        {onMarkGroupAsSeen && (
          <button
            onClick={() => onMarkGroupAsSeen(group)}
            className="bg-[#45475a] hover:bg-[#585b70] text-[#cdd6f4] font-semibold px-4 py-2 rounded"
          >
            Mark {group} as Seen
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-5">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} onSeen={onVideoSeen} />
        ))}
      </div>
    </section>
  );
}

import React from "react";
import Image from "next/image";
import type { Video } from "@/constants/video";
import { markVideoAsSeen } from "@/services/api/videos";

interface VideoCardProps {
  video: Video;
  onSeen?: (id: string) => void;
}

export default function VideoCard({ video, onSeen }: VideoCardProps) {
  const onMarkAsSeen = async () => {
    try {
      await markVideoAsSeen(video.id);
      onSeen?.(video.id);
    } catch (error) {
      console.error("Failed to mark video as seen:", error);
      alert("Could not mark video as seen. Please try again.");
    }
  };

  return (
    <div className="bg-[#313244] rounded overflow-hidden shadow-lg flex flex-col w-72">
      <a href={video.link} target="_blank" rel="noopener noreferrer" className="flex-1 flex flex-col">
        <Image
          src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
          alt={video.title}
          width={320}
          height={180}
          className="w-full object-cover aspect-video"
        />
        <div className="p-3 flex flex-col gap-1">
          <p className="text-sm font-semibold text-[#f5c2e7] m-0">{video.channel}</p>
          <h3 className="text-base font-semibold text-[#8aadf4] m-0">{video.title}</h3>
        </div>
      </a>
      <button
        onClick={onMarkAsSeen}
        className="bg-[#45475a] hover:bg-[#585b70] text-[#cdd6f4] font-semibold py-2"
      >
        Mark as Seen
      </button>
    </div>
  );
}

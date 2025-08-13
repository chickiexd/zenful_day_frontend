"use client";
import React from "react";
import type { Video } from "@/constants/video";
import Image from "next/image";

interface VideosListProps {
  videos: Video[];
}

export default function VideosList({ videos }: VideosListProps) {
  const grouped = videos.reduce(
    (acc, video) => {
      acc[video.group] = acc[video.group] ?? [];
      acc[video.group].push(video);
      return acc;
    },
    {} as Record<string, Video[]>,
  );

  return (
    <div className="p-4">
      {Object.entries(grouped).map(([group, vids]) => (
        <div key={group} className="mb-6">
          <h2 className="text-xl text-[#cdd6f4] font-semibold mb-2">{group}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vids.map((v) => (
              <div key={v.id} className="bg-[#45475a] p-4 rounded">
                <h3 className="text-lg mb-2">{v.title}</h3>
                <Image
                  src={`https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`}
                  alt={v.title}
                  unoptimized
                  className="w-full h-48 object-cover rounded"
                />
                <a
                  href={`https://www.youtube.com/watch?v=${v.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-2 text-[#89b4fa] hover:underline"
                >
                  Watch
                </a>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

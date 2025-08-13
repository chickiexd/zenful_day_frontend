import { useEffect, useState } from "react";
import { apiClient } from "@/services/api/client";
import type { Video } from "@/constants/video";

interface YoutubeVideoResponse {
  video_id: number;
  title: string;
  channel_name: string;
  channel_id: number;
  channel_group_id: number;
  channel_group_name: string;
  link: string;
}

/* eslint-disable @typescript-eslint/no-explicit-any */

export function useVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<YoutubeVideoResponse[]>("/youtube/unseen");
      const mapped: Video[] = res.data.map((v) => {
        const urlObj = new URL(v.link);
        const vid = urlObj.searchParams.get('v') || '';
        return {
          id: v.video_id.toString(),
          title: v.title,
          youtubeId: vid,
          group: v.channel_group_name,
          channel: v.channel_name,
          link: v.link,
        };
      });
      setVideos(mapped);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Remove video locally after marking as seen
  const removeVideo = (id: string) => setVideos((vs) => vs.filter((v) => v.id !== id));

  useEffect(() => {
    fetchVideos();
  }, []);

  return { videos, loading, error, refetch: fetchVideos, removeVideo };
}

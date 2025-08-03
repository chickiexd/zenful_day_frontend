import React, { useMemo } from "react";
import VideoGroup from "./VideoGroup";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Video } from "@/features/Youtube/types";
import { markVideoAsSeen, syncYoutubeFeed } from "@/features/Youtube/api";
import { useAppDispatch } from "@/hooks";

export default function Youtubefeed() {
  const videos = useSelector((state: RootState) => state.youtube.videos);
  const dispatch = useAppDispatch();

  const groupedVideos = useMemo(() => {
    return videos.reduce<Record<string, Video[]>>((groups, video) => {
      const groupName = video.group;
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(video);
      return groups;
    }, {});
  }, [videos]);

  const handleMarkGroupAsSeen = async (group: string) => {
    const groupVideos = groupedVideos[group];
    if (!groupVideos || groupVideos.length === 0) return;
    try {
      await Promise.all(
        groupVideos.map((video) =>
          dispatch(markVideoAsSeen(video.video_id)).unwrap(),
        ),
      );
      console.log(`All videos in group '${group}' marked as seen!`);
    } catch (error) {
      console.error(
        `Failed to mark some or all videos in group '${group}' as seen`,
        error,
      );
      alert(
        `Failed to mark all videos in group '${group}' as seen. Please try again.`,
      );
    }
  };

  const handleMarkAllAsSeen = async () => {
    if (videos.length === 0) return;

    try {
      await Promise.all(
        videos.map((video) =>
          dispatch(markVideoAsSeen(video.video_id)).unwrap(),
        ),
      );
      console.log(`All videos marked as seen!`);
    } catch (error) {
      console.error("Failed to mark all videos as seen", error);
      alert("Failed to mark all videos as seen. Please try again.");
    }
  };

  const handleSync = async () => {
    try {
      await dispatch(syncYoutubeFeed()).unwrap();
      console.log("Sync complete");
    } catch (error) {
      console.error("Sync failed", error);
      alert("Failed to sync videos. Please try again.");
    }
  };

  return (
    <main
      style={{
        backgroundColor: "#1e1e2e",
        minHeight: "100vh",
        padding: "40px 60px",
        color: "#cdd6f4",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 40,
        }}
      >
        <h1 style={{ fontSize: 36, fontWeight: "700", margin: 0 }}>
          YouTube Feed
        </h1>
        <button
          onClick={handleSync}
          style={{
            backgroundColor: "#959ca4",
            color: "white",
            border: "none",
            borderRadius: 6,
            padding: "10px 18px",
            fontSize: 16,
            fontWeight: "bold",
            userSelect: "none",
            transition: "background-color 0.3s ease",
          }}
          title="Sync videos from server"
        >
          Sync Videos
        </button>
        <button
          onClick={handleMarkAllAsSeen}
          disabled={videos.length === 0}
          style={{
            backgroundColor: "#f28fad",
            color: "white",
            border: "none",
            borderRadius: 6,
            padding: "10px 18px",
            fontSize: 16,
            fontWeight: "bold",
            cursor: videos.length === 0 ? "not-allowed" : "pointer",
            userSelect: "none",
            transition: "background-color 0.3s ease",
          }}
          title={
            videos.length === 0
              ? "No videos to mark as seen"
              : "Mark all videos as seen"
          }
        >
          Mark All As Seen
        </button>
      </div>

      {Object.entries(groupedVideos).length === 0 ? (
        <p>No videos available.</p>
      ) : (
        Object.entries(groupedVideos).map(([group, videos]) => (
          <VideoGroup
            key={group}
            group={group}
            videos={videos}
            onMarkGroupAsSeen={() => handleMarkGroupAsSeen(group)}
          />
        ))
      )}
    </main>
  );
}

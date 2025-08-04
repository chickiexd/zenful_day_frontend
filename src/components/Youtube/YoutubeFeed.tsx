import React, { useMemo, useState } from "react";
import VideoGroup from "./VideoGroup";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Video } from "@/features/Youtube/types";
import {
  fetchYoutubeFeed,
  markVideoAsSeen,
  syncYoutubeFeed,
} from "@/features/Youtube/api";
import { useAppDispatch } from "@/hooks";
import { Button, CircularProgress } from "@mui/material";

export default function Youtubefeed() {
  const videos = useSelector((state: RootState) => state.youtube.videos);
  const dispatch = useAppDispatch();

  const [syncing, setSyncing] = useState(false);

  const groupedVideos = useMemo(() => {
    return videos.reduce<Record<string, typeof videos>>((groups, video) => {
      const groupName = video.group;
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(video);
      return groups;
    }, {});
  }, [videos]);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await dispatch(syncYoutubeFeed()).unwrap();
      await dispatch(fetchYoutubeFeed()).unwrap();
    } catch (error) {
      alert("Failed to sync videos. Please try again.");
    }
    setSyncing(false);
  };

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

        {/* MUI Button with spinner */}
        <Button
          variant="contained"
          onClick={handleSync}
          disabled={syncing}
          sx={{
            backgroundColor: "#959ca4",
            color: "white",
            fontWeight: "bold",
            fontSize: 16,
            borderRadius: 1,
            textTransform: "none",
            minWidth: 120,
            "&:hover": {
              backgroundColor: "#7a8289",
            },
          }}
        >
          {syncing ? (
            <>
              Syncing...
              <CircularProgress
                size={18}
                sx={{ color: "white", marginLeft: 1 }}
              />
            </>
          ) : (
            "Sync Videos"
          )}
        </Button>
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

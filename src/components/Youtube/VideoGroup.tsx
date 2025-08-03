// components/VideoGroup.tsx
import React from "react";
import VideoCard from "./VideoCard";
import { Video } from "@/features/Youtube/types";

interface VideoGroupProps {
  group: string;
  videos: Video[];
  onMarkGroupAsSeen?: (group: string) => void;
}

const VideoGroup: React.FC<VideoGroupProps> = ({ group, videos, onMarkGroupAsSeen }) => {
  return (
    <section style={{ marginBottom: 40 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
          borderBottom: "2px solid #f9e2af", // yellow
          paddingBottom: 6,
          gap: 10,
        }}
      >
        <h2
          style={{
            color: "#f9e2af", // yellow
            fontSize: 24,
            fontWeight: 700,
            textTransform: "capitalize",
            margin: 0,
            flexGrow: 1,
          }}
        >
          {group}
        </h2>

        {onMarkGroupAsSeen && (
          <button
            onClick={() => onMarkGroupAsSeen(group)}
            style={{
              backgroundColor: "#45475a", // surface2
              border: "none",
              borderRadius: 6,
              padding: "6px 14px",
              cursor: "pointer",
              color: "#cdd6f4", // text
              fontWeight: "600",
              fontSize: 14,
              transition: "background-color 0.25s ease",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) =>
              ((e.target as HTMLButtonElement).style.backgroundColor = "#585b70")
            }
            onMouseLeave={(e) =>
              ((e.target as HTMLButtonElement).style.backgroundColor = "#45475a")
            }
            type="button"
          >
            Mark {group} as Seen
          </button>
        )}
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 20,
        }}
      >
        {videos.map((video) => (
          <VideoCard key={video.video_id} video={video} />
        ))}
      </div>
    </section>
  );
};

export default VideoGroup;

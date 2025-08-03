import React from "react";
import { Video } from "@/features/Youtube/types";
import { markVideoAsSeen } from "@/features/Youtube/api";
import { useAppDispatch } from "@/hooks";

interface VideoCardProps {
  video: Video;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const dispatch = useAppDispatch();

  let videoId: string | null = null;
  try {
    const url = new URL(video.link);
    videoId = url.searchParams.get("v");
  } catch {
    videoId = null;
  }
  const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  const onMarkAsSeen = async (videoId: string) => {
    try {
      await dispatch(markVideoAsSeen(videoId)).unwrap();
      console.log(`Video ${videoId} marked as seen`);
    } catch (error) {
      console.error("Failed to mark video as seen:", error);
      alert("Could not mark video as seen. Please try again.");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#313244", // surface1
        borderRadius: 8,
        overflow: "hidden",
        color: "#cdd6f4", // text
        boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
        display: "flex",
        flexDirection: "column",
        width: 280,
      }}
    >
      <a
        href={video.link}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none", color: "inherit", flex: "1 1 auto" }}
      >
        <img
          src={thumbnail}
          alt={video.title}
          style={{ width: "100%", objectFit: "cover", aspectRatio: "16 / 9" }}
        />

        <div
          style={{
            padding: 12,
            paddingTop: 8,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <p
            style={{
              fontSize: 13,
              color: "#f5c2e7", // pink for channel name
              margin: 0,
              fontWeight: 600,
            }}
          >
            {video.channel}
          </p>

          <h3
            style={{
              fontSize: 16,
              fontWeight: "600",
              margin: 0,
              color: "#8aadf4", // blue
            }}
          >
            {video.title}
          </h3>
        </div>
      </a>
      <button
        onClick={() => onMarkAsSeen(video.video_id)}
        style={{
          backgroundColor: "#45475a", // surface2
          border: "none",
          borderTop: "1px solid #6c7086",
          cursor: "pointer",
          padding: "10px 0",
          color: "#cdd6f4",
          fontWeight: "600",
          fontSize: 14,
          transition: "background-color 0.25s ease",
        }}
        onMouseEnter={(e) =>
          ((e.target as HTMLButtonElement).style.backgroundColor = "#585b70")
        }
        onMouseLeave={(e) =>
          ((e.target as HTMLButtonElement).style.backgroundColor = "#45475a")
        }
        type="button"
      >
        Mark as Seen
      </button>
    </div>
  );
};

export default VideoCard;

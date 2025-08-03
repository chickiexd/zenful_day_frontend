import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Video } from "./types";
import { fetchYoutubeFeed, markVideoAsSeen, syncYoutubeFeed } from "./api";

interface YoutubeState {
  videos: Video[];
  loading: boolean;
  error: string | null;
}

const initialState: YoutubeState = {
  videos: [],
  loading: false,
  error: null,
};

export const youtubeSlice = createSlice({
  name: "youtube",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchYoutubeFeed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchYoutubeFeed.fulfilled,
        (state, action: PayloadAction<Video[]>) => {
          state.videos = action.payload;
          state.loading = false;
        },
      )
      .addCase(fetchYoutubeFeed.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch videos";
      })
      .addCase(syncYoutubeFeed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(syncYoutubeFeed.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(syncYoutubeFeed.rejected, (state, action) => {
        state.loading = false;
        state.error = "Failed to sync YouTube feed";
      })
      .addCase(markVideoAsSeen.fulfilled, (state, action) => {
        const videoId = action.meta.arg;
        state.videos = state.videos.filter(
          (video) => video.video_id !== videoId,
        );
      })
      .addCase(markVideoAsSeen.rejected, (state) => {
        state.error = "Failed to mark video as seen";
      });
  },
});

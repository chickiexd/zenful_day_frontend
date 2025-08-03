import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Video } from "./types";
import { API_URL } from "@/config/api_config";

export const fetchYoutubeFeed = createAsyncThunk<Video[]>(
  "youtube/fetchYoutubeFeed",
  async () => {
    try {
      console.log("API URL:", API_URL);
      console.log(
        "Fetching YouTube feed from:",
        `${API_URL}/v1/youtube/unseen`,
      );
      const response = await axios.get(`${API_URL}/v1/youtube/unseen`);
      console.log("Fetched YouTube feed:", response.data);
      const videos: Video[] = response.data.map((video: any) => ({
        video_id: video.video_id,
        title: video.title,
        channel: video.channel_name,
        group: video.channel_group_name,
        channel_id: video.channel_id,
        group_id: video.channel_group_id,
        link: video.link,
      }));
      return videos;
    } catch (error) {
      console.error("Error fetching videos:", error);
      return [];
    }
  },
);

export const syncYoutubeFeed = createAsyncThunk(
  "youtube/syncYoutubeFeed",
  async () => {
    try {
      const response = await axios.post(`${API_URL}/v1/youtube/sync`);
      return response.data;
    } catch (error) {
      console.error("Error syncing YouTube feed:", error);
      throw error;
    }
  },
);

export const markVideoAsSeen = createAsyncThunk(
  "youtube/markVideoAsSeen",
  async (videoId: string) => {
    try {
      const response = await axios.post(
        `${API_URL}/v1/youtube/${videoId}/status`,
      );
      return response.data;
    } catch (error) {
      console.error("Error marking video as seen:", error);
      throw error;
    }
  },
);

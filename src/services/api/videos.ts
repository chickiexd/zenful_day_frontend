/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/services/api/client";

export type CreateYoutubeChannelRequest = {
  ChannelID: string; // channel_id
  ChannelName: string; // channel_name
  ChannelGroupID: number; // channel_group_id
}

export type YoutubeChannelResponse = {
  channel_id: number;
  channel_uid: string;
  channel_name: string;
  channel_group_id: number;
}

export type YoutubeSubscriptionResponse = {
  channel_id: number;
  subscribed: boolean;
}

export async function markVideoAsSeen(videoId: string) {
  await apiClient.post(`/youtube/${videoId}/status`, { status: "seen" });
}

export async function syncYoutubeFeed() {
  await apiClient.post(`/youtube/sync`);
}

// Create a new Youtube channel on the backend
export async function createYoutubeChannel(req: CreateYoutubeChannelRequest) {
  const payload = {
    channel_id: req.ChannelID,
    channel_name: req.ChannelName,
    channel_group_id: req.ChannelGroupID,
  };
  await apiClient.post(`/youtube/channel`, payload);
}

// Get existing channel groups from backend (best effort; optional)
export async function getYoutubeChannelGroups() {
  // This endpoint may not exist on your backend; adjust if needed
  const res = await apiClient.get<any>(`/youtube/channel_groups`);
  return res.data as any[];
}

// Get existing channels from backend
export async function getYoutubeChannels() {
  const res = await apiClient.get<YoutubeChannelResponse[]>(`/youtube/channels`);
  return res.data;
}

// Get existing channel subscriptions
export async function getYoutubeSubscriptions() {
  const res = await apiClient.get<YoutubeSubscriptionResponse[]>(`/youtube/subscriptions`);
  return res.data;
}

// Update a channel subscription status
export async function setChannelSubscription(channelId: number, subscribe: boolean) {
  await apiClient.post(`/youtube/channel/${channelId}/subscription`, { subscribe });
}


import React, { useEffect, useState } from 'react';
import { getYoutubeChannelGroups, createYoutubeChannel, CreateYoutubeChannelRequest } from '@/services/api/videos';

type ChannelGroup = {
  channel_group_id: number;
  channel_group_name: string;
  channel_group_description: string;
};

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function YoutubeAddChannelForm() {
  const [groups, setGroups] = useState<ChannelGroup[]>([]);
  const [query, setQuery] = useState('');
  const [input, setInput] = useState<{ channelId: string; channelName: string; channelGroupId: string }>({ channelId: '', channelName: '', channelGroupId: '' });
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const loaded = await getYoutubeChannelGroups();
        if (mounted) setGroups(loaded as any);
      } catch (e) {
        console.error('Failed to load channel groups', e);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const filtered = groups.filter((g) =>
    g.channel_group_name.toLowerCase().includes(query.toLowerCase()) ||
    g.channel_group_description.toLowerCase().includes(query.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.channelId || !input.channelName || !input.channelGroupId) {
      setStatus('Please fill in all fields.');
      return;
    }
    try {
      await createYoutubeChannel({
        ChannelID: input.channelId,
        ChannelName: input.channelName,
        ChannelGroupID: Number(input.channelGroupId),
      } as CreateYoutubeChannelRequest);
      setStatus('Channel added successfully.');
      setInput({ channelId: '', channelName: '', channelGroupId: '' });
    } catch (err) {
      setStatus('Failed to add channel.');
      console.error(err);
    }
  };

  return (
    <div className="bg-[#1e1e2e] min-h-screen p-6 text-[#cdd6f4]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Add Youtube Channel</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm mb-1">Channel ID</label>
          <input
            value={input.channelId}
            onChange={(e) => setInput((s) => ({ ...s, channelId: e.target.value }))}
            className="w-full p-2 rounded border text-[#cdd6f4] placeholder-[#7f849c]"
            placeholder="Enter channel ID"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Channel Name</label>
          <input
            value={input.channelName}
            onChange={(e) => setInput((s) => ({ ...s, channelName: e.target.value }))}
            className="w-full p-2 rounded border text-[#cdd6f4] placeholder-[#7f849c]"
            placeholder="Enter channel name"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Channel Group</label>
          <input
            placeholder="Search groups"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-2 rounded border text-[#cdd6f4] placeholder-[#7f849c] mb-2"
          />
          <select
            value={input.channelGroupId}
            onChange={(e) => setInput((s) => ({ ...s, channelGroupId: e.target.value }))}
            className="w-full p-2 rounded border text-[#cdd6f4]"
          >
            <option value="">Select a group</option>
            {filtered.map((g) => (
              <option key={g.channel_group_id} value={String(g.channel_group_id)}>
                {g.channel_group_name} — {g.channel_group_description}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="px-4 py-2 bg-[#a6e3a1] hover:bg-[#94e2d5] text-[#1e1e2e] font-bold rounded">Add Channel</button>
      </form>
      {status && <p className="mt-2 text-sm text-[#cce3ff]">{status}</p>}
    </div>
  );
}

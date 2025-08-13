import React, { useEffect, useState } from "react";
import {
  getYoutubeChannels,
  getYoutubeSubscriptions,
} from "@/services/api/videos";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";

type Channel = {
  channel_id: number;
  channel_name: string;
};

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function YoutubeChannelSubscriptions() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [subs, setSubs] = useState<
    { channel_id: number; subscribed: boolean }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const all = await getYoutubeChannels();
        const s = await getYoutubeSubscriptions();

        setChannels(all as Channel[]);

        // build a Set of subscribed channel ids (as strings)
        const subsSet = new Set<string>(s.map((r) => String(r.channel_id)));

        const merged = (all as Channel[]).map((c) => ({
          channel_id: c.channel_id,
          subscribed: subsSet.has(String(c.channel_id)),
        }));

        setSubs(merged);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const toggle = async (id: number) => {
    const current = subs.find((s) => s.channel_id === id);
    const next = !(current?.subscribed ?? false);
    try {
      const res = await fetch(`/api/youtube/channel/${id}/subscription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscribe: next }),
      });
      if (!res.ok) {
        throw new Error('Failed to update subscription');
      }
      setSubs((prev) => prev.map((s) => (s.channel_id === id ? { ...s, subscribed: next } : s)));
    } catch (e) {
      console.error(e);
    }
  };

  // New: global bulk operation (for current filtered set)
  const bulkToggle = async (subscribeAll: boolean) => {
    setBulkLoading(true);
    try {
      const visible = channels.filter(c => c.channel_name.toLowerCase().includes(searchQuery.toLowerCase()));
      const promises = visible.map((c) => {
        const s = subs.find((ss) => ss.channel_id === c.channel_id);
        if (s?.subscribed === subscribeAll) return Promise.resolve(null as any);
        return fetch(`/api/youtube/channel/${c.channel_id}/subscription`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subscribe: subscribeAll }),
        });
      });
      await Promise.all(promises);
      setSubs((prev) => prev.map((s) => {
        // Only update visible ones for accuracy
        const isVisible = visible.find(v => v.channel_id === s.channel_id);
        if (isVisible) return { ...s, subscribed: subscribeAll };
        return s;
      }));
    } catch (e) {
      console.error(e);
    } finally {
      setBulkLoading(false);
    }
  };

  if (loading) return <div>Loading channels...</div>;
  // derive filtered channels based on searchQuery (for display and bulk scope)
  const filteredChannels = channels.filter((c) =>
    c.channel_name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredSubs = subs.filter((s) =>
    filteredChannels.some((fc) => fc.channel_id === s.channel_id)
  );

  // Header with bulk switch on far right of top bar
  const topHeader = (
    <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', gap: 12, alignItems: 'center', margin: '8px 0' }}>
      <span>Bulk Subscribe</span>
      <span style={{ marginRight: 6 }}>{filteredSubs.filter((s) => s.subscribed).length} / {filteredSubs.length} subscribed</span>
      <Switch
        checked={filteredSubs.every((s) => s.subscribed)}
        onChange={e => bulkToggle(e.target.checked)}
        color="primary"
        disabled={bulkLoading}
      />
    </div>
  );

  return (
    <div>
      <h2>YouTube Channels</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '8px 0', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span>Search</span>
          <input
            type="text"
            placeholder="Search channels..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ padding: '8px', borderRadius: 4, border: '1px solid #ccc', width: 240 }}
          />
        </div>
        {topHeader}
      </div>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {filteredChannels.map((c) => {
          const sub = filteredSubs.find((s) => s.channel_id === c.channel_id);
          const subscribed = sub?.subscribed ?? false;
          return (
            <li
              key={c.channel_id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 0",
                borderBottom: "1px solid #eee",
              }}
            >
              <span>{c.channel_name}</span>
              <FormControlLabel
                control={
                  <Switch
                    checked={subscribed}
                    onChange={() => toggle(c.channel_id)}
                    color="primary"
                  />
                }
                label={""}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

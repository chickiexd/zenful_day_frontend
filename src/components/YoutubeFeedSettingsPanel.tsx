import React from 'react';
import YoutubeAddChannelForm from './YoutubeAddChannelForm';
import YoutubeChannelSubscriptions from './YoutubeChannelSubscriptions';

export default function YoutubeFeedSettingsPanel() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
      <YoutubeAddChannelForm />
      <YoutubeChannelSubscriptions />
    </div>
  );
}

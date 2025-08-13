import React from 'react';
import YoutubeAddChannelForm from '../../components/YoutubeAddChannelForm';
import YoutubeChannelSubscriptions from '../../components/YoutubeChannelSubscriptions';

export default function YoutubeFeedSettings() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
      <YoutubeAddChannelForm />
      <YoutubeChannelSubscriptions />
    </div>
  );
}

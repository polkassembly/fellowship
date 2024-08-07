// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { CHANNEL, INetworkPreferences } from '@/global/types';
import EmailNotificationCard from './EmailNotificationCard';
import BotChannelsCard from './BotChannelsCard';

export default function NotificationChannels({
	toggleChannelPreferences,
	networkPreferences
}: {
	toggleChannelPreferences: (channel: CHANNEL, enabled: boolean) => void;
	networkPreferences: INetworkPreferences;
}) {
	return (
		<div>
			<EmailNotificationCard
				email={networkPreferences?.channelPreferences?.[CHANNEL.EMAIL]?.handle || ''}
				isEmailVerified={networkPreferences?.channelPreferences?.[CHANNEL.EMAIL]?.verified || false}
				notificationEnabled={networkPreferences?.channelPreferences?.[CHANNEL.EMAIL]?.enabled || false}
				toggleChannelPreferences={toggleChannelPreferences}
			/>
			<BotChannelsCard />
		</div>
	);
}

// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { CHANNEL, INetworkPreferences } from '@/global/types';
import nextApiClientFetch from '@/utils/nextApiClientFetch';
import { useApiContext } from '@/contexts';
import EmailNotificationCard from './EmailNotificationCard';
import BotChannelsCard from './BotChannelsCard';

export default function NotificationChannels({
	toggleChannelPreferences,
	networkPreferences
}: Readonly<{
	toggleChannelPreferences: (channel: CHANNEL, enabled: boolean) => void;
	networkPreferences: INetworkPreferences;
}>) {
	const { network } = useApiContext();

	// eslint-disable-next-line consistent-return
	const resetChannelPreferences = async (channel: CHANNEL) => {
		try {
			const { data, error } = (await nextApiClientFetch({
				url: 'api/v1/auth/actions/resetChannelNotification',
				data: {
					channel
				},
				network,
				isPolkassemblyAPI: true
			})) as { data: { message: string }; error: string | null };
			if (error || !data.message) {
				throw new Error(error ?? '');
			}

			return true;
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<div>
			<EmailNotificationCard
				email={networkPreferences?.channelPreferences?.[CHANNEL.EMAIL]?.handle ?? ''}
				isEmailVerified={networkPreferences?.channelPreferences?.[CHANNEL.EMAIL]?.verified || false}
				notificationEnabled={networkPreferences?.channelPreferences?.[CHANNEL.EMAIL]?.enabled || false}
				toggleChannelPreferences={toggleChannelPreferences}
			/>
			<BotChannelsCard
				toggleChannelPreferences={toggleChannelPreferences}
				networkPreferences={networkPreferences}
				handleReset={resetChannelPreferences}
			/>
		</div>
	);
}

// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import React from 'react';
import ActivityFeed from '@/components/Home/ActivityFeed';
import ActivitySelectorCard from '@/components/Home/ActivitySelectorCard';
import { EActivityFeed, ActivityFeedItem, Network } from '@/global/types';

interface Props {
	feedItems: ActivityFeedItem[];
	feed: EActivityFeed;
	network: Network;
	originUrl: string;
}

export default function ActivityClientWrapper({ feedItems, feed, network, originUrl }: Props) {
	return (
		<div className='flex w-full flex-col gap-y-8'>
			<ActivitySelectorCard value={feed} />
			<ActivityFeed items={feedItems} />
		</div>
	);
}

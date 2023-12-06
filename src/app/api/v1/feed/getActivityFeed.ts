// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { API_ERROR_CODE } from '@/global/constants/errorCodes';
import { ClientError } from '@/global/exceptions';
import MESSAGES from '@/global/messages';
import { ActivityFeedItem, EActivityFeed, Network, PostListingItem } from '@/global/types';

interface Args {
	feedType: EActivityFeed;
	originUrl: string;
	page?: number;
	network?: Network;
}

export default async function getActivityFeed({ feedType, originUrl, page = 1, network }: Args) {
	const feedRes = await fetch(`${originUrl}/api/v1/feed${feedType === EActivityFeed.ALL ? '/all/' : '/'}`, {
		headers: {
			'x-network': network || ''
		},
		body: JSON.stringify({ feedType, page }),
		method: 'POST'
	}).catch((e) => {
		throw new ClientError(`${MESSAGES.API_FETCH_ERROR} - ${e?.message}`, API_ERROR_CODE.API_FETCH_ERROR);
	});

	if (feedType === EActivityFeed.ALL) return (await feedRes.json()) as ActivityFeedItem[];

	return (await feedRes.json()) as PostListingItem[];
}

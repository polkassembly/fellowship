// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { API_ERROR_CODE } from '@/global/constants/errorCodes';
import { ClientError } from '@/global/exceptions';
import MESSAGES from '@/global/messages';
import { Network, PostFeedListingItem } from '@/global/types';
import fetchPonyfill from 'fetch-ponyfill';

const { fetch: fetchPF } = fetchPonyfill();

interface Args {
	originUrl: string;
	page?: number;
	network?: Network;
}

export default async function getInductionsFeed({ originUrl, page = 1, network }: Args) {
	const feedRes = await fetchPF(`${originUrl}/api/v1/feed/inductions`, {
		headers: {
			'x-network': network || ''
		},
		body: JSON.stringify({ page }),
		method: 'POST'
	}).catch((e) => {
		throw new ClientError(`${MESSAGES.API_FETCH_ERROR} - ${e}`, API_ERROR_CODE.API_FETCH_ERROR);
	});

	return (await feedRes.json()) as PostFeedListingItem[];
}

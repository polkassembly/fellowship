// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { API_ERROR_CODE } from '@/global/constants/errorCodes';
import { ClientError } from '@/global/exceptions';
import MESSAGES from '@/global/messages';
import { EProfileProposals, Network, PayoutListingItem, PostFeedListingItem } from '@/global/types';
import fetchPonyfill from 'fetch-ponyfill';

const { fetch: fetchPF } = fetchPonyfill();

interface Args {
	profileProposalsType: EProfileProposals;
	originUrl: string;
	page?: number;
	network?: Network;
	address: string;
}

export default async function getProfileProposals({ profileProposalsType, originUrl, page = 1, network, address }: Args) {
	const feedRes = await fetchPF(`${originUrl}/api/v1/address/${address}/proposals`, {
		headers: {
			'x-network': network || ''
		},
		body: JSON.stringify({ profileProposalsType, page }),
		method: 'POST'
	}).catch((e) => {
		throw new ClientError(`${MESSAGES.API_FETCH_ERROR} - ${e?.message}`, API_ERROR_CODE.API_FETCH_ERROR);
	});

	const feedItems: (PostFeedListingItem | PayoutListingItem)[] = await feedRes.json();

	return feedItems;
}

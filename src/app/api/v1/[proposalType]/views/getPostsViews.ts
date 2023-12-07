// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { API_ERROR_CODE } from '@/global/constants/errorCodes';
import { ClientError } from '@/global/exceptions';
import MESSAGES from '@/global/messages';
import { Network, PostIdWithViews, ProposalType } from '@/global/types';

import fetchPonyfill from 'fetch-ponyfill';

const { fetch: fetchPF } = fetchPonyfill();

interface Args {
	originUrl: string;
	network?: Network;
	proposalType: ProposalType;
	postIds: (number | string)[];
}

export default async function getPostsViews({ originUrl, network, postIds, proposalType }: Args) {
	const feedRes = await fetchPF(`${originUrl}/api/v1/${proposalType.toString()}/views`, {
		headers: {
			'x-network': network || ''
		},
		body: JSON.stringify({ postIds }),
		method: 'POST'
	}).catch((e) => {
		throw new ClientError(`${MESSAGES.API_FETCH_ERROR} - ${e?.message}`, API_ERROR_CODE.API_FETCH_ERROR);
	});

	const viewItems: PostIdWithViews[] = await feedRes.json();

	return viewItems;
}

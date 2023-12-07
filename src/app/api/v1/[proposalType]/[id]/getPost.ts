// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { API_ERROR_CODE } from '@/global/constants/errorCodes';
import { ClientError } from '@/global/exceptions';
import MESSAGES from '@/global/messages';
import { ProposalType, IPost, Network } from '@/global/types';
import fetchPonyfill from 'fetch-ponyfill';

const { fetch: fetchPF } = fetchPonyfill();

interface Params {
	originUrl: string;
	id: number;
	proposalType: ProposalType;
	network?: Network;
}

// TODO: make a common function for fetchPF

export default async function getPost({ originUrl, id, proposalType, network }: Params) {
	const feedRes = await fetchPF(`${originUrl}/api/v1/${proposalType.toString()}/${id}`, {
		method: 'GET',
		headers: {
			'x-network': network || ''
		}
	}).catch((e) => {
		throw new ClientError(`${MESSAGES.API_FETCH_ERROR} - ${e?.message}`, API_ERROR_CODE.API_FETCH_ERROR);
	});

	if (feedRes.status === 404) throw new ClientError(`${MESSAGES.POST_NOT_FOUND_ERROR}`, API_ERROR_CODE.POST_NOT_FOUND_ERROR);
	if (feedRes.status !== 200) throw new ClientError(`${MESSAGES.CLIENT_ERROR}`, API_ERROR_CODE.CLIENT_ERROR);

	const post: IPost = await feedRes.json();
	return post;
}

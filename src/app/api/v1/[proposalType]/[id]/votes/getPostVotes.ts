// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { API_ERROR_CODE } from '@/global/constants/errorCodes';
import { ClientError } from '@/global/exceptions';
import MESSAGES from '@/global/messages';
import { ProposalType, Network, Vote } from '@/global/types';

interface Params {
	originUrl: string;
	id: number | string;
	proposalType: ProposalType;
	network?: Network;
	page: number;
}

export default async function getPostVotes({ originUrl, id, proposalType, network, page }: Params) {
	const votesRes = await fetch(`${originUrl}/api/v1/${proposalType.toString()}/${id}/votes`, {
		method: 'POST',
		body: JSON.stringify({ page }),
		headers: {
			'x-network': network || ''
		}
	}).catch((e) => {
		throw new ClientError(`${MESSAGES.API_FETCH_ERROR} - ${e?.message}`, API_ERROR_CODE.API_FETCH_ERROR);
	});

	const votes: {
		yes: Vote[];
		no: Vote[];
	} = await votesRes.json();
	return votes;
}

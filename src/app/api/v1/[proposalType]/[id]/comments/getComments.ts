// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { API_ERROR_CODE } from '@/global/constants/errorCodes';
import { ClientError } from '@/global/exceptions';
import MESSAGES from '@/global/messages';
import { Network, PostCommentResponse, ProposalType } from '@/global/types';

interface Params {
	originUrl: string;
	id: number;
	proposalType: ProposalType;
	network?: Network;
}

export default async function getComments({ originUrl, id, proposalType, network }: Params) {
	const feedRes = await fetch(`${originUrl}/api/v1/${proposalType.toString()}/${id}/comments`, {
		method: 'GET',
		headers: {
			'x-network': network || ''
		}
	}).catch((e) => {
		throw new ClientError(`${MESSAGES.API_FETCH_ERROR} - ${e?.message}`, API_ERROR_CODE.API_FETCH_ERROR);
	});

	const commentsArr: PostCommentResponse[] = await feedRes.json();
	return commentsArr;
}

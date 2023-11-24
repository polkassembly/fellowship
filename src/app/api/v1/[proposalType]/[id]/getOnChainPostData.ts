// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { API_ERROR_CODE } from '@/global/constants/errorCodes';
import { APIError } from '@/global/exceptions';
import MESSAGES from '@/global/messages';
import { Network, OnChainPostInfo, ProposalStatus, ProposalType } from '@/global/types';
import { urqlClient } from '@/services/urqlClient';
import firestoreToSubsquidProposalType from '@/utils/firestoreToSubsquidProposalType';
import { GET_REFERENDUM } from '../../subsquidQueries';

interface Params {
	network: Network;
	id: number;
	proposalType: ProposalType;
}

export async function getOnChainPostData({ network, id, proposalType }: Params) {
	const gqlClient = urqlClient(network);

	const { data: subsquidData, error: subsquidErr } = await gqlClient
		.query(GET_REFERENDUM, {
			index_eq: Number(id),
			type_eq: firestoreToSubsquidProposalType(proposalType)
		})
		.toPromise();

	const subsquidPost = subsquidData?.proposals?.[0];

	if (!subsquidPost && Array.isArray(subsquidData?.proposals)) throw new APIError(`${MESSAGES.POST_NOT_FOUND_ERROR}`, 404, API_ERROR_CODE.POST_NOT_FOUND_ERROR);
	if (!subsquidData || subsquidErr || !subsquidPost) throw new APIError(`${subsquidErr || MESSAGES.SUBSQUID_FETCH_ERROR}`, 500, API_ERROR_CODE.SUBSQUID_FETCH_ERROR);

	return {
		created_at: subsquidPost.updatedAt,
		updated_at: subsquidPost.createdAt,
		description: subsquidPost.description ?? '',
		proposer: subsquidPost.proposer,
		status: subsquidPost.status as ProposalStatus,
		track_number: subsquidPost.trackNumber,
		tally: {
			ayes: String(subsquidPost.tally?.ayes ?? 0),
			nays: String(subsquidPost.tally?.nays ?? 0)
		}
	} as OnChainPostInfo;
}

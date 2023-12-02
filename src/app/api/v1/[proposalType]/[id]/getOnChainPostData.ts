// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { API_ERROR_CODE } from '@/global/constants/errorCodes';
import { APIError } from '@/global/exceptions';
import MESSAGES from '@/global/messages';
import { Network, OnChainPostInfo, ProposalStatus } from '@/global/types';
import { urqlClient } from '@/services/urqlClient';
import { GET_REFERENDUM, GET_VOTES_COUNT } from '../../subsquidQueries';

interface Params {
	network: Network;
	id: number;
}

export async function getOnChainPostData({ network, id }: Params) {
	const gqlClient = urqlClient(network);

	const { data: subsquidData, error: subsquidErr } = await gqlClient
		.query(GET_REFERENDUM, {
			index_eq: Number(id)
		})
		.toPromise();

	const { data: subsquidYesVotesCountRes } = await gqlClient
		.query(GET_VOTES_COUNT, {
			index_eq: Number(id),
			decision_eq: 'yes'
		})
		.toPromise();

	const { data: subsquidNoVotesCountRes } = await gqlClient
		.query(GET_VOTES_COUNT, {
			index_eq: Number(id),
			decision_eq: 'no'
		})
		.toPromise();

	let subsquidPost = subsquidData?.activities?.[0];

	if (!subsquidPost?.proposal && Array.isArray(subsquidData?.activities)) throw new APIError(`${MESSAGES.POST_NOT_FOUND_ERROR}`, 404, API_ERROR_CODE.POST_NOT_FOUND_ERROR);
	if (!subsquidData || subsquidErr || !subsquidPost?.proposal) throw new APIError(`${subsquidErr || MESSAGES.SUBSQUID_FETCH_ERROR}`, 500, API_ERROR_CODE.SUBSQUID_FETCH_ERROR);
	subsquidPost = {
		...subsquidPost?.proposal,
		activityType: subsquidPost?.type
	};
	return {
		created_at: subsquidPost.updatedAt,
		updated_at: subsquidPost.createdAt,
		description: subsquidPost.description ?? '',
		proposer: subsquidPost.proposer,
		status: subsquidPost.status as ProposalStatus,
		track_number: subsquidPost.trackNumber,
		activity_type: subsquidPost?.activityType,
		tally: {
			ayes: String(subsquidPost.tally?.ayes ?? 0),
			nays: String(subsquidPost.tally?.nays ?? 0)
		},
		total_votes: {
			yes: subsquidYesVotesCountRes?.votesConnection?.totalCount || 0,
			no: subsquidNoVotesCountRes?.votesConnection?.totalCount || 0
		},
		preimage: subsquidPost?.preimage,
		proposal_arguments: subsquidPost?.proposalArguments,
		deciding: subsquidPost?.deciding,
		decision_deposit: subsquidPost?.decisionDeposit,
		submission_deposit: subsquidPost?.submissionDeposit,
		deposit: subsquidPost?.deposit,
		statusHistory: subsquidPost?.statusHistory || []
	} as OnChainPostInfo;
}

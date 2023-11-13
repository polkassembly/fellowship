// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { headers } from 'next/headers';
import { APIError } from '@/global/exceptions';
import { urqlClient } from '@/services/urqlClient';
import { API_ERROR_CODE } from '@/global/constants/errorCodes';
import MESSAGES from '@/global/messages';
import { LISTING_LIMIT } from '@/global/constants/listingLimit';
import firebaseAdmin from '@/services/firebaseInit';
import { OnChainPostInfo, PostListingItem, ProposalStatus, ProposalType } from '@/global/types';
import DEFAULT_POST_TITLE from '@/global/constants/defaultTitle';
import getDefaultPostContent from '@/utils/getDefaultPostContent';
import { NextResponse } from 'next/server';
import { GET_FELLOWSHIP_REFERENDUMS } from '../subsquidQueries';
import getReqBody from '../../api-utils/getReqBody';
import getNetworkFromHeaders from '../../api-utils/getNetworkFromHeaders';
import withErrorHandling from '../../api-utils/withErrorHandling';
import { postsCollRef } from '../firestoreRefs';

export const POST = withErrorHandling(async (req: Request) => {
	// TODO: Add feed type
	// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
	const { feed, page = 1 } = await getReqBody(req);

	if (!page || isNaN(page) || Number(page) < 1) throw new APIError(`${MESSAGES.REQ_BODY_ERROR}`, 500, API_ERROR_CODE.REQ_BODY_ERROR);

	const headersList = headers();
	const network = getNetworkFromHeaders(headersList);

	const gqlClient = urqlClient(network);

	const result = await gqlClient
		.query(GET_FELLOWSHIP_REFERENDUMS, {
			limit: LISTING_LIMIT,
			offset: page * LISTING_LIMIT
		})
		.toPromise();

	if (result.error) throw new APIError(`${result.error || MESSAGES.SUBSQUID_FETCH_ERROR}`, 500, API_ERROR_CODE.SUBSQUID_FETCH_ERROR);

	const onChainProposals = result?.data?.proposals || [];

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const proposalRefs = onChainProposals.map((proposalObj: any) => {
		return postsCollRef(network, ProposalType.FELLOWSHIP_REFERENDUMS).doc(proposalObj?.id);
	});

	const firestoreProposalDocs = await firebaseAdmin.firestore().getAll(...proposalRefs);

	// assign proposal data to proposalsData
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const proposalItems: PostListingItem[] = onChainProposals.map((onChainProposalObj: any) => {
		const firestoreProposalData = firestoreProposalDocs.find((item) => item.id === onChainProposalObj?.index)?.data() || {};

		const onChainPostInfo: OnChainPostInfo = {
			description: onChainProposalObj.description ?? '',
			proposer: onChainProposalObj.proposer,
			status: onChainProposalObj.status as ProposalStatus,
			track_number: onChainProposalObj.trackNumber,
			tally: {
				ayes: String(onChainProposalObj.tally?.ayes ?? 0),
				nays: String(onChainProposalObj.tally?.nays ?? 0)
			}
		};

		const postListingItem: PostListingItem = {
			id: onChainProposalObj.index,
			user_id: firestoreProposalData.user_id ?? null,
			title: firestoreProposalData.title ?? DEFAULT_POST_TITLE,
			content:
				onChainProposalObj.description ??
				getDefaultPostContent({
					network,
					proposalType: ProposalType.FELLOWSHIP_REFERENDUMS,
					proposerAddress: onChainProposalObj.proposer
				}),
			created_at: onChainProposalObj.createdAt ?? firestoreProposalData.created_at ?? Date.now(),
			updated_at: firestoreProposalData.updated_at ?? onChainProposalObj.updatedAt ?? Date.now(),
			on_chain_info: onChainPostInfo,
			tags: firestoreProposalData.tags ?? [],
			proposalType: ProposalType.FELLOWSHIP_REFERENDUMS
		};

		return postListingItem;
	});

	return NextResponse.json(proposalItems);
});

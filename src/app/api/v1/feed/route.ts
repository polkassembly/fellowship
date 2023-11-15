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
import { OnChainPostInfo, PostListingItem, ProposalStatus, ProposalType, PublicReactionEntry } from '@/global/types';
import DEFAULT_POST_TITLE from '@/global/constants/defaultTitle';
import getDefaultPostContent from '@/utils/getDefaultPostContent';
import { NextRequest, NextResponse } from 'next/server';
import dayjs from '@/services/dayjs-init';
import { GET_FELLOWSHIP_REFERENDUMS } from '../subsquidQueries';
import getReqBody from '../../api-utils/getReqBody';
import getNetworkFromHeaders from '../../api-utils/getNetworkFromHeaders';
import withErrorHandling from '../../api-utils/withErrorHandling';
import { postCommentsCollRef, postDocRef, postReactionCollRef } from '../firestoreRefs';

async function getFirestoreDocs(onChainProposals: unknown[], network: string) {
	const proposalRefs: firebaseAdmin.firestore.DocumentReference<firebaseAdmin.firestore.DocumentData>[] = [];
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const commentCountRefs: any[] = [];
	const reactionRefs: Promise<firebaseAdmin.firestore.QuerySnapshot<firebaseAdmin.firestore.DocumentData>>[] = [];

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onChainProposals.forEach((proposalObj: any) => {
		const postRef = postDocRef(network, ProposalType.FELLOWSHIP_REFERENDUMS, String(proposalObj.index));
		proposalRefs.push(postRef);

		const commentCountRef = postCommentsCollRef(network, ProposalType.FELLOWSHIP_REFERENDUMS, String(proposalObj.index)).count().get();
		commentCountRefs.push(commentCountRef);

		const reactionCollRef = postReactionCollRef(network, ProposalType.FELLOWSHIP_REFERENDUMS, String(proposalObj.index)).get();
		reactionRefs.push(reactionCollRef);
	});

	const firestoreProposalDocs = await firebaseAdmin.firestore().getAll(...proposalRefs);
	const firestoreCommentCountDocs = (await Promise.allSettled(commentCountRefs)).map((item) => (item.status === 'fulfilled' ? item.value : 0));
	const firestoreReactionDocs = (await Promise.allSettled(reactionRefs)).map((item) => (item.status === 'fulfilled' ? item.value : null));

	return { firestoreProposalDocs, firestoreCommentCountDocs, firestoreReactionDocs };
}

export const POST = withErrorHandling(async (req: NextRequest) => {
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

	const { firestoreProposalDocs, firestoreCommentCountDocs, firestoreReactionDocs } = await getFirestoreDocs(onChainProposals, network);

	// assign proposal data to proposalsData
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const proposalItems: PostListingItem[] = onChainProposals.map((onChainProposalObj: any, index: number) => {
		const firestoreProposalData = firestoreProposalDocs.find((item) => item.id === onChainProposalObj?.index)?.data() || {};
		const firestoreCommentCount = firestoreCommentCountDocs.find((item) => item.id === onChainProposalObj?.index)?.data().count || 0;
		const firestoreReactionDocsData = firestoreReactionDocs[Number(index)]?.docs || [];

		const reactionCount = firestoreReactionDocsData.length || 0;

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
				firestoreProposalData.content ||
				onChainProposalObj.description ||
				getDefaultPostContent({
					network,
					proposalType: ProposalType.FELLOWSHIP_REFERENDUMS,
					proposerAddress: onChainProposalObj.proposer
				}),
			created_at: dayjs(onChainProposalObj.createdAt ?? firestoreProposalData.created_at?.toDate() ?? new Date()).toDate(),
			updated_at: dayjs(firestoreProposalData.updated_at?.toDate() ?? onChainProposalObj.updatedAt ?? new Date()).toDate(),
			on_chain_info: onChainPostInfo,
			tags: firestoreProposalData.tags ?? [],
			proposalType: ProposalType.FELLOWSHIP_REFERENDUMS,
			comments_count: firestoreCommentCount,
			reactions_count: reactionCount,
			latest_reaction: (firestoreReactionDocsData?.[0]?.data() as PublicReactionEntry) || null,
			shares_count: 0
		};

		return postListingItem;
	});

	return NextResponse.json(proposalItems);
});

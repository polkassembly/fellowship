// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { headers } from 'next/headers';
import { APIError } from '@/global/exceptions';
import { urqlClient } from '@/services/urqlClient';
import { API_ERROR_CODE } from '@/global/constants/errorCodes';
import MESSAGES from '@/global/messages';
import { LISTING_LIMIT } from '@/global/constants/listingLimit';
import { EActivityFeed, OnChainPostInfo, PostListingItem, ProposalStatus, ProposalType, PublicReactionEntry, SubsquidActivityType } from '@/global/types';
import DEFAULT_POST_TITLE from '@/global/constants/defaultTitle';
import getDefaultPostContent from '@/utils/getDefaultPostContent';
import { NextRequest, NextResponse } from 'next/server';
import dayjs from '@/services/dayjs-init';
import { GET_FELLOWSHIP_REFERENDUMS } from '../subsquidQueries';
import getReqBody from '../../api-utils/getReqBody';
import getNetworkFromHeaders from '../../api-utils/getNetworkFromHeaders';
import withErrorHandling from '../../api-utils/withErrorHandling';
import { getPostsReactionsServer } from '../[proposalType]/reactions/utils';
import { getPostsViewsServer } from '../[proposalType]/views/utils';
import getFirestoreDocs from './utils';
import { getSubSquareContentAndTitle } from '../../api-utils/subsquare-content';

const getActivityTypes = (feedType: EActivityFeed) => {
	const all = [
		SubsquidActivityType.RetentionRequest,
		SubsquidActivityType.PromotionRequest,
		SubsquidActivityType.DemotionRequest,
		SubsquidActivityType.InductionRequest,
		SubsquidActivityType.RFC,
		SubsquidActivityType.GeneralProposal
	];
	switch (feedType) {
		// case EActivityFeed.PENDING:
		case EActivityFeed.ALL:
			return all;
		case EActivityFeed.GENERAL_PROPOSALS:
			return [SubsquidActivityType.GeneralProposal];
		case EActivityFeed.RFC_PROPOSALS:
			return [SubsquidActivityType.RFC];
		case EActivityFeed.RANK_REQUESTS:
			return [SubsquidActivityType.RetentionRequest, SubsquidActivityType.PromotionRequest, SubsquidActivityType.DemotionRequest, SubsquidActivityType.InductionRequest];
		default:
			return all;
	}
};

// eslint-disable-next-line sonarjs/cognitive-complexity
export const POST = withErrorHandling(async (req: NextRequest) => {
	const { feedType, page = 1 } = await getReqBody(req);

	if (!page || isNaN(page) || Number(page) < 1) throw new APIError(`${MESSAGES.REQ_BODY_ERROR}`, 500, API_ERROR_CODE.REQ_BODY_ERROR);

	const headersList = headers();
	const network = getNetworkFromHeaders(headersList);

	const gqlClient = urqlClient(network);

	const types = getActivityTypes(feedType);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const variables: any = {
		limit: LISTING_LIMIT,
		offset: (page - 1) * LISTING_LIMIT
	};
	if (types) {
		variables.type_in = types;
	}
	const result = await gqlClient.query(GET_FELLOWSHIP_REFERENDUMS, variables).toPromise();

	if (result.error) throw new APIError(`${result.error || MESSAGES.SUBSQUID_FETCH_ERROR}`, 500, API_ERROR_CODE.SUBSQUID_FETCH_ERROR);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let onChainProposals = (result?.data?.activities || []).map((item: any) => {
		return {
			activityType: item.type,
			...item.proposal
		};
	});

	// TODO: will remove this map later
	const proposalMap: {
		[key: string]: PostListingItem;
	} = {};

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onChainProposals?.forEach((onChainProposalObj: any) => {
		proposalMap[onChainProposalObj.index] = onChainProposalObj;
	});

	onChainProposals = Object.values(proposalMap);

	const { firestoreProposalDocs, firestoreCommentCountDocs, firestoreReactionDocs } = await getFirestoreDocs(onChainProposals, network);

	// assign proposal data to proposalsData
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const proposalItemsPromises: Promise<PostListingItem>[] = onChainProposals.map(async (onChainProposalObj: any, index: number) => {
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
			},
			activity_type: onChainProposalObj.activityType
		};

		if (!firestoreProposalData?.title || !firestoreProposalData?.content) {
			const { content, title } = await getSubSquareContentAndTitle(ProposalType.FELLOWSHIP_REFERENDUMS, network, onChainProposalObj.index);
			if (!firestoreProposalData?.title) {
				firestoreProposalData.title = title;
			}
			if (!firestoreProposalData?.content) {
				firestoreProposalData.content = content;
			}
		}

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

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let proposalItems = (await Promise.allSettled(proposalItemsPromises)).filter((item) => item.status === 'fulfilled').map((item) => (item as any).value);

	const postsReactions = await getPostsReactionsServer(
		proposalItems.map((item) => item.id),
		network,
		ProposalType.FELLOWSHIP_REFERENDUMS
	);

	const postsViews = await getPostsViewsServer(
		proposalItems.map((item) => item.id),
		network,
		ProposalType.FELLOWSHIP_REFERENDUMS
	);

	proposalItems = proposalItems.map((item) => {
		const postReactions = postsReactions.find((post) => post.postId === item.id)?.reactions || [];
		const postViews = postsViews.find((post) => post.postId === item.id)?.views || [];

		return {
			...item,
			views: postViews,
			reactions: postReactions
		};
	});

	return NextResponse.json(proposalItems);
});

// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { headers } from 'next/headers';
import { APIError } from '@/global/exceptions';
import { urqlClient } from '@/services/urqlClient';
import { API_ERROR_CODE } from '@/global/constants/errorCodes';
import MESSAGES from '@/global/messages';
import { ActivityFeedItem, OnChainPostInfo, PostListingItem, PostView, ProposalStatus, ProposalType, PublicReactionEntry, SubsquidActivityType } from '@/global/types';
import { NextRequest, NextResponse } from 'next/server';
import dayjs from '@/services/dayjs-init';
import getReqBody from '@/app/api/api-utils/getReqBody';
import getNetworkFromHeaders from '@/app/api/api-utils/getNetworkFromHeaders';
import withErrorHandling from '@/app/api/api-utils/withErrorHandling';
import { getSubSquareContentAndTitle } from '@/app/api/api-utils/subsquare-content';
import DEFAULT_POST_TITLE from '@/global/constants/defaultTitle';
import getDefaultPostContent from '@/utils/getDefaultPostContent';
import { LISTING_LIMIT } from '@/global/constants/listingLimit';
import { GET_ALL_ACTIVITIES } from '../../subsquidQueries';
import { activityReactionCollRef, activityViewsCollRef, postCommentsCollRef, postDocRef, postReactionCollRef, postViewsCollRef } from '../../firestoreRefs';

// TODO: Optimise this, merge with feed/route.ts

// eslint-disable-next-line sonarjs/cognitive-complexity
export const POST = withErrorHandling(async (req: NextRequest) => {
	const { page = 1 } = await getReqBody(req);

	if (!page || isNaN(page) || Number(page) < 1) throw new APIError(`${MESSAGES.REQ_BODY_ERROR}`, 500, API_ERROR_CODE.REQ_BODY_ERROR);

	const headersList = headers();
	const network = getNetworkFromHeaders(headersList);

	const gqlClient = urqlClient(network);

	const result = await gqlClient
		.query(GET_ALL_ACTIVITIES, {
			limit: LISTING_LIMIT,
			offset: (page - 1) * LISTING_LIMIT,
			type_not_in: [SubsquidActivityType.Voted]
		})
		.toPromise();

	if (result.error) throw new APIError(`${result.error || MESSAGES.SUBSQUID_FETCH_ERROR}`, 500, API_ERROR_CODE.SUBSQUID_FETCH_ERROR);

	const allActivities = result?.data?.activities || [];

	const activityWithProposalKeys: string[] = [];

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const feedItemPromises: Promise<ActivityFeedItem>[] = allActivities.map(async (activityObj: any) => {
		const feedItem: ActivityFeedItem = {
			id: String(activityObj.id),
			type: activityObj.type as SubsquidActivityType,
			created_at: dayjs(activityObj.createdAt ?? new Date()).toDate(),
			reactions: [],
			comments_count: 0,
			who: activityObj.who || '',
			isActive: activityObj.otherActions?.isActive ?? false,
			cycleStartDatetime: dayjs(activityObj.salaryCycle?.cycleStartDatetime ?? activityObj.createdAt ?? new Date()).toDate(),
			evidence: activityObj.otherActions?.evidence ?? '',
			rank: activityObj.otherActions?.rank ?? 0,
			vote: {
				balance: activityObj.vote?.balance?.value ?? '0',
				decision: activityObj.vote?.decision === 'yes' ? 'aye' : 'nay',
				proposalIndex: Number(activityObj.vote?.proposalIndex) ?? 0
			}
		};

		if (!activityObj.proposal) {
			const reactions = (await activityReactionCollRef(network, String(activityObj.id)).get()).docs.map((doc) => doc.data() as PublicReactionEntry);
			const views = (await activityViewsCollRef(network, String(activityObj.id)).get()).docs.map((doc) => doc.data() as PostView);

			feedItem.reactions = reactions;
			feedItem.views = views;

			return feedItem;
		}

		// if feedItem.type and activityObj.proposal.index already exist in activityKeys array, skip
		const activityWithProposalKey = `${feedItem.type}-${activityObj.proposal.index}`;

		if (activityWithProposalKeys.includes(activityWithProposalKey)) {
			return null;
		}

		activityWithProposalKeys.push(activityWithProposalKey);

		const onChainProposalObj = activityObj.proposal;

		const firestoreProposalData = await postDocRef(network, ProposalType.FELLOWSHIP_REFERENDUMS, String(onChainProposalObj.index))
			.get()
			.then((doc) => doc.data());
		const commentsCount = (await postCommentsCollRef(network, ProposalType.FELLOWSHIP_REFERENDUMS, String(onChainProposalObj.index)).count().get()).data().count ?? 0;
		const reactions = (await postReactionCollRef(network, ProposalType.FELLOWSHIP_REFERENDUMS, String(onChainProposalObj.index)).get()).docs.map(
			(doc) => doc.data() as PublicReactionEntry
		);
		const views = (await postViewsCollRef(network, ProposalType.FELLOWSHIP_REFERENDUMS, String(onChainProposalObj.index)).get()).docs.map((doc) => doc.data() as PostView);

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

		const postListingItem: PostListingItem = {
			id: onChainProposalObj.index,
			user_id: firestoreProposalData?.user_id ?? null,
			title: firestoreProposalData?.title ?? DEFAULT_POST_TITLE,
			content:
				firestoreProposalData?.content ||
				onChainProposalObj.description ||
				getDefaultPostContent({
					network,
					proposalType: ProposalType.FELLOWSHIP_REFERENDUMS,
					proposerAddress: onChainProposalObj.proposer
				}),
			created_at: dayjs(onChainProposalObj.createdAt ?? firestoreProposalData?.created_at?.toDate?.() ?? new Date()).toDate(),
			updated_at: dayjs(firestoreProposalData?.updated_at?.toDate?.() ?? onChainProposalObj.updatedAt ?? new Date()).toDate(),
			on_chain_info: onChainPostInfo,
			tags: firestoreProposalData?.tags ?? [],
			proposalType: ProposalType.FELLOWSHIP_REFERENDUMS,
			comments_count: commentsCount,
			reactions_count: reactions.length,
			latest_reaction: reactions?.[0] || null,
			shares_count: 0,
			views,
			views_count: views.length
		};

		// get content and title from subsquare if not available in firestore
		if (!firestoreProposalData?.title || !firestoreProposalData?.content) {
			const { content, title } = await getSubSquareContentAndTitle(ProposalType.FELLOWSHIP_REFERENDUMS, network, activityObj.proposal.index);
			if (!firestoreProposalData?.title && title) {
				postListingItem.title = title;
			}
			if (!firestoreProposalData?.content && content) {
				postListingItem.content = content;
			}
		}

		feedItem.postListingItem = postListingItem;

		feedItem.comments_count = commentsCount;
		feedItem.reactions = reactions;
		feedItem.views = views;

		return feedItem;
	});

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let feedItems: ActivityFeedItem[] = (await Promise.allSettled(feedItemPromises)).filter((item) => item.status === 'fulfilled').map((item) => (item as any).value);

	feedItems = feedItems.filter((item) => item !== null);

	return NextResponse.json(feedItems);
});

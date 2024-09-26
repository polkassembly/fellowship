// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { headers } from 'next/headers';
import { APIError } from '@/global/exceptions';
import { API_ERROR_CODE } from '@/global/constants/errorCodes';
import MESSAGES from '@/global/messages';
import { PostFeedListingItem, PostView, ProposalType, PublicReactionEntry } from '@/global/types';
import { NextRequest, NextResponse } from 'next/server';
import dayjs from '@/services/dayjs-init';
import getReqBody from '@/app/api/api-utils/getReqBody';
import getNetworkFromHeaders from '@/app/api/api-utils/getNetworkFromHeaders';
import withErrorHandling from '@/app/api/api-utils/withErrorHandling';
import { LISTING_LIMIT } from '@/global/constants/listingLimit';
import { postCommentsCollRef, postReactionCollRef, postViewsCollRef, postsCollRef } from '../../firestoreRefs';

// TODO: Optimise API
export const POST = withErrorHandling(async (req: NextRequest) => {
	const { page = 1 } = await getReqBody(req);

	if (!page || isNaN(page) || Number(page) < 1) throw new APIError(`${MESSAGES.REQ_BODY_ERROR}`, 500, API_ERROR_CODE.REQ_BODY_ERROR);

	const headersList = headers();
	const network = getNetworkFromHeaders(headersList);

	const discussionsSnapshot = await postsCollRef(network, ProposalType.DISCUSSIONS)
		.where('isDeleted', '==', false)
		.orderBy('created_at', 'desc')
		.limit(LISTING_LIMIT)
		.offset((Number(page) - 1) * Number(LISTING_LIMIT))
		.get();

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const feedItemPromises: Promise<PostFeedListingItem>[] = discussionsSnapshot.docs.map(async (postDoc: any) => {
		const commentsCount = (await postCommentsCollRef(network, ProposalType.DISCUSSIONS, String(postDoc.id)).count().get()).data().count ?? 0;
		const reactions = (await postReactionCollRef(network, ProposalType.DISCUSSIONS, String(postDoc.id)).get()).docs.map((doc) => doc.data() as PublicReactionEntry);
		const views = (await postViewsCollRef(network, ProposalType.DISCUSSIONS, String(postDoc.id)).get()).docs.map((doc) => doc.data() as PostView);

		const postObj = postDoc.data();

		const postListingItem: PostFeedListingItem = {
			id: Number(postObj.id),
			user_id: Number(postObj.user_id),
			title: postObj.title || 'Untitled',
			content: postObj.content || '',
			created_at: dayjs(postObj.created_at?.toDate?.() ?? new Date()).toDate(),
			updated_at: dayjs(postObj.updated_at?.toDate?.() ?? new Date()).toDate(),
			tags: postObj.tags || [],
			proposer_address: postObj.proposer_address || '',
			username: postObj.username || '',
			proposalType: ProposalType.DISCUSSIONS,
			comments_count: commentsCount,
			reactions_count: reactions?.length || 0,
			latest_reaction: reactions?.[0] ?? null,
			shares_count: 0,
			views_count: views.length,
			reactions,
			views
		};

		return postListingItem;
	});

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const feedItems: PostFeedListingItem[] = (await Promise.allSettled(feedItemPromises)).filter((item) => item.status === 'fulfilled').map((item) => (item as any).value);

	return NextResponse.json(feedItems);
});

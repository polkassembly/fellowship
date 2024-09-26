// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { IPostListingItem, IPostListingResponse, Network, ProposalType, Reaction } from '@/global/types';
import { postCommentsCollRef, postReactionCollRef, postsCollRef } from '../firestoreRefs';

export async function getOffChainPostsListing({
	network,
	proposalType,
	limit,
	page
}: {
	network: Network;
	proposalType: ProposalType;
	limit: number;
	page: number;
}): Promise<IPostListingResponse> {
	const totalPostsCount = postsCollRef(network, proposalType).count().get();

	const posts = postsCollRef(network, proposalType)
		.limit(limit)
		.offset((page - 1) * limit)
		.get();

	const res = await Promise.all([totalPostsCount, posts]);

	// loop through the posts and get the comments count and reactions count
	const postCountPromises = res[1].docs.map(async (doc) => {
		const commentsCount = await postCommentsCollRef(network, proposalType, doc.id).count().get();
		const reactionCounts = await Promise.all(
			Object.values(Reaction).map(async (reaction) => {
				const count = await postReactionCollRef(network, proposalType, doc.id).where('reaction', '==', reaction).count().get();
				return { [reaction]: count.data().count || 0 };
			})
		);

		const reactionCountsObject = Object.assign({}, ...reactionCounts);

		return {
			commentsCount: commentsCount.data().count,
			reactionsCount: reactionCountsObject
		};
	});

	const postCounts = await Promise.all(postCountPromises);

	return {
		totalCount: res[0].data().count || 0,
		posts: res[1].docs.map((doc, index) => {
			const data = doc.data();
			return {
				id: data.id,
				comments_count: postCounts[Number(index)].commentsCount,
				content: data.content,
				created_at: data?.created_at?.toDate?.() || new Date(),
				updated_at: data?.updated_at?.toDate?.() || new Date(),
				post_reactions: postCounts[Number(index)].reactionsCount,
				proposer: '',
				title: data.title,
				type: proposalType,
				user_id: data.user_id
			} as IPostListingItem;
		})
	} as IPostListingResponse;
}

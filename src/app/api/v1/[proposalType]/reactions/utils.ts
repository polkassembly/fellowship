// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { PublicReactionEntry, PostIdWithReactions, ProposalType } from '@/global/types';
import { postDocRef } from '../../firestoreRefs';

const getPostsReactionsServer = async (postIds: (string | number)[], network: string, proposalType: ProposalType) => {
	const postsReactionsPromises = postIds.map(async (id) => {
		const reactionsQuery = await postDocRef(network, proposalType, String(id)).collection('post_reactions').get();
		return {
			postId: id,
			reactions: reactionsQuery.docs.map((doc) => {
				const reactionData = doc.data();
				return {
					...reactionData,
					created_at: reactionData.created_at?.toDate() || new Date(),
					updated_at: reactionData.updated_at?.toDate() || new Date()
				} as PublicReactionEntry;
			})
		} as PostIdWithReactions;
	});

	const postsReactionsSettled = await Promise.allSettled(postsReactionsPromises);
	return postsReactionsSettled.map((item) => (item.status === 'fulfilled' ? item.value : [])) as PostIdWithReactions[];
};

export { getPostsReactionsServer };

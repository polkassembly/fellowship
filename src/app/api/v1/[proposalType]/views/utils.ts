// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { PostView, PostIdWithViews, ProposalType } from '@/global/types';
import { postDocRef } from '../../firestoreRefs';

const getPostsViewsServer = async (postIds: (string | number)[], network: string, proposalType: ProposalType) => {
	const postsViewsPromises = postIds.map(async (id) => {
		const viewsQuery = await postDocRef(network, proposalType, String(id)).collection('post_views').get();
		return {
			postId: id,
			views: viewsQuery.docs.map((doc) => {
				const viewData = doc.data();
				return {
					...viewData
				} as PostView;
			})
		} as PostIdWithViews;
	});

	const postsViewsSettled = await Promise.allSettled(postsViewsPromises);
	return postsViewsSettled.map((item) => (item.status === 'fulfilled' ? item.value : [])) as PostIdWithViews[];
};

export { getPostsViewsServer };

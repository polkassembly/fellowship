// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { PostView, ProposalType } from '@/global/types';
import { postDocRef } from '../../../firestoreRefs';

const getPostViewsServer = async (id: string | number, network: string, proposalType: ProposalType) => {
	const viewsQuery = await postDocRef(network, proposalType, String(id)).collection('post_views').get();
	return viewsQuery.docs.map((doc) => {
		const viewData = doc.data();
		return {
			...viewData
		} as PostView;
	});
};

export { getPostViewsServer };

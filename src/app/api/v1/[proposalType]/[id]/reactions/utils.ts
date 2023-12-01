// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ProposalType, PublicReactionEntry } from '@/global/types';
import { postDocRef } from '../../../firestoreRefs';

const getPostReactionsServer = async (id: string | number, network: string, proposalType: ProposalType) => {
	const reactionsQuery = await postDocRef(network, proposalType, String(id)).collection('post_reactions').get();
	return reactionsQuery.docs.map((doc) => {
		const reactionData = doc.data();
		return {
			...reactionData,
			created_at: reactionData.created_at?.toDate() || new Date(),
			updated_at: reactionData.updated_at?.toDate() || new Date()
		} as PublicReactionEntry;
	});
};

export { getPostReactionsServer };

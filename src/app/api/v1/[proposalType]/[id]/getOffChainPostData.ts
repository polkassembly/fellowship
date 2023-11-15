// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { IPost, Network, ProposalType } from '@/global/types';
import DEFAULT_POST_TITLE from '@/global/constants/defaultTitle';
import { postDocRef, postReactionCollRef } from '../../firestoreRefs';

interface Params {
	network: Network;
	id: number;
	proposalType: ProposalType;
}

export async function getOffChainPostData({ network, id, proposalType }: Params) {
	const firestoreProposalData = (await postDocRef(network, proposalType, String(id)).get()).data() || {};
	const firestoreReactionCountData = (await postReactionCollRef(network, proposalType, String(id)).count().get()).data().count || 0;

	return {
		id,
		user_id: firestoreProposalData.user_id ?? null,
		title: firestoreProposalData.title ?? DEFAULT_POST_TITLE,
		content: firestoreProposalData.content ?? '',
		created_at: firestoreProposalData.created_at?.toDate() ?? new Date(),
		updated_at: firestoreProposalData.updated_at?.toDate() ?? new Date(),
		tags: firestoreProposalData.tags ?? [],
		proposalType,
		reactions_count: firestoreReactionCountData,
		shares_count: 0,
		views_count: 0
	} as IPost;
}

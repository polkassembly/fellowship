// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { IPost, Network, ProposalType } from '@/global/types';
import DEFAULT_POST_TITLE from '@/global/constants/defaultTitle';
import getSubstrateAddress from '@/utils/getSubstrateAddress';
import { getSubSquareContentAndTitle } from '@/app/api/api-utils/subsquare-content';
import { postDocRef, postReactionCollRef } from '../../firestoreRefs';

interface Params {
	network: Network;
	id: number;
	proposalType: ProposalType;
}

export async function getOffChainPostData({ network, id, proposalType }: Params) {
	const firestoreProposalData = (await postDocRef(network, proposalType, String(id)).get()).data() || {};
	const firestoreReactionCountData = (await postReactionCollRef(network, proposalType, String(id)).count().get()).data().count || 0;

	if (!firestoreProposalData?.title || !firestoreProposalData?.content) {
		const { content, title } = await getSubSquareContentAndTitle(ProposalType.FELLOWSHIP_REFERENDUMS, network, id);
		if (!firestoreProposalData?.title) {
			firestoreProposalData.title = title;
		}
		if (!firestoreProposalData?.content) {
			firestoreProposalData.content = content;
		}
	}

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
		views_count: 0,
		inductee_address: firestoreProposalData.inductee_address ?? getSubstrateAddress(firestoreProposalData.inductee_address) ?? null
	} as IPost;
}

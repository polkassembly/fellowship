// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { CreatePostResponseType, Network, ProposalType } from '@/global/types';
import nextApiClientFetch from './nextApiClientFetch';

interface Params {
	postId: number;
	content: string;
	discussionId?: number;
	proposerAddress: string;
	tags?: string[];
	title: string;
	userId: number;
	network: Network;
	onSuccess?: () => void;
	onError?: (err?: string) => void;
}

export default async function saveNewProposal({ postId, content, discussionId, proposerAddress, tags = [], title, userId, network, onSuccess, onError }: Params) {
	const { data, error: apiError } = await nextApiClientFetch<CreatePostResponseType>({
		url: 'api/v1/auth/actions/createOpengovTreasuryProposal',
		isPolkassemblyAPI: true,
		network,
		data: {
			content,
			discussionId: discussionId || null,
			postId,
			proposerAddress,
			tags,
			title,
			userId,
			proposalType: ProposalType.FELLOWSHIP_REFERENDUMS
		}
	});

	if (apiError || !data?.post_id) {
		onError?.(apiError);
		return;
	}

	onSuccess?.();
}

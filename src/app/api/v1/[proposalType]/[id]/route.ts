// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import getNetworkFromHeaders from '@/app/api/api-utils/getNetworkFromHeaders';
import withErrorHandling from '@/app/api/api-utils/withErrorHandling';
import { API_ERROR_CODE } from '@/global/constants/errorCodes';
import { APIError } from '@/global/exceptions';
import MESSAGES from '@/global/messages';
import { isValidProposalType } from '@/utils/isValidProposalType';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { IPost, ProposalType } from '@/global/types';
import getDefaultPostContent from '@/utils/getDefaultPostContent';
import { getOffChainPostData } from './getOffChainPostData';
import { getOnChainPostData } from './getOnChainPostData';

export const GET = withErrorHandling(async (req: NextRequest, { params }) => {
	const { proposalType = '', id = '' } = params;
	if (!proposalType || !id || isNaN(id) || !isValidProposalType(proposalType)) throw new APIError(`${MESSAGES.INVALID_PARAMS_ERROR}`, 500, API_ERROR_CODE.INVALID_PARAMS_ERROR);

	const headersList = headers();
	const network = getNetworkFromHeaders(headersList);

	const offChainPostData = await getOffChainPostData({ network, id: Number(id), proposalType: proposalType as ProposalType });

	// if is off-chain post
	if (proposalType === ProposalType.DISCUSSIONS) {
		return NextResponse.json(offChainPostData);
	}

	// if is on-chain post
	const onChainPostInfo = await getOnChainPostData({ network, id: Number(id), proposalType: proposalType as ProposalType });

	const post: IPost = {
		...offChainPostData,
		created_at: onChainPostInfo.created_at || offChainPostData.created_at,
		updated_at: offChainPostData.updated_at || onChainPostInfo.updated_at,
		content:
			offChainPostData.content ||
			onChainPostInfo.description ||
			getDefaultPostContent({
				network,
				proposalType: ProposalType.FELLOWSHIP_REFERENDUMS,
				proposerAddress: onChainPostInfo.proposer
			}),
		on_chain_info: onChainPostInfo
	};

	return NextResponse.json(post);
});

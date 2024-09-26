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
import { isValidNetwork } from '@/utils/isValidNetwork';
import { IPostListingResponse, ProposalType } from '@/global/types';
import { LISTING_LIMIT } from '@/global/constants/listingLimit';
import { getOffChainPostsListing } from './getOffChainPostsListing';
import { getOnChainPostsListing } from './getOnChainPostsListing';

export const GET = withErrorHandling(async (req: NextRequest, { params }) => {
	const { proposalType = '' } = params;
	if (!proposalType || !isValidProposalType(proposalType)) throw new APIError(`${MESSAGES.INVALID_PARAMS_ERROR}`, 500, API_ERROR_CODE.INVALID_PARAMS_ERROR);

	const headersList = headers();
	const network = getNetworkFromHeaders(headersList);

	if (!isValidNetwork(network)) throw new APIError(`${MESSAGES.INVALID_PARAMS_ERROR}`, 500, API_ERROR_CODE.INVALID_PARAMS_ERROR);

	// get limit and page from url
	const limit = req.nextUrl.searchParams.get('limit') || LISTING_LIMIT;
	const page = req.nextUrl.searchParams.get('page') || 1;

	if (!limit || isNaN(Number(limit)) || Number(limit) < 1 || !page || isNaN(Number(page)) || Number(page) < 1) {
		throw new APIError(`${MESSAGES.INVALID_PARAMS_ERROR}`, 500, 'Invalid limit or page');
	}

	const postResponse: IPostListingResponse = {
		totalCount: 0,
		posts: []
	};

	switch (proposalType as ProposalType) {
		case ProposalType.FELLOWSHIP_REFERENDUMS:
			{
				const { totalCount, posts } = await getOnChainPostsListing({
					network,
					proposalType,
					limit: Number(limit),
					page: Number(page)
				});
				postResponse.totalCount = totalCount;
				postResponse.posts = posts;
			}
			break;
		case ProposalType.DISCUSSIONS:
			{
				const { totalCount, posts } = await getOffChainPostsListing({
					network,
					proposalType,
					limit: Number(limit),
					page: Number(page)
				});
				postResponse.totalCount = totalCount;
				postResponse.posts = posts;
			}
			break;
		default:
			throw new APIError(`${MESSAGES.INVALID_PARAMS_ERROR}`, 500, 'Invalid Proposal Type');
	}

	return NextResponse.json(postResponse);
});

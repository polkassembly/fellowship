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
import getReqBody from '@/app/api/api-utils/getReqBody';
import { getPostsViewsServer } from './utils';

export const POST = withErrorHandling(async (req: NextRequest, { params }) => {
	const { postIds } = await getReqBody(req);
	const { proposalType = '' } = params;
	if (!proposalType || !postIds || !Array.isArray(postIds) || !isValidProposalType(proposalType))
		throw new APIError(`${MESSAGES.INVALID_PARAMS_ERROR}`, 500, API_ERROR_CODE.INVALID_PARAMS_ERROR);

	const headersList = headers();
	const network = getNetworkFromHeaders(headersList);

	const postsViews = getPostsViewsServer(postIds, network, proposalType);

	return NextResponse.json(postsViews);
});

// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { headers } from 'next/headers';
import { APIError } from '@/global/exceptions';
import { urqlClient } from '@/services/urqlClient';
import { API_ERROR_CODE } from '@/global/constants/errorCodes';
import MESSAGES from '@/global/messages';
import { LISTING_LIMIT } from '@/global/constants/listingLimit';
import { ProposalStatus } from '@/global/types';
import { NextRequest, NextResponse } from 'next/server';
import { GET_PENDING_ACTIVITIES } from '../../subsquidQueries';
import getReqBody from '../../../api-utils/getReqBody';
import getNetworkFromHeaders from '../../../api-utils/getNetworkFromHeaders';
import withErrorHandling from '../../../api-utils/withErrorHandling';

// eslint-disable-next-line sonarjs/cognitive-complexity
export const POST = withErrorHandling(async (req: NextRequest) => {
	const { page = 1, address = '' } = await getReqBody(req);

	if (!page || isNaN(page) || Number(page) < 1) throw new APIError(`${MESSAGES.REQ_BODY_ERROR}`, 500, API_ERROR_CODE.REQ_BODY_ERROR);

	const headersList = headers();
	const network = getNetworkFromHeaders(headersList);

	const gqlClient = urqlClient(network);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const variables: any = {
		limit: LISTING_LIMIT,
		offset: (page - 1) * LISTING_LIMIT,
		status_in: [ProposalStatus.Deciding, ProposalStatus.DecisionDepositPlaced],
		voter_in: address
	};

	const result = await gqlClient.query(GET_PENDING_ACTIVITIES, variables).toPromise();

	if (result.error) throw new APIError(`${result.error || MESSAGES.SUBSQUID_FETCH_ERROR}`, 500, API_ERROR_CODE.SUBSQUID_FETCH_ERROR);

	const allPendingCount = result?.data?.all_pending?.length ?? 0;
	const userCompletedCount = result?.data?.user_voted?.length ?? 0;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return NextResponse.json({ allPendingCount, userCompletedCount });
});

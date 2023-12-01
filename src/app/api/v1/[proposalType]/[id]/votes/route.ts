// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import getNetworkFromHeaders from '@/app/api/api-utils/getNetworkFromHeaders';
import getReqBody from '@/app/api/api-utils/getReqBody';
import withErrorHandling from '@/app/api/api-utils/withErrorHandling';
import { API_ERROR_CODE } from '@/global/constants/errorCodes';
import { VOTES_LISTING_LIMIT } from '@/global/constants/listingLimit';
import { APIError } from '@/global/exceptions';
import MESSAGES from '@/global/messages';
import { urqlClient } from '@/services/urqlClient';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { Vote } from '@/global/types';
import { GET_VOTES } from '../../../subsquidQueries';

export const POST = withErrorHandling(async (req: NextRequest, { params }) => {
	const { id = '' } = params;
	const { page = 1 } = await getReqBody(req);

	if (!page || isNaN(page) || Number(page) < 1) throw new APIError(`${MESSAGES.REQ_BODY_ERROR}`, 500, API_ERROR_CODE.REQ_BODY_ERROR);

	const headersList = headers();
	const network = getNetworkFromHeaders(headersList);

	const gqlClient = urqlClient(network);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const variables: any = {
		limit: VOTES_LISTING_LIMIT,
		offset: (page - 1) * VOTES_LISTING_LIMIT,
		index_eq: Number(id)
	};
	const yesResult = await gqlClient
		.query(GET_VOTES, {
			...variables,
			decision_eq: 'yes'
		})
		.toPromise();
	const noResult = await gqlClient
		.query(GET_VOTES, {
			...variables,
			decision_eq: 'no'
		})
		.toPromise();

	if (yesResult.error || noResult.error) throw new APIError(`${yesResult.error || noResult.error || MESSAGES.SUBSQUID_FETCH_ERROR}`, 500, API_ERROR_CODE.SUBSQUID_FETCH_ERROR);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const yesVotes = (yesResult?.data?.votes || []).map((item: any) => {
		return {
			...item
		} as Vote;
	});

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const noVotes = (noResult?.data?.votes || []).map((item: any) => {
		return {
			...item
		} as Vote;
	});

	return NextResponse.json({
		yes: yesVotes,
		no: noVotes
	});
});

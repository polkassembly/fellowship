// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import getNetworkFromHeaders from '@/app/api/api-utils/getNetworkFromHeaders';
import withErrorHandling from '@/app/api/api-utils/withErrorHandling';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { APIError } from '@/global/exceptions';
import MESSAGES from '@/global/messages';
import { LISTING_LIMIT } from '@/global/constants/listingLimit';
import { API_ERROR_CODE } from '@/global/constants/errorCodes';
import { urqlClient } from '@/services/urqlClient';
import { GET_PREIMAGES } from '@/app/api/v1/subsquidQueries';
import { IPreimagesListingResponse } from '@/global/types';
import getReqBody from '../../api-utils/getReqBody';

export const POST = withErrorHandling(async (req: NextRequest) => {
	const { page = 1 } = await getReqBody(req);

	if (!page || isNaN(page) || Number(page) < 1) throw new APIError(`${MESSAGES.REQ_BODY_ERROR}`, 500, API_ERROR_CODE.REQ_BODY_ERROR);

	const headersList = headers();
	const network = getNetworkFromHeaders(headersList);

	const variables = {
		limit: LISTING_LIMIT,
		offset: (page - 1) * LISTING_LIMIT
	};

	const gqlClient = urqlClient(network);

	const result = await gqlClient.query(GET_PREIMAGES, variables).toPromise();

	if (result.error) throw new APIError(`${result.error || MESSAGES.SUBSQUID_FETCH_ERROR}`, 500, API_ERROR_CODE.SUBSQUID_FETCH_ERROR);

	const preimages = result?.data?.preimages || [];
	const totalCount = result?.data?.preimagesConnection?.totalCount || 0;

	const responseArr: IPreimagesListingResponse = {
		count: Number(totalCount),
		preimages
	};

	return NextResponse.json(responseArr);
});

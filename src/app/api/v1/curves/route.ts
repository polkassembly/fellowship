// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { NextRequest, NextResponse } from 'next/server';
import { GET_CURVE_DATA_BY_INDEX } from '@/app/api/v1/subsquidQueries';
import { urqlClient } from '@/services/urqlClient';
import getNetworkFromHeaders from '@/app/api/api-utils/getNetworkFromHeaders';
import getReqBody from '@/app/api/api-utils/getReqBody';
import withErrorHandling from '@/app/api/api-utils/withErrorHandling';
import { headers } from 'next/headers';
import MESSAGES from '@/global/messages';
import { APIError } from '@/global/exceptions';
import { API_ERROR_CODE } from '@/global/constants/errorCodes';

export const POST = withErrorHandling(async (req: NextRequest) => {
	const { blockGte, postId } = await getReqBody(req);

	if (!blockGte || !postId || isNaN(postId) || isNaN(blockGte)) throw new APIError(`${MESSAGES.INVALID_PARAMS_ERROR}`, 500, API_ERROR_CODE.INVALID_PARAMS_ERROR);

	const headersList = headers();
	const network = getNetworkFromHeaders(headersList);

	const gqlClient = urqlClient(network);

	const variables = {
		block_gte: Number(blockGte),
		index_eq: Number(postId)
	};

	const { data, error } = await gqlClient.query(GET_CURVE_DATA_BY_INDEX, variables).toPromise();

	if (error) throw new APIError(`${error || MESSAGES.SUBSQUID_FETCH_ERROR}`, 500, API_ERROR_CODE.SUBSQUID_FETCH_ERROR);

	const curveData = data?.curveData || [];

	return NextResponse.json(curveData);
});

// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import getNetworkFromHeaders from '@/app/api/api-utils/getNetworkFromHeaders';
import withErrorHandling from '@/app/api/api-utils/withErrorHandling';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { APIError } from '@/global/exceptions';
import MESSAGES from '@/global/messages';
import { API_ERROR_CODE } from '@/global/constants/errorCodes';
import { urqlClient } from '@/services/urqlClient';
import { GET_PREIMAGE_BY_ID } from '@/app/api/v1/subsquidQueries';
import getReqBody from '../../../api-utils/getReqBody';

export const POST = withErrorHandling(async (req: NextRequest) => {
	const { id } = await getReqBody(req);

	const headersList = headers();
	const network = getNetworkFromHeaders(headersList);

	const variables = {
		id
	};

	const gqlClient = urqlClient(network);

	const result = await gqlClient.query(GET_PREIMAGE_BY_ID, variables).toPromise();

	if (result.error) throw new APIError(`${result.error || MESSAGES.SUBSQUID_FETCH_ERROR}`, 500, API_ERROR_CODE.SUBSQUID_FETCH_ERROR);

	const preimage = result?.data?.preimageById;

	const statusHistory = result?.data?.statusHistories;
	if (statusHistory) {
		const updatedPreImg = { ...preimage, statusHistory };
		Object.assign(preimage, updatedPreImg);
	}

	return NextResponse.json(preimage);
});

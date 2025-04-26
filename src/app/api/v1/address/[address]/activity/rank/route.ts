// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { APIError } from '@/global/exceptions';
import { API_ERROR_CODE } from '@/global/constants/errorCodes';
import MESSAGES from '@/global/messages';
import { NextRequest, NextResponse } from 'next/server';
import withErrorHandling from '@/app/api/api-utils/withErrorHandling';
import getReqBody from '@/app/api/api-utils/getReqBody';
import getSubstrateAddress from '@/utils/getSubstrateAddress';
import { getUserRankActivityServer } from '../utils';
// eslint-disable-next-line sonarjs/cognitive-complexity
export const POST = withErrorHandling(async (req: NextRequest, { params }) => {
	const { page = 1 } = await getReqBody(req);
	const { address = '' } = params;

	if (!address || !getSubstrateAddress(address)) {
		throw new APIError(`${MESSAGES.INVALID_PARAMS_ERROR}`, 500, API_ERROR_CODE.INVALID_PARAMS_ERROR);
	}

	if (!page || isNaN(page) || Number(page) < 1) throw new APIError(`${MESSAGES.REQ_BODY_ERROR}`, 500, API_ERROR_CODE.REQ_BODY_ERROR);

	const activities = await getUserRankActivityServer(address, page);

	return NextResponse.json(activities || []);
});

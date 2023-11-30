// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import getNetworkFromHeaders from '@/app/api/api-utils/getNetworkFromHeaders';
import withErrorHandling from '@/app/api/api-utils/withErrorHandling';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import getSubstrateAddress from '@/utils/getSubstrateAddress';
import { APIError } from '@/global/exceptions';
import MESSAGES from '@/global/messages';
import { API_ERROR_CODE } from '@/global/constants/errorCodes';
import { urqlClient } from '@/services/urqlClient';
import { encodeAddress } from '@polkadot/util-crypto';
import networkConstants from '@/global/networkConstants';
import { IFellowDataResponse } from '@/global/types';
import getReqBody from '../../api-utils/getReqBody';
import { getFellowsData } from '../subsquidQueries';

export const POST = withErrorHandling(async (req: NextRequest) => {
	const { addresses } = await getReqBody(req);

	if (!addresses || !Array.isArray(addresses) || !addresses.length || addresses.some((address) => !getSubstrateAddress(address))) {
		throw new APIError(`${MESSAGES.REQ_BODY_ERROR}`, 500, API_ERROR_CODE.REQ_BODY_ERROR);
	}

	const headersList = headers();
	const network = getNetworkFromHeaders(headersList);

	// convert addresses to network format
	const networkFormattedAddresses = addresses.map((address) => encodeAddress(address, networkConstants[String(network)].ss58Format));

	// get proposals created, proposols voted on
	const generatedQuery = getFellowsData(networkFormattedAddresses);

	const gqlClient = urqlClient(network);
	const result = await gqlClient.query(generatedQuery, {}).toPromise();

	if (result.error) throw new APIError(`${result.error || MESSAGES.SUBSQUID_FETCH_ERROR}`, 500, API_ERROR_CODE.SUBSQUID_FETCH_ERROR);

	const fellowData = result.data;

	const responseArr: IFellowDataResponse = {};

	networkFormattedAddresses.forEach((address) => {
		responseArr[getSubstrateAddress(address)!] = {
			proposalsVotedOn: fellowData[`votes_${address}`].totalCount || 0,
			proposalsCreated: fellowData[`proposals_${address}`].totalCount || 0
		};
	});

	return NextResponse.json(responseArr);
});

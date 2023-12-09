// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import withErrorHandling from '@/app/api/api-utils/withErrorHandling';
import { NextRequest, NextResponse } from 'next/server';
import { APIError } from '@/global/exceptions';
import MESSAGES from '@/global/messages';
import { API_ERROR_CODE } from '@/global/constants/errorCodes';
import { IProfile } from '@/global/types';
import getSubstrateAddress from '@/utils/getSubstrateAddress';
import { addressDocRef, userDocRef } from '../../firestoreRefs';
import { getUserActivityFeedServer } from './activity/utils';

export const GET = withErrorHandling(async (req: NextRequest, { params }) => {
	const { address = '' } = params;

	if (!address) {
		throw new APIError(`${MESSAGES.INVALID_PARAMS_ERROR}`, 500, API_ERROR_CODE.INVALID_PARAMS_ERROR);
	}

	const substrateAddress = getSubstrateAddress(address) || '';
	// convert addresses to network format
	const docSnapshot = await addressDocRef(substrateAddress).get();

	const data = docSnapshot.data();

	const userDocSnapshot = await userDocRef(data?.user_id).get();

	const user = userDocSnapshot.data();

	const activities = await getUserActivityFeedServer(address, 1);

	// TODO: use substrate address and check in all implementations

	const profile: IProfile = {
		user_id: user?.id,
		manifesto: user?.manifesto || '',
		address: data?.address || '',
		activities: activities || []
	};

	return NextResponse.json(profile);
});

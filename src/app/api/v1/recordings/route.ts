// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import withErrorHandling from '@/app/api/api-utils/withErrorHandling';
import { NextRequest, NextResponse } from 'next/server';
import { APIError } from '@/global/exceptions';
import { IRecording, IRecordingListingResponse } from '@/global/types';
import MESSAGES from '@/global/messages';
import { API_ERROR_CODE } from '@/global/constants/errorCodes';
import { LISTING_LIMIT } from '@/global/constants/listingLimit';
import getReqBody from '../../api-utils/getReqBody';
import { recordingsCollRef } from '../firestoreRefs';

export const POST = withErrorHandling(async (req: NextRequest) => {
	const { page = 1, limit = LISTING_LIMIT } = await getReqBody(req);

	if (!page || isNaN(page) || Number(page) < 1 || isNaN(limit) || Number(limit) < 1) throw new APIError(`${MESSAGES.REQ_BODY_ERROR}`, 500, API_ERROR_CODE.REQ_BODY_ERROR);

	const offset = (Number(page) - 1) * Number(limit);

	const totalCountQuery = recordingsCollRef().count().get();
	const querySnapshot = recordingsCollRef().orderBy('created_at').limit(limit).offset(offset).get();

	const res = await Promise.all([totalCountQuery, querySnapshot]);

	const totalCount = res[0].data().count || 0;

	const recordings: IRecording[] = res[1].docs.map((doc) => {
		const data = doc.data();
		return {
			id: data.id,
			who: data.proposer_address,
			created_at: data?.created_at?.toDate?.() || new Date(),
			updated_at: data?.updated_at?.toDate?.() || new Date(),
			title: data.title
		} as IRecording;
	});

	return NextResponse.json({ totalCount, recordings } as IRecordingListingResponse);
});

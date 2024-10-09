// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import withErrorHandling from '@/app/api/api-utils/withErrorHandling';
import { NextRequest, NextResponse } from 'next/server';
import { APIError } from '@/global/exceptions';
import { IRecording } from '@/global/types';
import MESSAGES from '@/global/messages';
import { API_ERROR_CODE } from '@/global/constants/errorCodes';
import getReqBody from '@/app/api/api-utils/getReqBody';
import { recordingDocRef } from '../../firestoreRefs';

export const POST = withErrorHandling(async (req: NextRequest) => {
	const { recordingId } = await getReqBody(req);

	if (isNaN(recordingId)) throw new APIError(`${MESSAGES.REQ_BODY_ERROR}`, 500, API_ERROR_CODE.REQ_BODY_ERROR);

	const querySnapshot = await recordingDocRef(recordingId).get();

	const data = querySnapshot.data();

	const recording = {
		id: data?.id,
		who: data?.proposer_address,
		created_at: data?.created_at?.toDate?.() || new Date(),
		updated_at: data?.updated_at?.toDate?.() || new Date(),
		title: data?.title,
		thumbnail: data?.thumbnail
	} as IRecording;

	return NextResponse.json(recording as IRecording);
});

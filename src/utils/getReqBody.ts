// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { API_ERROR_CODE } from '@/global/constants/errorCodes';
import { APIError } from '@/global/exceptions';
import MESSAGES from '@/global/messages';

export default async function getReqBody(req: Request) {
	try {
		return await req.json();
	} catch (error) {
		throw new APIError(MESSAGES.REQ_BODY_ERROR, 500, API_ERROR_CODE.REQ_BODY_ERROR);
	}
}

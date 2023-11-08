// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
/* eslint-disable max-classes-per-file */

import { API_ERROR_CODE } from './constants/errorCodes';
import MESSAGES from './messages';

export class ClientError extends Error {
	constructor(message = MESSAGES.CLIENT_ERROR, name = API_ERROR_CODE.CLIENT_ERROR) {
		super(message);
		this.name = name;
	}
}

export class APIError extends Error {
	status: number;

	constructor(message = MESSAGES.API_FETCH_ERROR, status = 500, name = API_ERROR_CODE.API_FETCH_ERROR) {
		super(message);
		this.name = name;
		this.status = status;
	}
}

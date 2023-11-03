// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
/* eslint-disable max-classes-per-file */

import MESSAGES from './messages';

export class InvalidSearchParamsError extends Error {
	constructor(message = MESSAGES.INVALID_SEARCH_PARAMS_ERROR) {
		super(message);
		this.name = 'InvalidSearchParamsError';
	}
}

export class APIError extends Error {
	status: number;

	constructor(message = MESSAGES.API_FETCH_ERROR, status = 500, name = 'APIError') {
		super(message);
		this.name = name;
		this.status = status;
	}
}

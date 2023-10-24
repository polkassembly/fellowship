// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

export class InvalidSearchParamsError extends Error {
	constructor(message = 'Invalid parameters passed to the url') {
		super(message);
		this.name = 'InvalidSearchParamsError';
	}
}

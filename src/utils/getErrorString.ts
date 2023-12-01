// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getErrorString = (error: any): string => {
	if (error && error.message && typeof error.message === 'string') {
		return error.message;
	}
	if (error && error.toString && typeof error.toString === 'function') {
		return error;
	}
	if (typeof error === 'string') {
		return error;
	}
	return '';
};

export default getErrorString;

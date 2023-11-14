// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { APIError } from '@/global/exceptions';
import { NextResponse } from 'next/server';
import consolePretty from './consolePretty';

const withErrorHandling = (handler: { (req: Request): Promise<Response> }) => {
	return async (req: Request) => {
		try {
			return await handler(req);
		} catch (error) {
			const err = error as APIError;
			// eslint-disable-next-line no-console
			console.log('Error in API call : ');
			consolePretty({ err });
			return NextResponse.json({ ...err, message: err.message }, { status: err.status });
		}
	};
};

export default withErrorHandling;

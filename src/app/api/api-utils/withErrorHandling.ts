// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { APIError } from '@/global/exceptions';
import { NextRequest, NextResponse } from 'next/server';
import consolePretty from './consolePretty';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const withErrorHandling = (handler: { (req: NextRequest, options?: any): Promise<NextResponse> }) => {
	return async (req: NextRequest, options: object) => {
		try {
			return await handler(req, options);
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

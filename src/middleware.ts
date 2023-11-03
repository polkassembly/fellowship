// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { NextResponse } from 'next/server';

export function middleware(request: Request) {
	if (request.method === 'OPTIONS') return NextResponse.json(null, { status: 200 });
	return NextResponse.next();
}

export const config = {
	matcher: '/api/:path*'
};

// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers';

export default function getOriginFromHeaders(headers: ReadonlyHeaders): string {
	return `${headers.get('x-forwarded-proto')}://${headers.get('host')}`;
}

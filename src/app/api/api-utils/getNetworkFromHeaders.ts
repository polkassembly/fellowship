// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers';
import { Network } from '@/global/types';
import { isValidNetwork } from '@/utils/isValidNetwork';
import getNetwork from '@/utils/getNetwork';

export default function getNetworkFromHeaders(headers: ReadonlyHeaders): Network {
	const xNetwork = headers.get('x-network');
	const host = headers.get('host');
	const subdomain = host?.split('.')?.[0];

	return isValidNetwork(xNetwork as Network) ? (xNetwork as Network) : isValidNetwork(subdomain as Network) ? (subdomain as Network) : getNetwork();
}

// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Network } from './types';

export const DEFAULT_NETWORK: Network = (() => {
	const defaultNetworkStr = process.env.NEXT_PUBLIC_DEFAULT_NETWORK;
	if (!defaultNetworkStr) {
		throw Error('Please set "NEXT_PUBLIC_DEFAULT_NETWORK" environment variable');
	}
	return defaultNetworkStr as Network;
})();

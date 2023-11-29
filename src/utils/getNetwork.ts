// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DEFAULT_NETWORK } from '@/global/defaultNetwork';

import { Network } from '@/global/types';
import { isValidNetwork } from './isValidNetwork';

/**
 * Returns the current network based on the URL query string
 *
 */

export default function getNetwork(): Network {
	if (!global?.window) return DEFAULT_NETWORK;

	let network: Network = DEFAULT_NETWORK;

	const queryString = global.window.location.search;

	const params = new URLSearchParams(queryString);
	if (params.has('network')) {
		network = (params.get('network') as Network) || DEFAULT_NETWORK;
	}

	if (!isValidNetwork(network)) {
		network = DEFAULT_NETWORK;
	}

	return network;
}

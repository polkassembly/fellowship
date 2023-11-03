// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Network } from '@/global/types';

export function isValidNetwork(networkName: string) {
	try {
		return Object.values(Network).includes(networkName.toLowerCase() as Network);
	} catch (error) {
		return false;
	}
}

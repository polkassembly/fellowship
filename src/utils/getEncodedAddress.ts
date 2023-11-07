// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import networkConstants from '@/global/networkConstants';
import { Network } from '@/global/types';
import { encodeAddress } from '@polkadot/util-crypto';

/**
 * Return an address encoded for the current network
 *
 * @param address An address
 *
 */
export default function getEncodedAddress(address: string, network: Network): string | null {
	const ss58Format = networkConstants?.[String(network)]?.ss58Format;

	if (!network || ss58Format === undefined) {
		return null;
	}

	if (address.startsWith('0x')) return address;

	try {
		return encodeAddress(address, ss58Format);
	} catch (e) {
		return null;
	}
}

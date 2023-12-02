// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import networkConstants from '@/global/networkConstants';
import { Network } from '@/global/types';
import { BN } from '@polkadot/util';

function secondsToDhm(s: number) {
	const seconds = Number(s);
	const d = Math.floor(seconds / (3600 * 24));
	const h = Math.floor((seconds % (3600 * 24)) / 3600);
	const m = seconds < 60 ? 1 : Math.floor((seconds % 3600) / 60);

	const dDisplay = d === 0 ? '' : `${d}d `;
	const hDisplay = `${h}h `;
	const mDisplay = `${m}m`;

	return dDisplay + hDisplay + mDisplay;
}

export default function blockToTime(blocks: BN | number, network: Network, bt?: number): { time: string; seconds: number } {
	let blocktime = 0;
	if (!bt) {
		// eslint-disable-next-line security/detect-object-injection
		blocktime = networkConstants[network].blockTime / 1000;
	} else {
		blocktime = bt / 1000;
	}

	let b = 0;
	// bn.js toNumber() was crashing
	if (typeof blocks !== 'number') {
		b = Number(blocks);
	}

	const time = secondsToDhm(b * blocktime);

	return { seconds: b * blocktime, time };
}

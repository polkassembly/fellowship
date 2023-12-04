// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { BN } from '@polkadot/util';

export default async function getCurrentBlock(api: ApiPromise) {
	return new BN((await api.derive.chain?.bestNumber?.())?.toString?.() || 0);
}

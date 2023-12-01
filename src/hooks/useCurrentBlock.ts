// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useApiContext } from '@/contexts';
import { BN } from '@polkadot/util';
import { useEffect, useState } from 'react';

export default function useCurrentBlock() {
	const [currentBlock, setCurrentBlock] = useState<BN | undefined>(undefined);
	const { api, apiReady } = useApiContext();

	useEffect(() => {
		let unsubscribe: () => void;

		if (api && apiReady) {
			api.derive.chain
				.bestNumber((number) => {
					setCurrentBlock(number);
				})
				.then((unsub) => {
					unsubscribe = unsub;
				})
				// eslint-disable-next-line no-console
				.catch((e) => console.error(e));
		}

		return () => {
			if (unsubscribe) {
				unsubscribe();
			}
		};
	}, [api, apiReady]);

	return currentBlock;
}

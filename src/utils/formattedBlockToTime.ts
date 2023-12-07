// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BN } from '@polkadot/util';
import dayjs from '@/services/dayjs-init';
import { Network } from '@/global/types';
import blockToTime from './blockToTime';

const formattedBlockToTime = (blockNo: number, network: Network, currentBlock?: BN): string => {
	if (!currentBlock) return '';
	const { seconds } = blockToTime(currentBlock.toNumber() - blockNo, network);

	if (seconds === 0) {
		return dayjs.utc().format('DD MMM YYYY');
	}
	const duration = dayjs.duration({ seconds });
	return dayjs.utc().subtract(duration).format('DD MMM YYYY');
};

export default formattedBlockToTime;

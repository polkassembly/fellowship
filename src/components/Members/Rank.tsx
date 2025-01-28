// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import RANK_CONSTANTS from '@/global/constants/rankConstants';

interface Props {
	rank: number;
}

function Rank({ rank }: Props) {
	return (
		<div
			className='flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold'
			style={{
				background: RANK_CONSTANTS[rank].colors.bg,
				color: RANK_CONSTANTS[rank].colors.text
			}}
		>
			{`0${String(RANK_CONSTANTS[rank].rank)}`}
		</div>
	);
}

export default Rank;

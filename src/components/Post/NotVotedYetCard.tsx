// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Card } from '@nextui-org/card';
import React from 'react';
import Image from 'next/image';

function NotVotedYetCard() {
	return (
		<Card
			shadow='none'
			className='-mt-8 h-[32px] rounded-t-none border-1 border-warning bg-warning/20 px-4 py-1.5'
		>
			<div className='item-center flex gap-1'>
				<Image
					alt='Info Icon'
					src='/icons/info.svg'
					width={16}
					height={16}
				/>

				<span className='text-xs font-medium'>Not Voted Yet</span>
			</div>
		</Card>
	);
}

export default NotVotedYetCard;

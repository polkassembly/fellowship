// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Button } from '@nextui-org/button';
import { Card } from '@nextui-org/card';
import React from 'react';
import LinkWithNetwork from '../Misc/LinkWithNetwork';

// TODO: change copy

function JoinFellowshipCard() {
	return (
		<Card
			className='h-[150px] bg-gradient-to-br from-sky-500 via-green-400 to-lime-400 p-6'
			shadow='none'
		>
			<span className='px-4 text-center text-sm text-white'>Join the community to get access to..!</span>
			<Button
				href='/join-fellowship'
				as={LinkWithNetwork}
				className='mt-5 bg-white text-sm font-semibold text-slate-700 shadow-md'
				radius='full'
				size='lg'
			>
				Join Fellowship
			</Button>
		</Card>
	);
}

export default JoinFellowshipCard;

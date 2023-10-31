// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Button } from '@nextui-org/button';
import { Card } from '@nextui-org/card';
import Link from 'next/link';
import React from 'react';

// TODO: change copy

function JoinFellowshipCard() {
	return (
		<Card
			className='h-[150px] bg-gradient-to-br from-sky-500 via-green-400 to-lime-400 p-6'
			shadow='none'
		>
			<span className='px-4 text-center text-sm text-white'>Join the community to get access to..!</span>
			<Link
				href='/join-fellowship'
				className='flex items-center justify-center'
			>
				<Button
					className='mt-5 text-sm font-semibold shadow-md light:bg-white'
					radius='full'
					size='lg'
				>
					Join Fellowship
				</Button>
			</Link>
		</Card>
	);
}

export default JoinFellowshipCard;

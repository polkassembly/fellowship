// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { Button } from '@nextui-org/button';
import React, { useState } from 'react';
import Image from 'next/image';
import LinkWithNetwork from '../Misc/LinkWithNetwork';

function Carousel() {
	const [isOpen, setIsOpen] = useState(true);

	if (!isOpen) return null;

	return (
		<div className='flex flex-row-reverse'>
			<Button
				variant='light'
				className='absolute mr-3 mt-2 text-sm font-semibold text-gray-300'
				radius='full'
				size='sm'
				onPress={() => setIsOpen(false)}
				isIconOnly
			>
				&#x2715;
			</Button>
			<div className="flex min-h-[200px] w-full flex-col items-center justify-center gap-3 rounded-3xl bg-[url('/carousel/carousel-2.svg')] bg-cover p-4 md:bg-[url('/carousel/carousel-1.svg')]">
				<h1 className='flex items-center justify-center gap-2 text-2xl font-semibold text-white'>
					<Image
						alt='Join Fellowship Icon'
						src='/icons/sparkle-pink.svg'
						width={32}
						height={32}
					/>
					Welcome to Technical Fellowship Community!
				</h1>
				<Button
					color='primary'
					href='/join-fellowship'
					as={LinkWithNetwork}
					className='text-sm font-semibold shadow-md'
					radius='full'
					size='md'
				>
					<Image
						alt='Join Fellowship Icon'
						src='/icons/add-user-grey-filled.svg'
						width={24}
						height={24}
						className='brightness-0 invert'
					/>
					Join Fellowship
				</Button>
			</div>
		</div>
	);
}

export default Carousel;

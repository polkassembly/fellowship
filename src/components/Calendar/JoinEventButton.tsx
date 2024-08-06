// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import Image from 'next/image';
import { Button } from '@nextui-org/button';
import Link from 'next/link';

interface IEventButtonProps {
	platform: string;
	url?: string;
}

export default function JoinEventButton({ platform, url }: IEventButtonProps) {
	return (
		<Button
			as={Link}
			href={url}
			target='_blank'
			variant='bordered'
			size='lg'
			isDisabled={!url}
			className='flex items-center gap-5'
		>
			<Image
				src={`/brand/${platform}.svg`}
				alt='meeting platform icon'
				width={40}
				height={40}
			/>
			<span>Go to {platform} link</span>
		</Button>
	);
}

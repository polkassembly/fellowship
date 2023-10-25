// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Button } from '@nextui-org/button';
import { Tooltip } from '@nextui-org/tooltip';
import React from 'react';
import Image from 'next/image';

function AddSubscriptionBtn() {
	return (
		<Tooltip
			className='bg-tooltip_background capitalize text-tooltip_foreground'
			content='Subscribe'
		>
			<Button
				variant='light'
				isIconOnly
				aria-label='Add Subscription'
				radius='full'
				className='text-lg'
			>
				<Image
					src='/icons/post/subscribe.svg'
					alt='Add Subscription'
					width={24}
					height={24}
				/>
			</Button>
		</Tooltip>
	);
}

export default AddSubscriptionBtn;

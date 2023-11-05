// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import Image from 'next/image';
import { Button } from '@nextui-org/button';
import { Popover, PopoverTrigger, PopoverContent } from '@nextui-org/popover';
import { Reaction } from '@/global/types';
import { Tooltip } from '@nextui-org/tooltip';

function ReactionsList() {
	return Object.values(Reaction).map((reaction, i) => (
		<Tooltip
			className='bg-tooltip_background capitalize text-tooltip_foreground'
			content={<span key={reaction}>{Object.keys(Reaction)[i as number].toLowerCase()}</span>}
			key={reaction}
		>
			<Button
				variant='light'
				isIconOnly
				aria-label='Like'
				radius='full'
				className='text-lg'
			>
				{reaction}
			</Button>
		</Tooltip>
	));
}

function AddReactionBtn() {
	return (
		<Popover placement='top'>
			<PopoverTrigger>
				<Button
					variant='light'
					isIconOnly
					aria-label='Add Reaction'
					radius='full'
				>
					<Image
						src='/icons/post/add-reaction.svg'
						alt='Add Reaction'
						width={24}
						height={24}
					/>
				</Button>
			</PopoverTrigger>
			<PopoverContent>
				<div className='flex gap-1'>
					<ReactionsList />
				</div>
			</PopoverContent>
		</Popover>
	);
}

export default AddReactionBtn;

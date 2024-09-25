// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Button } from '@nextui-org/button';
import { Tooltip } from '@nextui-org/tooltip';
import Image from 'next/image';

function LinkDiscussionNudge() {
	return (
		<Tooltip
			classNames={{
				base: 'dark:bg-tooltip_background',
				arrow: 'dark:bg-tooltip_background'
			}}
			showArrow
			content={
				<div className='max-w-[320px] p-4'>
					<h4 className='mb-3 text-sm font-semibold capitalize'>Link Discussion post</h4>
					<p className='text-tiny'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dignissim sodales neque</p>

					<div className='mt-3 flex w-full items-center justify-between gap-5'>
						<Button
							size='sm'
							className='w-full bg-buttonRed text-white'
						>
							Link
						</Button>
						<Button
							variant='light'
							size='sm'
							className='w-full font-bold text-buttonRed'
						>
							Later
						</Button>
					</div>
				</div>
			}
		>
			<Button
				variant='light'
				size='sm'
				isIconOnly
			>
				<Image
					src='/icons/link.svg'
					alt='linkIcon'
					width={20}
					height={20}
				/>
			</Button>
		</Tooltip>
	);
}

export default LinkDiscussionNudge;

// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import Image from 'next/image';

interface IEventHeaderProps {
	title: string;
	startTime: string;
	endTime: string;
	category?: string;
}

export default function EventHeader({ title, startTime, endTime, category }: IEventHeaderProps) {
	return (
		<div className='flex flex-col items-start gap-2 px-5'>
			<div className='flex items-center gap-2'>
				{category && <span className='h-3 w-3 rounded-full bg-green-500' />}
				<h3 className='text-base font-semibold leading-6'>{title}</h3>
			</div>
			<div className='flex items-center gap-2'>
				<Image
					src='/icons/clock.svg'
					alt='clock icon'
					width={18}
					height={18}
					className='dark:grayscale dark:invert dark:filter'
				/>
				<span className='text-secondaryText text-sm'>
					{startTime} - {endTime}
				</span>
			</div>
		</div>
	);
}

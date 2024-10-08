// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import dayjs from '@/services/dayjs-init';
import Image from 'next/image';
import React from 'react';

function DateHeader({ date = new Date(), format = 'D MMM YYYY' }: { date: Date | string; format?: string }) {
	const formattedDateString = dayjs(date).format(format);

	return (
		<div className='flex flex-nowrap gap-1 whitespace-nowrap'>
			<Image
				src='/icons/clock.svg'
				width={16}
				height={16}
				alt='Clock Icon'
				className='dark:dark-icon-filter'
			/>
			<span className='text-xs'>{formattedDateString}</span>
		</div>
	);
}

export default DateHeader;

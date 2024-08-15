// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ACTIVITY_TYPE_DESC } from '@/global/constants/activityTypeConstants';
import { ActivityType } from '@/global/types';
import { Chip } from '@nextui-org/chip';
import { Tooltip } from '@nextui-org/tooltip';
import React from 'react';

function ActivityTypeChip({ type }: { type: ActivityType }) {
	const typeString = type.replaceAll('-', ' ');
	return (
		<Tooltip
			classNames={{
				base: 'dark:bg-tooltip_background',
				arrow: 'dark:bg-tooltip_background'
			}}
			showArrow
			content={
				<div className='max-w-[350px] p-4'>
					<h4 className='mb-3 text-sm font-semibold capitalize'>{typeString}</h4>
					<div className='text-tiny'>{ACTIVITY_TYPE_DESC[type as keyof typeof ACTIVITY_TYPE_DESC]}</div>
				</div>
			}
		>
			<Chip
				className='border-1'
				variant='bordered'
				size='sm'
				radius='sm'
			>
				<p className='text-xs capitalize'># {typeString}</p>
			</Chip>
		</Tooltip>
	);
}

export default ActivityTypeChip;

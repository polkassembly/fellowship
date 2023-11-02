// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ACTIVITY_ACTION_TEXT } from '@/global/activityTypeConstants';
import { ActivityType } from '@/global/types';
import { Chip } from '@nextui-org/chip';
import React from 'react';

function ActivityActionTypeChip({ type }: { type: ActivityType }) {
	const activityActionTextStr = ACTIVITY_ACTION_TEXT[type as keyof typeof ACTIVITY_ACTION_TEXT];
	return (
		activityActionTextStr && (
			<Chip
				className='border-1 bg-primary/10'
				variant='bordered'
				size='sm'
				radius='sm'
				color='primary'
			>
				<p className='text-xs font-medium capitalize'>{activityActionTextStr}</p>
			</Chip>
		)
	);
}

export default ActivityActionTypeChip;

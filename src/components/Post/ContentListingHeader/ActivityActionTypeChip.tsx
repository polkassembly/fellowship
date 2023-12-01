// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import LinkWithNetwork from '@/components/Misc/LinkWithNetwork';
import { usePostDataContext } from '@/contexts';
import { ACTIVITY_ACTION_TEXT } from '@/global/constants/activityTypeConstants';
import { ActivityType } from '@/global/types';
import { Chip } from '@nextui-org/chip';
import React from 'react';

function ActivityActionTypeChip({ type, postId }: { type: ActivityType; postId?: string }) {
	const activityActionTextStr = ACTIVITY_ACTION_TEXT[type as keyof typeof ACTIVITY_ACTION_TEXT];
	const { postData } = usePostDataContext();

	const postIdStr = postId || postData?.id;

	let link = '';
	if (type === ActivityType.INDUCTION) {
		link = `/induct-member/${postIdStr}`;
	} else if (type === ActivityType.GENERAL_PROPOSAL) {
		link = `/referenda/${postIdStr}?vote=true`;
	}

	return (
		activityActionTextStr && (
			<Chip
				as={LinkWithNetwork}
				href={link}
				className='border-1 bg-primary/10'
				variant='bordered'
				size='sm'
				radius='sm'
				color='primary'
				hasParams={type === ActivityType.GENERAL_PROPOSAL}
			>
				<p className='text-xs font-medium capitalize'>{activityActionTextStr}</p>
			</Chip>
		)
	);
}

export default ActivityActionTypeChip;

// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ActivityType, ProposalStatus } from '@/global/types';
import { Divider } from '@nextui-org/divider';
import React from 'react';
import UserIdentity from '../Profile/UserIdentity';
import ActivityTypeChip from './ActivityTypeChip';
import DateHeader from './DateHeader';
import DecidingEndsHeader from './DecidingEndsHeader';
import ListingVoteProgress from './ListingVoteProgress';
import StatusChip from './StatusTag';
import ActivityActionTypeChip from './ActivityActionTypeChip';

interface Props {
	className?: string;
	activityType: ActivityType;
}

function PostListingHeader({ className = '', activityType }: Props) {
	return (
		<div className={`flex h-[26px] items-center gap-2.5 text-sm ${className}`}>
			<UserIdentity />
			<Divider orientation='vertical' />
			<DateHeader date={new Date()} />
			<Divider orientation='vertical' />
			<DecidingEndsHeader />
			<Divider orientation='vertical' />
			<ListingVoteProgress />
			<Divider orientation='vertical' />
			<ActivityTypeChip type={activityType} />
			<Divider orientation='vertical' />
			<StatusChip status={ProposalStatus.ACTIVE} />
			<span className='ml-auto'>
				<ActivityActionTypeChip type={activityType} />
			</span>
		</div>
	);
}

export default PostListingHeader;

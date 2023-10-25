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

function PostListingHeader() {
	return (
		<div className='flex h-[26px] items-center gap-2.5 text-sm'>
			<UserIdentity />
			<Divider orientation='vertical' />
			<DateHeader date={new Date()} />
			<Divider orientation='vertical' />
			<DecidingEndsHeader />
			<Divider orientation='vertical' />
			<ListingVoteProgress />
			<Divider orientation='vertical' />
			<ActivityTypeChip type={ActivityType.FELLOWSHIP_RULE} />
			<Divider orientation='vertical' />
			<StatusChip status={ProposalStatus.ACTIVE} />
		</div>
	);
}

export default PostListingHeader;

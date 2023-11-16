// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ActivityType, ProposalStatus } from '@/global/types';
import { Divider } from '@nextui-org/divider';
import React from 'react';
import UserIdentity from '@/components/Profile/UserIdentity';
import ActivityTypeChip from './ActivityTypeChip';
import DateHeader from './DateHeader';
import DecidingEndsHeader from './DecidingEndsHeader';
import ActivityActionTypeChip from './ActivityActionTypeChip';
import ListingVoteProgress from './ListingVoteProgress';
import StatusChip from '../StatusTag';

interface Props {
	className?: string;
	activityType?: ActivityType;
	address?: string;
	username?: string;
	createdAt: Date;
	votesTally?: {
		ayes: string;
		nays: string;
	};
	status?: ProposalStatus;
	decidingEnds?: Date;
}

function PostListingHeader({ className = '', activityType, address, username, createdAt, votesTally, status, decidingEnds }: Props) {
	return (
		<div className={`flex h-[26px] items-center gap-2.5 text-sm ${className}`}>
			{(address || username) && (
				<>
					<UserIdentity
						address={address}
						username={username}
					/>
					<Divider orientation='vertical' />
				</>
			)}

			<DateHeader date={createdAt} />

			{decidingEnds && (
				<>
					<Divider orientation='vertical' />
					<DecidingEndsHeader />
				</>
			)}

			{votesTally && (
				<>
					<Divider orientation='vertical' />
					<ListingVoteProgress
						ayes={votesTally.ayes}
						nays={votesTally.nays}
					/>
				</>
			)}

			{activityType && (
				<>
					<Divider orientation='vertical' />
					<ActivityTypeChip type={activityType} />
				</>
			)}

			{status && (
				<>
					<Divider orientation='vertical' />
					<StatusChip status={status} />
				</>
			)}

			{activityType && status === ProposalStatus.Deciding && (
				<span className='ml-auto'>
					<ActivityActionTypeChip type={activityType} />
				</span>
			)}
		</div>
	);
}

export default PostListingHeader;

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
import StatusChip from '../StatusChip';
import VoteProgress from '../VoteProgress';

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
	postId?: string;
	index: number;
}

function ContentListingHeader({ className = '', index = 0, postId, activityType, address, username, createdAt, votesTally, status, decidingEnds }: Props) {
	return (
		<div className={`flex flex-col items-center gap-2.5 text-sm md:h-[26px] md:flex-row ${className}`}>
			<div className='flex w-full items-center gap-1 md:hidden'>
				<p className='mt-0.5 text-xs font-normal text-slate-500 md:hidden'>#{index}</p>
				{activityType && <ActivityTypeChip type={activityType} />}
				{status && (
					<StatusChip
						status={status}
						className='ml-auto'
					/>
				)}
			</div>

			<div className={`flex w-full gap-2.5 md:w-auto ${address || username ? 'flex-col' : 'flex-row'} md:h-[26px] md:flex-row`}>
				<span className={`flex ${address || username ? 'w-full' : 'mr-4 w-auto'} items-center justify-between gap-2.5 md:w-auto md:justify-normal`}>
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
				</span>

				<span className='flex h-[26px] w-full items-center gap-2.5 md:h-full md:w-auto'>
					{votesTally && (
						<>
							<Divider orientation='vertical' />
							<VoteProgress
								ayes={votesTally.ayes}
								nays={votesTally.nays}
								variant='listing'
							/>
						</>
					)}

					{activityType && (
						<span className='ml-auto md:hidden'>
							<ActivityActionTypeChip
								postId={postId}
								type={activityType}
							/>
						</span>
					)}
				</span>
			</div>

			<div className='hidden h-full items-center gap-2.5 md:flex'>
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
			</div>

			{activityType && (
				<span className='ml-auto hidden md:inline'>
					<ActivityActionTypeChip
						postId={postId}
						type={activityType}
					/>
				</span>
			)}
		</div>
	);
}

export default ContentListingHeader;

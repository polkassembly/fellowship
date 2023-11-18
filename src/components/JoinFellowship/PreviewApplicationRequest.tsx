// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useUserDetailsContext } from '@/contexts';
import React from 'react';
import { Divider } from '@nextui-org/divider';
import { ProposalStatus } from '@/global/types';
import UserIdentity from '../Profile/UserIdentity';
import DateHeader from '../Post/ContentListingHeader/DateHeader';
import StatusChip from '../Post/StatusTag';
import AlertCard from '../Misc/AlertCard';
import LoadingSpinner from '../Misc/LoadingSpinner';

interface Props {
	className?: string;
	title: string;
	description: string;
	errorString?: string;
	loading?: boolean;
}

function PreviewApplicationRequest({ className = '', title, description, errorString, loading }: Props) {
	const { loginAddress, username } = useUserDetailsContext();

	return (
		<article className={className}>
			{loading && (
				<div className='mb-3'>
					<LoadingSpinner className='Saving application post...' />
				</div>
			)}

			{errorString && (
				<div className='mb-3'>
					<AlertCard
						type='error'
						message={errorString}
					/>
				</div>
			)}

			<h3 className='mb-3 text-sm font-semibold'>{title}</h3>

			<div className='flex flex-row items-center gap-3'>
				{username && (
					<UserIdentity
						address={loginAddress}
						username={username ?? ''}
					/>
				)}
				<Divider
					className='h-[18px]'
					orientation='vertical'
				/>
				<DateHeader date={new Date()} />
				<StatusChip status={ProposalStatus.Submitted} />
			</div>

			<p className='mt-4 text-sm'>{description}</p>
		</article>
	);
}

export default PreviewApplicationRequest;

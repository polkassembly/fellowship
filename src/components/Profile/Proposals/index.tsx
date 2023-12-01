// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { Button } from '@nextui-org/button';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/dropdown';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { EProfileProposals, PayoutListingItem, PostListingItem } from '@/global/types';
import { Card } from '@nextui-org/card';
import getProfileProposals from '@/app/api/v1/address/[address]/proposals/getProfileProposals';
import getOriginUrl from '@/utils/getOriginUrl';
import { useApiContext } from '@/contexts';
import LoadingSpinner from '@/components/Misc/LoadingSpinner';
import PostListingCard from '@/components/Home/PostListingCard';
import { Divider } from '@nextui-org/divider';
import SalaryPayouts from './SalaryPayouts';

interface Props {
	address: string;
}

interface ProposalListingProps {
	proposals: (PostListingItem | PayoutListingItem)[];
	type: EProfileProposals;
}

function ProposalListing({ proposals, type }: ProposalListingProps) {
	if (type === EProfileProposals.SALARY_REQUESTS) {
		return (
			<div>
				<SalaryPayouts payouts={proposals as PayoutListingItem[]} />
			</div>
		);
	}
	return (
		<div>
			{(proposals as PostListingItem[])?.map((feedItem, idx) => {
				return (
					<>
						<PostListingCard
							// eslint-disable-next-line react/no-array-index-key
							key={`${feedItem.proposalType}_${feedItem.id}_${idx}`}
							feedItem={feedItem}
							cardClassName='border-none'
							isDividerDisabled
						/>
						{idx < proposals.length - 1 && <Divider />}
					</>
				);
			})}
		</div>
	);
}

function ProfileProposals({ address }: Props) {
	const [type, setType] = useState(EProfileProposals.GENERAL_PROPOSALS);
	const [loading, setLoading] = useState(false);
	const [proposals, setProposals] = useState<(PostListingItem | PayoutListingItem)[]>([]);

	const { network } = useApiContext();

	const types = [
		{
			key: EProfileProposals.RANK_REQUESTS,
			name: 'Rank Requests'
		},
		{
			key: EProfileProposals.SALARY_REQUESTS,
			name: 'Salary Requests'
		},
		{
			key: EProfileProposals.GENERAL_PROPOSALS,
			name: 'General Proposals'
		}
	];

	useEffect(() => {
		(async () => {
			setLoading(true);
			try {
				const originUrl = getOriginUrl();

				const res = await getProfileProposals({
					originUrl,
					address,
					profileProposalsType: type,
					network,
					page: 1
				});
				if (res && Array.isArray(res)) {
					setProposals(res);
				}
			} catch (error) {
				//
			}
			setLoading(false);
		})();
	}, [type, address, network]);

	return (
		<Card className='rounded-[20px] border border-primary_border'>
			<div className='border-b px-4 py-6'>
				<Dropdown>
					<DropdownTrigger>
						<Button
							variant='bordered'
							className='flex h-unit-8 justify-between border-1 border-primary_border px-3 text-sm font-medium'
						>
							<span className='mr-3'>{types.find((t) => t.key === type)?.name || ''}</span>
							<Image
								alt='down chevron'
								src='/icons/chevron.svg'
								width={12}
								height={12}
								className='rounded-full'
							/>
						</Button>
					</DropdownTrigger>

					<DropdownMenu
						variant='bordered'
						aria-label='Network selection dropdown'
						onAction={(key) => {
							setType(key as EProfileProposals);
						}}
					>
						{types.map((s) => (
							<DropdownItem key={s.key}>{s.name}</DropdownItem>
						))}
					</DropdownMenu>
				</Dropdown>
			</div>
			<div className='overflow-hidden'>
				{loading ? (
					<div className='flex min-h-[200px] items-center justify-center text-base font-medium'>
						<LoadingSpinner message='Fetching proposals...' />
					</div>
				) : proposals.length === 0 ? (
					<p className='flex min-h-[200px] items-center justify-center'>No {type === EProfileProposals.SALARY_REQUESTS ? 'Payouts' : 'Proposals'} found</p>
				) : (
					<ProposalListing
						proposals={proposals}
						type={type}
					/>
				)}
			</div>
		</Card>
	);
}

export default ProfileProposals;

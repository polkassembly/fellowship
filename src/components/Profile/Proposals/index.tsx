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
import LinkWithNetwork from '@/components/Misc/LinkWithNetwork';
import getSubstrateAddress from '@/utils/getSubstrateAddress';
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
			<div className='w-full flex-1'>
				<SalaryPayouts payouts={proposals as PayoutListingItem[]} />
			</div>
		);
	}
	return (
		<div className='w-full flex-1'>
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

function NoRankRequests() {
	return (
		<div className='flex h-full flex-1 flex-col items-center justify-center py-10 text-sm font-normal leading-[21px] tracking-[0.14px] text-secondary'>
			<Image
				alt='empty rank-requests icon'
				src='/icons/empty-states/rank-requests.svg'
				width={156}
				height={168}
			/>
			<p className='m-0 mb-2 mt-[14px] p-0 text-base font-medium leading-6 tracking-[0.08px]'>No Rank Requests Available</p>
			<p className='m-0 p-0 text-sm font-normal leading-[21px] tracking-[0.14px]'>Requests created by you will be visible here</p>
		</div>
	);
}

function NoGeneralProposals() {
	return (
		<div className='flex h-full flex-1 flex-col items-center justify-center py-10 text-sm font-normal leading-[21px] tracking-[0.14px] text-secondary'>
			<Image
				alt='empty general-proposals icon'
				src='/icons/empty-states/general-proposals.svg'
				width={160}
				height={156}
			/>
			<p className='m-0 mb-2 mt-[14px] p-0 text-base font-medium leading-6 tracking-[0.08px]'>No General Proposals Available</p>
			<p className='m-0 p-0 text-sm font-normal leading-[21px] tracking-[0.14px]'>Proposals created by you will be visible here</p>
		</div>
	);
}

function NoSalaryDetails() {
	return (
		<div className='flex h-full flex-1 flex-col items-center justify-center py-10 text-sm font-normal leading-[21px] tracking-[0.14px] text-secondary'>
			<Image
				alt='empty salary-details icon'
				src='/icons/empty-states/salary-details.svg'
				width={156}
				height={168}
			/>
			<p className='m-0 mb-2 mt-[14px] p-0 text-base font-medium leading-6 tracking-[0.08px]'>No Salary Details Available</p>
			<p className='m-0 max-w-[338px] p-0 text-center text-sm font-normal leading-[21px] tracking-[0.14px]'>
				Please Induct yourself as a fellowship member to claim rank based salary
			</p>
		</div>
	);
}

function ProfileProposals({ address }: Props) {
	const [type, setType] = useState(EProfileProposals.GENERAL_PROPOSALS);
	const [loading, setLoading] = useState(false);
	const [proposals, setProposals] = useState<(PostListingItem | PayoutListingItem)[]>([]);

	const { network, fellows } = useApiContext();

	const routeSubstrateAddress = getSubstrateAddress(address || '');

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
		<Card className='rounded-[20px] border border-primary_border bg-cardBg'>
			<div className='flex items-center justify-between border-b border-primary_border px-4 py-6'>
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
								className='dark:dark-icon-filter rounded-full'
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
				{type !== EProfileProposals.GENERAL_PROPOSALS ? (
					// TODO: route with register=true if inducted and not registered
					<>
						{type === EProfileProposals.SALARY_REQUESTS && fellows.find((fellow) => fellow.address === routeSubstrateAddress) && (
							<LinkWithNetwork
								href={`/address/${address}/salary-induction`}
								className='flex items-center gap-x-[6px] rounded-[39px] border border-primary bg-primary_accent px-3 py-1 text-sm font-medium leading-[21px] tracking-[0.21px] text-white'
							>
								Induct
							</LinkWithNetwork>
						)}
						{type === EProfileProposals.RANK_REQUESTS && (
							<LinkWithNetwork
								href={`/address/${address}/create-rank-request`}
								className='flex items-center gap-x-[6px] rounded-[39px] border border-primary bg-primary_accent px-3 py-1 text-sm font-medium leading-[21px] tracking-[0.21px] text-white'
							>
								<>
									<Image
										alt='btn icon'
										src='/icons/medal-fill.svg'
										width={16}
										height={16}
										className='cursor-pointer'
									/>
									Create Rank Request
								</>
							</LinkWithNetwork>
						)}
					</>
				) : null}
			</div>
			<div className='flex max-h-[50vh] flex-1 justify-center overflow-y-auto'>
				{loading ? (
					<div className='flex h-full min-h-[218px] items-center justify-center'>
						<LoadingSpinner message='Fetching proposals...' />
					</div>
				) : proposals.length === 0 ? (
					<div className='flex h-full min-h-[218px] items-center justify-center'>
						{type === EProfileProposals.RANK_REQUESTS ? <NoRankRequests /> : type === EProfileProposals.GENERAL_PROPOSALS ? <NoGeneralProposals /> : <NoSalaryDetails />}
					</div>
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

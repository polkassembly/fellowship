// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { Card } from '@nextui-org/card';
import Image from 'next/image';
import React from 'react';
import { TrendingProposalItem, ProposalStatus } from '@/global/types';
import { getSinglePostLinkFromProposalType } from '@/utils/getSinglePostLinkFromProposalType';
import { Divider } from '@nextui-org/divider';
import { Chip } from '@nextui-org/chip';
import { useApiContext } from '@/contexts';
import StatusChip from '../Post/StatusChip';
import LinkWithNetwork from '../Misc/LinkWithNetwork';

interface Props {
	index: number;
	title: string;
	status: ProposalStatus;
	url: string;
	votePercentage: number;
	isPassing: boolean;
}

function ProposalListingItem({ index, title, status, votePercentage, url, isPassing }: Props) {
	return (
		<LinkWithNetwork
			href={url}
			className='px-4'
		>
			<Divider />
			<div className='flex gap-1.5 py-3 text-xs'>
				<span className='font-normal text-secondary-700'>#{index}</span>
				<article className='flex w-full flex-col gap-1'>
					<h2 className='line-clamp-3 font-medium'>{title}</h2>
					<div className='flex items-center justify-between gap-5'>
						{votePercentage > 0 ? (
							<Chip
								size='sm'
								className={`max-h-[18px] capitalize text-white ${isPassing ? 'bg-voteAye' : 'bg-voteNay'}`}
							>
								<span className='text-xs font-medium'>{isPassing ? 'Passing' : 'Failing'}</span>
							</Chip>
						) : (
							<StatusChip status={status} />
						)}
						<span className='ml-auto'>
							<b className='text-primary'>{votePercentage}%</b> fellows voted
						</span>
					</div>
				</article>
			</div>
		</LinkWithNetwork>
	);
}

function TrendingProposals({ proposals }: { proposals: TrendingProposalItem[] }) {
	const { fellows } = useApiContext();
	return (
		<Card className='py-6'>
			<h2 className='flex items-center gap-2 px-4 pb-4'>
				<Image
					alt='Trending Proposals Icon'
					height={24}
					src='/icons/electric-circle-orange.svg'
					width={24}
				/>
				<span className='text-base font-semibold'>Trending Proposals</span>
			</h2>

			{proposals.length > 0 ? (
				proposals.map((proposal, index) => (
					<ProposalListingItem
						key={proposal.title}
						index={index + 1}
						title={proposal.title}
						status={proposal.status || ProposalStatus.Deciding}
						votePercentage={Math.round((proposal.total_votes_count / fellows.length) * 100) || 0}
						url={`/${getSinglePostLinkFromProposalType(proposal.proposalType)}/${proposal.id}`}
						isPassing={proposal.isPassing}
					/>
				))
			) : (
				<div className='flex flex-col items-center justify-center gap-5 p-5'>
					<Image
						alt='No trending proposals'
						height={100}
						src='/icons/empty-states/general-proposals.svg'
						width={100}
					/>
					<p className='py-3 text-center text-sm'>No trending proposals. Check back later!</p>
				</div>
			)}
		</Card>
	);
}

export default TrendingProposals;

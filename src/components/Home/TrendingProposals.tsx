// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Card } from '@nextui-org/card';
import Image from 'next/image';
import React from 'react';
import ComingSoon from '../Misc/ComingSoon';

/* eslint-disable no-tabs */

// interface Props {
// 	index: number;
// 	title: string;
// 	status: ProposalStatus;
// 	votePercentage: number;
// }

// function ProposalListingItem({ index, title, status, votePercentage }: Props) {
// 	return (
// 		<LinkWithNetwork
// 			href={`#${index}`}
// 			className='px-4'
// 		>
// 			<Divider />
// 			<div className='flex gap-1.5 py-3 text-xs'>
// 				<span className='font-normal text-secondary-700'>#{index}</span>
// 				<article className='flex flex-col gap-1'>
// 					<h2 className='line-clamp-3 font-medium'>{title}</h2>
// 					<div className='flex items-center justify-between'>
// 						<StatusChip status={status} />
// 						<span>
// 							<b className='text-primary'>{votePercentage}%</b> fellows voted
// 						</span>
// 					</div>
// 				</article>
// 			</div>
// 		</LinkWithNetwork>
// 	);
// }

function TrendingProposals() {
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
			<div className='flex items-center justify-center px-6 py-12'>
				<ComingSoon
					imgSize={200}
					className='text-sm'
				/>
			</div>
			{/* Lopp through items */}
			{/* <ProposalListingItem
				index={1}
				status={ProposalStatus.Passed}
				title='This post has such a long title omgggg this is sooo long okay this is ridiculiously long now, is it ?'
				votePercentage={80}
			/> */}
		</Card>
	);
}

export default TrendingProposals;

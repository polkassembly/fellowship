// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { usePostDataContext } from '@/contexts';
import VOTABLE_STATUSES from '@/global/constants/votableStatuses';
import { Card } from '@nextui-org/card';
import React from 'react';
import VoteButton from './VoteButton';

function CastVoteCard() {
	const {
		postData: { on_chain_info: onChainInfo }
	} = usePostDataContext();

	if (!onChainInfo?.status || !VOTABLE_STATUSES.includes(onChainInfo?.status)) return null;

	return (
		<Card
			className='flex flex-col gap-3 border border-primary_border px-4 py-6'
			shadow='none'
			radius='lg'
		>
			<h3 className='mb-3 text-lg font-semibold'>Cast Vote Card</h3>
			<VoteButton
				voteType='aye'
				className='h-[40px]'
			/>
			<VoteButton
				voteType='nay'
				className='h-[40px]'
			/>
		</Card>
	);
}

export default CastVoteCard;

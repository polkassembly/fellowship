// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Card } from '@nextui-org/card';
import React, { useState } from 'react';
import { usePostDataContext } from '@/contexts';
import { BN } from '@polkadot/util';
import Image from 'next/image';
import { Button } from '@nextui-org/button';
import VoteProgress from '../VoteProgress';
import VotesHistoryModal from './VotesHistoryModal';

function VoteInfoCard() {
	const [isVotesHistoryModalOpen, setIsVotesHistoryModalOpen] = useState(false);
	const {
		postData: { on_chain_info: onChainInfo }
	} = usePostDataContext();

	if (!onChainInfo?.tally) return null;

	const ayes = new BN(onChainInfo?.tally.ayes || 0);
	const nays = new BN(onChainInfo?.tally.nays || 0);

	const totalVotes = ayes.add(nays);

	let ayesPercentage = 0;
	if (!totalVotes.isZero()) {
		ayesPercentage = ayes.muln(100).div(totalVotes).toNumber();
	}

	return (
		<>
			<Card
				className='flex flex-col gap-6 border border-primary_border bg-cardBg px-4 py-6'
				shadow='none'
				radius='lg'
			>
				<div className='mb-3 flex items-center justify-between'>
					<h3 className='text-lg font-semibold'>Cast Vote Card</h3>
					{/* <span className='text-xs'>Passing</span> */}
				</div>

				<section className='flex items-end justify-center gap-2'>
					<div className='flex flex-col text-base font-semibold text-voteAye'>
						{ayesPercentage}% <span className='text-xs font-medium text-foreground'>Aye</span>
					</div>
					<VoteProgress
						ayes={onChainInfo?.tally.ayes}
						nays={onChainInfo?.tally.nays}
					/>
					<div className='flex flex-col text-base font-semibold text-voteNay'>
						{totalVotes.isZero() ? 0 : 100 - ayesPercentage}% <span className='text-xs font-medium text-foreground'>Nay</span>
					</div>
				</section>

				<Button
					variant='light'
					size='sm'
					className='flex w-min items-center gap-1 text-xs font-medium text-primary'
					onClick={(e) => {
						e.preventDefault();
						setIsVotesHistoryModalOpen(true);
					}}
				>
					<Image
						alt='Vote History Icon'
						src='/icons/post/vote_history.svg'
						width={18}
						height={18}
					/>
					Voting History
				</Button>
			</Card>
			<VotesHistoryModal
				isModalOpen={isVotesHistoryModalOpen}
				closeModal={() => setIsVotesHistoryModalOpen(false)}
			/>
		</>
	);
}

export default VoteInfoCard;

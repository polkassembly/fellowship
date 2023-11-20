// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { usePostDataContext } from '@/contexts';
import VOTABLE_STATUSES from '@/global/constants/votableStatuses';
import { Card } from '@nextui-org/card';
import React, { useState } from 'react';
import { EVoteDecisionType } from '@/global/types';
import VoteButton from './VoteButton';
import VoteModal from './VoteModal';

function CastVoteCard() {
	const {
		postData: { on_chain_info: onChainInfo }
	} = usePostDataContext();

	const [voteModalType, setVoteModalType] = useState<EVoteDecisionType | null>(null);

	if (!onChainInfo?.status || !VOTABLE_STATUSES.includes(onChainInfo?.status)) return null;

	return (
		<>
			<Card
				className='flex flex-col gap-3 border border-primary_border px-4 py-6'
				shadow='none'
				radius='lg'
			>
				<h3 className='mb-3 text-lg font-semibold'>Cast Vote Card</h3>
				<VoteButton
					voteType={EVoteDecisionType.AYE}
					className='h-[40px]'
					onClick={() => setVoteModalType(EVoteDecisionType.AYE)}
				/>
				<VoteButton
					voteType={EVoteDecisionType.NAY}
					className='h-[40px]'
					onClick={() => setVoteModalType(EVoteDecisionType.NAY)}
				/>
			</Card>

			<VoteModal
				isModalOpen={voteModalType !== null}
				defaultVoteType={voteModalType ?? EVoteDecisionType.AYE}
				closeModal={() => setVoteModalType(null)}
			/>
		</>
	);
}

export default CastVoteCard;

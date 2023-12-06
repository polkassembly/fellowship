// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { PublicReactionEntry } from '@/global/types';
import ReactionSummary from './ReactionSummary';

interface Props {
	commentCount: number;
	latestReaction?: PublicReactionEntry;
	totalReactions?: number;
}

function PostReactionInfoBar({ commentCount = 0, latestReaction, totalReactions = 0 }: Props) {
	return (
		<section className='flex justify-between text-xs'>
			<ReactionSummary
				latestReaction={latestReaction}
				totalReactions={totalReactions}
			/>
			<div className='flex gap-2'>
				<span>{commentCount} comments</span>
			</div>
		</section>
	);
}

export default PostReactionInfoBar;

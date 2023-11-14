// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { PublicReactionEntry } from '@/global/types';
import React from 'react';

function ReactionSummary({ latestReaction, totalReactions }: { latestReaction?: PublicReactionEntry; totalReactions?: number }) {
	return latestReaction && totalReactions ? (
		<div className='flex items-center'>
			<span className='text-sm'>{latestReaction.reaction}</span>
			{latestReaction.username} &amp; {totalReactions - 1} others
		</div>
	) : (
		<div className='flex items-center'>0 reactions</div>
	);
}

export default ReactionSummary;

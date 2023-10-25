// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Reaction } from '@/global/types';
import { Divider } from '@nextui-org/divider';
import ReactionSummary from './ReactionSummary';

function PostReactionInfoBar() {
	return (
		<section className='flex justify-between text-xs'>
			<ReactionSummary
				latestReaction={{
					created_at: new Date(),
					reaction: Reaction.INTERESTING,
					username: 'Matty2023'
				}}
				totalReactions={43}
			/>
			<div className='flex gap-2'>
				<span>10 comments</span>
				<Divider orientation='vertical' />
				<span>4 shares</span>
			</div>
		</section>
	);
}

export default PostReactionInfoBar;

// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Card } from '@nextui-org/card';
import React from 'react';
import { Divider } from '@nextui-org/divider';
import { ActivityType } from '@/global/types';
import PostActionBar from '../Post/PostActionBar';
import PostReactionInfoBar from '../Post/PostReactionInfoBar';
import PostListingHeader from '../Post/PostListingHeader';

function InductionListingCard() {
	return (
		<article>
			<Card
				shadow='none'
				className='flex flex-col gap-3 border border-primary_border px-6 py-4'
			>
				<PostListingHeader
					className='text-sm'
					activityType={ActivityType.INDUCTION}
				/>
				<PostReactionInfoBar />
				<Divider />
				<PostActionBar />
			</Card>
		</article>
	);
}

export default InductionListingCard;

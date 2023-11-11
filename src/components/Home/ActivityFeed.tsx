// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { PostListingItem, ProposalType } from '@/global/types';
import PostListingCard from './PostListingCard';
// import InductionListingCard from './InductionListingCard';

interface Props {
	items: PostListingItem[];
}

function ActivityFeed({ items }: Props) {
	return (
		<section className='flex max-h-screen w-full flex-col gap-y-4 overflow-auto'>
			{items.map(
				(feedItem) =>
					feedItem.proposalType === ProposalType.FELLOWSHIP_REFERENDUMS && (
						<PostListingCard
							key={`${feedItem.proposalType}_${feedItem.id}`}
							feedItem={feedItem}
						/>
					)
			)}
			{/* <InductionListingCard /> */}
		</section>
	);
}

export default ActivityFeed;

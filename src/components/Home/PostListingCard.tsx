// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Card } from '@nextui-org/card';
import React from 'react';
import { Divider } from '@nextui-org/divider';
import { ActivityType } from '@/global/types';
import Link from 'next/link';
import PostActionBar from '../Post/PostActionBar';
import PostReactionInfoBar from '../Post/PostReactionInfoBar';
import PostListingHeader from '../Post/PostListingHeader';
import PostListingBody from '../Post/PostListingBody';
import NotVotedYetCard from '../Post/NotVotedYetCard';

const SHOW_NOT_VOTED = true;

function PostListingCard() {
	return (
		<article>
			<Card
				shadow='none'
				className='border border-primary_border'
				isHoverable
				isPressable
				as={Link}
				href='/post/1'
			>
				{/* Need this wrapper div because isPressable breaks styles */}
				<div className={`flex flex-col gap-3 px-6 py-4 text-left ${SHOW_NOT_VOTED && 'pb-[35px]'}`}>
					<PostListingHeader activityType={ActivityType.GENERAL_PROPOSAL} />
					<PostListingBody
						index={1}
						title='Standard Guidelines to judge Liquidity Treasury Proposals on the main governance side - Kusama and Polkadot your Vote!'
						content='Based on the income to the treasuries, the amounts getting burned and the amounts going to proposals, the treasury can be utilised: this includes spending funds, extending the comments ael...'
						tags={['kusama', 'polkadot', 'treasury']}
					/>
					<PostReactionInfoBar />
					<Divider />
					<PostActionBar />
				</div>
				{SHOW_NOT_VOTED && <NotVotedYetCard />}
			</Card>
		</article>
	);
}

export default PostListingCard;

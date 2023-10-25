// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Card } from '@nextui-org/card';
import React from 'react';
import { Divider } from '@nextui-org/divider';
import { ActivityType, ProposalStatus, Reaction } from '@/global/types';
import Link from 'next/link';
import UserIdentity from '../Profile/UserIdentity';
import DateHeader from '../Post/DateHeader';
import DecidingEndsHeader from '../Post/DecidingEndsHeader';
import ListingVoteProgress from '../Post/ListingVoteProgress';
import ActivityTypeChip from '../Post/ActivityTypeChip';
import StatusChip from '../Post/StatusTag';
import PostTags from '../Post/PostTags';
import ReactionSummary from '../Post/ReactionSummary';
import AddReactionBtn from '../Post/AddReactionBtn';
import AddViewBtn from '../Post/AddViewBtn';
import AddSubscriptionBtn from '../Post/AddSubscriptionBtn';
import SharePostBtn from '../Post/SharePostBtn';

function PostListingCard() {
	return (
		<Card
			shadow='none'
			className='flex flex-col gap-3 border border-primary_border px-6 py-4'
		>
			{/* Post Listing Header */}
			<div className='flex h-[26px] items-center gap-2.5 text-sm'>
				<UserIdentity />
				<Divider orientation='vertical' />
				<DateHeader date={new Date()} />
				<Divider orientation='vertical' />
				<DecidingEndsHeader />
				<Divider orientation='vertical' />
				<ListingVoteProgress />
				<Divider orientation='vertical' />
				<ActivityTypeChip type={ActivityType.FELLOWSHIP_RULE} />
				<Divider orientation='vertical' />
				<StatusChip status={ProposalStatus.ACTIVE} />
			</div>

			<section className='flex gap-2'>
				<p className='mt-0.5 text-xs font-normal text-secondary-700'>#{2}</p>
				<article className='flex flex-col gap-1'>
					<h2 className='text-sm font-medium'>Standard Guidelines to judge Liquidity Treasury Proposals on the main governance side - Kusama and Polkadot your Vote!</h2>
					<p className='line-clamp-2 text-sm'>
						Based on the income to the treasuries, the amounts getting burned and the amounts going to proposals, the treasury can be utilised: this includes spending funds,
						extending the comments period, and burning funds. The treasury is a key part of the governance system, and it is important that it is used effectively.
					</p>
					<Link
						className='mb-0.5 text-xs text-link'
						href={`/post/${2}`}
					>
						Read more
					</Link>
					<PostTags tags={['tag1', 'tag2', 'big tag text']} />
				</article>
			</section>

			{/* Reactions Info Bar */}
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

			<Divider />

			{/* Post Action Bar */}
			<section className='flex items-center justify-between'>
				<div className='flex items-center gap-0.5'>
					<AddReactionBtn />

					<span className='text-xs'>16</span>
				</div>

				<div className='flex items-center gap-0.5'>
					<AddViewBtn />

					<span className='text-xs'>45</span>
				</div>

				<div className='flex items-center gap-0.5'>
					<AddSubscriptionBtn />

					<span className='text-xs'>16</span>
				</div>

				<div className='flex items-center gap-0.5'>
					<SharePostBtn />

					<span className='text-xs'>16</span>
				</div>
			</section>
		</Card>
	);
}

export default PostListingCard;

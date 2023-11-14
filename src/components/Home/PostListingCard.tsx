// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Card } from '@nextui-org/card';
import React from 'react';
import { Divider } from '@nextui-org/divider';
import { ActivityType, PostListingItem, ProposalType } from '@/global/types';
import Link from 'next/link';
import { getSinglePostLinkFromProposalType } from '@/utils/getSinglePostLinkFromProposalType';
import PostActionBar from '../Post/PostActionBar';
import PostReactionInfoBar from '../Post/PostReactionInfoBar';
import PostListingHeader from '../Post/PostListingHeader';
import PostListingBody from '../Post/PostListingBody';
import NotVotedYetCard from '../Post/NotVotedYetCard';

// TODO: Implement this
const SHOW_NOT_VOTED = false;

interface Props {
	feedItem: PostListingItem;
}

function PostListingCard({ feedItem }: Props) {
	return (
		<article>
			<Card
				shadow='none'
				className='border border-primary_border'
				isHoverable
				isPressable
				as={Link}
				href={`/${getSinglePostLinkFromProposalType(feedItem.proposalType)}/${feedItem.id}`}
			>
				{/* Need this wrapper div because isPressable breaks styles */}
				<div className={`flex flex-col gap-3 px-6 py-4 text-left ${SHOW_NOT_VOTED && 'pb-[35px]'}`}>
					<PostListingHeader
						activityType={feedItem.proposalType === ProposalType.FELLOWSHIP_REFERENDUMS ? ActivityType.GENERAL_PROPOSAL : undefined}
						address={feedItem.on_chain_info?.proposer}
						createdAt={feedItem.created_at}
						votesTally={feedItem.on_chain_info?.tally}
						status={feedItem.on_chain_info?.status}
					/>
					<PostListingBody
						index={feedItem.id}
						title={feedItem.title}
						content={feedItem.content}
						tags={feedItem.tags}
					/>
					<PostReactionInfoBar commentCount={feedItem.comments_count} />
					<Divider />
					<PostActionBar />
				</div>
				{SHOW_NOT_VOTED && <NotVotedYetCard />}
			</Card>
		</article>
	);
}

export default PostListingCard;

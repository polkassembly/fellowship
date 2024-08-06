// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Card } from '@nextui-org/card';
import React from 'react';
import { Divider } from '@nextui-org/divider';
import { ActivityType, PostListingItem, ProposalType } from '@/global/types';
import { getSinglePostLinkFromProposalType } from '@/utils/getSinglePostLinkFromProposalType';
import VOTABLE_STATUSES from '@/global/constants/votableStatuses';
import classNames from 'classnames';
import PostActionBar from '../Post/PostActionBar';
import PostReactionInfoBar from '../Post/PostReactionInfoBar';
import ContentListingHeader from '../Post/ContentListingHeader';
import PostListingBody from '../Post/PostListingBody';
import NotVotedYetCard from '../Post/NotVotedYetCard';
import LinkWithNetwork from '../Misc/LinkWithNetwork';

// TODO: Implement this
const SHOW_NOT_VOTED = false;

interface Props {
	feedItem: PostListingItem;
	cardClassName?: string;
	isDividerDisabled?: boolean;
}

function PostListingCard({ feedItem, cardClassName, isDividerDisabled }: Props) {
	return (
		<article className='w-full md:max-w-[calc(100vw-300px)] xl:max-w-[calc(100vw-600px)]'>
			<Card
				shadow='none'
				className={classNames('border border-primary_border', cardClassName)}
				isHoverable
				isPressable
				as={LinkWithNetwork}
				href={`/${getSinglePostLinkFromProposalType(feedItem.proposalType)}/${feedItem.id}`}
			>
				{/* Need this wrapper div because isPressable breaks styles */}
				<div className={`flex flex-col gap-3 px-6 py-4 text-left ${SHOW_NOT_VOTED && 'pb-[35px]'}`}>
					<ContentListingHeader
						postId={String(feedItem.id)}
						activityType={
							feedItem.proposalType === ProposalType.FELLOWSHIP_REFERENDUMS && feedItem.on_chain_info?.status && VOTABLE_STATUSES.includes(feedItem.on_chain_info?.status)
								? ActivityType.GENERAL_PROPOSAL
								: feedItem.proposalType === ProposalType.DISCUSSIONS
									? ActivityType.INDUCTION
									: undefined
						}
						address={feedItem.proposer_address}
						username={feedItem.username}
						createdAt={feedItem.created_at}
						votesTally={feedItem.on_chain_info?.tally}
						status={feedItem.on_chain_info?.status}
						index={feedItem.id}
					/>
					<PostListingBody
						index={feedItem.id}
						title={feedItem.title}
						content={feedItem.content}
						tags={feedItem.tags}
					/>
					<PostReactionInfoBar
						latestReaction={feedItem.latest_reaction ?? undefined}
						totalReactions={feedItem.reactions_count}
						commentCount={feedItem.comments_count}
					/>
					{isDividerDisabled ? null : <Divider />}

					<PostActionBar
						postId={feedItem.id}
						postType={feedItem.proposalType}
						reactions={feedItem.reactions}
						views={feedItem.views}
					/>
				</div>
				{SHOW_NOT_VOTED && <NotVotedYetCard />}
			</Card>
		</article>
	);
}

export default PostListingCard;

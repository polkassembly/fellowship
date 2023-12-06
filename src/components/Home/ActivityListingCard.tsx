// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Card } from '@nextui-org/card';
import React, { ReactNode } from 'react';
import { Divider } from '@nextui-org/divider';
import { ActivityFeedItem, SubsquidActivityType } from '@/global/types';
import RANK_CONSTANTS from '@/global/constants/rankConstants';
import PostReactionInfoBar from '../Post/PostReactionInfoBar';
import PostActionBar from '../Post/PostActionBar';
import Address from '../Profile/Address';
import DateHeader from '../Post/ContentListingHeader/DateHeader';
import LinkWithNetwork from '../Misc/LinkWithNetwork';
// import PostActionBar from '../Post/PostActionBar';

interface Props {
	feedItem: ActivityFeedItem;
}

function ActivityListingCard({ feedItem }: Props) {
	if (feedItem.postListingItem) return null;

	const getActivityText = () => {
		let node: ReactNode;

		switch (feedItem.type) {
			case SubsquidActivityType.ActivityChanged:
				node = (
					<>
						<Address
							variant='inline'
							address={feedItem.who}
							truncateCharLen={5}
						/>
						&nbsp;changed their status to
						{feedItem.isActive ? ' active' : ' inactive'}
					</>
				);
				break;
			case SubsquidActivityType.CycleStarted:
				node = (
					<>
						A new salary cycle has started
						{feedItem.cycleStartDatetime && (
							<>
								&nbsp;on&nbsp;
								<DateHeader date={feedItem.cycleStartDatetime} />
							</>
						)}
					</>
				);
				break;
			case SubsquidActivityType.EvidenceSubmitted:
				node = (
					<>
						<Address
							variant='inline'
							address={feedItem.who}
						/>
						&nbsp; submitted an evidence :&nbsp;{feedItem.evidence}
					</>
				);
				break;
			case SubsquidActivityType.SalaryInduction:
				node = (
					<>
						<Address
							variant='inline'
							address={feedItem.who}
							truncateCharLen={5}
						/>
						&nbsp; was inducted for salary
						{feedItem.cycleStartDatetime && (
							<>
								&nbsp;on&nbsp;
								<DateHeader date={feedItem.cycleStartDatetime} />
							</>
						)}
					</>
				);
				break;
			case SubsquidActivityType.Demoted:
				node = (
					<>
						<Address
							variant='inline'
							address={feedItem.who}
							truncateCharLen={5}
						/>
						&nbsp;was demoted to&nbsp;{RANK_CONSTANTS[Number(feedItem.rank)]?.name} ({feedItem.rank})
					</>
				);
				break;
			case SubsquidActivityType.Promoted:
				node = (
					<>
						<Address
							variant='inline'
							address={feedItem.who}
							truncateCharLen={5}
						/>
						&nbsp;was promoted to&nbsp;{RANK_CONSTANTS[Number(feedItem.rank)]?.name} ({feedItem.rank})
					</>
				);
				break;
			case SubsquidActivityType.Inducted:
				node = (
					<>
						<Address
							variant='inline'
							address={feedItem.who}
							truncateCharLen={5}
						/>
						&nbsp;was inducted
						{feedItem.created_at && (
							<>
								&nbsp;on&nbsp;
								<DateHeader date={feedItem.created_at} />
							</>
						)}
					</>
				);
				break;
			case SubsquidActivityType.OffBoarded:
				node = (
					<>
						<Address
							variant='inline'
							address={feedItem.who}
							truncateCharLen={5}
						/>
						&nbsp;was off-boarded
						{feedItem.created_at && (
							<>
								&nbsp;on&nbsp;
								<DateHeader date={feedItem.created_at} />
							</>
						)}
					</>
				);
				break;
			case SubsquidActivityType.Payout:
				node = (
					<>
						<Address
							variant='inline'
							address={feedItem.who}
							truncateCharLen={5}
						/>
						&nbsp;recieved a payout
						{feedItem.created_at && (
							<>
								&nbsp;on&nbsp;
								<DateHeader date={feedItem.created_at} />
							</>
						)}
					</>
				);
				break;
			case SubsquidActivityType.Retained:
				node = (
					<>
						<Address
							variant='inline'
							address={feedItem.who}
							truncateCharLen={5}
						/>
						&nbsp;was successfully retained at&nbsp;{RANK_CONSTANTS[Number(feedItem.rank)]?.name} ({feedItem.rank})
					</>
				);
				break;
			case SubsquidActivityType.Registration:
				node = (
					<>
						<Address
							variant='inline'
							address={feedItem.who}
							truncateCharLen={5}
						/>
						&nbsp; was registered for salary
						{feedItem.cycleStartDatetime && (
							<>
								&nbsp;on&nbsp;
								<DateHeader date={feedItem.cycleStartDatetime} />
							</>
						)}
					</>
				);
				break;
			case SubsquidActivityType.Voted:
				node = (
					<>
						<Address
							variant='inline'
							address={feedItem.who}
							truncateCharLen={5}
						/>
						&nbsp;voted&nbsp;{feedItem.vote?.decision} on&nbsp;{' '}
						<LinkWithNetwork
							className='text-link'
							href={`/referenda/${feedItem.vote?.proposalIndex}`}
						>
							referenda #{feedItem.vote?.proposalIndex}
						</LinkWithNetwork>
						{feedItem.created_at && (
							<>
								&nbsp;on&nbsp;
								<DateHeader date={feedItem.created_at} />
							</>
						)}
					</>
				);
				break;
			case SubsquidActivityType.Imported:
				node = (
					<>
						<Address
							variant='inline'
							address={feedItem.who}
							truncateCharLen={5}
						/>
						&nbsp;was imported to the fellowship
						{feedItem.created_at && (
							<>
								&nbsp;on&nbsp;
								<DateHeader date={feedItem.created_at} />
							</>
						)}
					</>
				);
				break;
			default:
				node = feedItem.type;
				break;
		}
		return <div className='flex flex-wrap items-center justify-start text-sm'>{node}</div>;
	};

	return (
		<article>
			<Card
				shadow='none'
				className='flex flex-col gap-3 border border-primary_border px-6 py-4'
			>
				<div className='flex gap-3 text-sm'>
					<div>{getActivityText()}</div>
				</div>
				<PostReactionInfoBar
					commentCount={null}
					latestReaction={feedItem.reactions?.[0]}
					totalReactions={feedItem.reactions?.length}
				/>
				<Divider />
				<PostActionBar
					postId={feedItem.id}
					reactions={feedItem.reactions || []}
					views={feedItem.views || []}
				/>
			</Card>
		</article>
	);
}

export default ActivityListingCard;

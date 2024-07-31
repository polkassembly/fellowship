// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Card } from '@nextui-org/card';
import React from 'react';
import { ActivityType, RFCPullRequestItem } from '@/global/types';
import classNames from 'classnames';
import LinkWithNetwork from '@/components/Misc/LinkWithNetwork';
import { Divider } from '@nextui-org/divider';
import DateHeader from '@/components/Post/ContentListingHeader/DateHeader';
import ActivityActionTypeChip from '@/components/Post/ContentListingHeader/ActivityActionTypeChip';

interface Props {
	feedItem: RFCPullRequestItem;
	cardClassName?: string;
}

function RFCPullRequestListingCard({ feedItem, cardClassName }: Props) {
	return (
		<article className='max-w-[calc(100vw-300px)] xl:max-w-[calc(100vw-600px)]'>
			<Card
				shadow='none'
				className={classNames('border border-primary_border bg-cardBg', cardClassName)}
				isHoverable
				isPressable
				as={LinkWithNetwork}
				target='_blank'
				rel='noreferrer noopener'
				href={feedItem.url}
			>
				{/* Need this wrapper div because isPressable breaks styles */}
				<div className='flex flex-col gap-3 px-6 py-4 text-left'>
					<div className='flex justify-between'>
						<div className='flex items-center gap-3 text-xs'>
							{feedItem.username}
							<Divider
								className='h-[12px]'
								orientation='vertical'
							/>
							<DateHeader date={feedItem.created_at} />
						</div>

						<ActivityActionTypeChip
							postId={String(feedItem.id)}
							type={ActivityType.RFC_PULL_REQUEST}
						/>
					</div>

					<section className='flex gap-2'>
						<p className='mt-0.5 text-xs font-normal text-slate-500'>#{feedItem.id}</p>
						<article className='flex flex-col gap-1'>
							<h2 className='text-sm font-medium'>{feedItem.title}</h2>
						</article>
					</section>
				</div>
			</Card>
		</article>
	);
}

export default RFCPullRequestListingCard;

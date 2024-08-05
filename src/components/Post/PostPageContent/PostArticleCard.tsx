// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { Card } from '@nextui-org/card';
import React from 'react';
import { usePostDataContext } from '@/contexts';
import { Tabs, Tab } from '@nextui-org/tabs';
import { ScrollShadow } from '@nextui-org/scroll-shadow';
import { Divider } from '@nextui-org/divider';
import Markdown from '@/components/TextEditor/Markdown';
import { ActivityType } from '@/global/types';
import ContentListingHeader from '../ContentListingHeader';
import PostTags from '../PostTags';
import PostActionBar from '../PostActionBar';
import OnChainInfo from './OnChainInfo';
import Timeline from './Timeline';

interface Props {
	className?: string;
	onlyDescriptionTab?: boolean;
}

function PostArticleCard({ className, onlyDescriptionTab }: Props) {
	const { postData } = usePostDataContext();

	const onChainTabs = [
		{
			id: 'timeline',
			label: 'Timeline',
			content: <Timeline statusHistory={postData?.on_chain_info?.statusHistory} />
		},
		// {
		// id: 'audit',
		// label: 'Audit',
		// content: <p>3</p>
		// },
		{
			id: 'on-chain-info',
			label: 'On Chain Info',
			content: <OnChainInfo onChainInfo={postData.on_chain_info} />
		}
	];

	const tabs = [
		{
			id: 'description',
			label: 'Description',
			content: <Markdown md={postData.content} />
		},
		...onChainTabs
	];

	return (
		<article className={className}>
			<Card
				shadow='none'
				className='flex flex-col gap-3 border border-primary_border bg-cardBg pb-4 pt-6'
			>
				<div className='px-6'>
					<ContentListingHeader
						createdAt={postData.created_at}
						address={postData.inductee_address || postData.on_chain_info?.proposer}
						status={postData.on_chain_info?.status}
						activityType={postData.inductee_address ? ActivityType.INDUCTION : undefined}
					/>
				</div>

				<section className='mt-1 flex gap-2 px-6'>
					<p className='text-secondaryText mt-0.5 text-base font-normal'>#{postData.id}</p>
					<article className='flex flex-col gap-1'>
						<h2 className='text-lg font-semibold md:text-xl'>{postData.title}</h2>
						{postData.tags.length > 0 && <PostTags tags={postData.tags} />}
					</article>
				</section>

				<section>
					{onlyDescriptionTab ? (
						<ScrollShadow className='max-h-[55vh] px-6'>
							<Markdown md={postData.content} />
						</ScrollShadow>
					) : (
						<Tabs
							aria-label='Tabs'
							color='primary'
							variant='underlined'
							className='w-full border-b-1 border-b-gray-300/70 px-3 md:pl-16'
							classNames={{
								tabList: 'gap-12 w-full relative rounded-none p-0 border-b-0 border-divider',
								cursor: 'w-full bg-primary_accent',
								tab: 'max-w-fit px-0 h-12',
								tabContent: 'group-data-[selected=true]:text-primary text-foreground hover:text-primary group-data-[selected=true]:font-medium'
							}}
							items={tabs}
						>
							{(item) => (
								<Tab
									key={item.id}
									title={item.label}
								>
									<ScrollShadow className='max-h-[55vh] px-6'>{item.content}</ScrollShadow>
								</Tab>
							)}
						</Tabs>
					)}
				</section>

				<Divider />

				<PostActionBar
					postId={postData.id}
					postType={postData.proposalType}
					className='px-6 pr-9'
					reactions={postData?.reactions}
					views={postData?.views}
				/>
			</Card>
		</article>
	);
}

export default PostArticleCard;

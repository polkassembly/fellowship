// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import ActivityFeed from '@/components/Home/ActivityFeed';
import ActivitySelectorCard from '@/components/Home/ActivitySelectorCard';
import Carousel from '@/components/Home/Carousel';
import JoinFellowshipCard from '@/components/Home/JoinFellowshipCard';
import Stats from '@/components/Home/Stats';
import TrendingProposals from '@/components/Home/TrendingProposals';
import { API_ERROR_CODE } from '@/global/constants/errorCodes';
import { ClientError } from '@/global/exceptions';
import MESSAGES from '@/global/messages';
import { ActivityFeedItem, EActivityFeed, Network, PostListingItem, ServerComponentProps } from '@/global/types';
import { headers } from 'next/headers';
import { Metadata } from 'next';
import getOriginUrl from '@/utils/getOriginUrl';
import PostFeed from '@/components/Home/PostFeed';
import PendingTasks from '@/components/Home/PendingTasks';
import getActivityFeed from './api/v1/feed/getActivityFeed';
import getTrendingProposals from './api/v1/feed/trending/getTrendingProposals';

type SearchParamProps = {
	feed: string;
	network?: string;
};

export const metadata: Metadata = {
	title: 'Fellowship | Home',
	description: 'Fellowship never felt so good before. - Home'
};

export default async function Home({ searchParams }: ServerComponentProps<unknown, SearchParamProps>) {
	// TODO: default should be pending if user is logged in and is a fellow
	const { feed = EActivityFeed.ALL, network } = searchParams ?? {};

	// validate feed search param
	if (feed && !Object.values(EActivityFeed).includes(feed as EActivityFeed)) {
		throw new ClientError(MESSAGES.INVALID_SEARCH_PARAMS_ERROR, API_ERROR_CODE.INVALID_SEARCH_PARAMS_ERROR);
	}

	const headersList = headers();
	const originUrl = getOriginUrl(headersList);

	const feedItems = await getActivityFeed({ feedType: feed as EActivityFeed, originUrl, network: network as Network });

	const trending = await getTrendingProposals({ originUrl, network: network as Network });

	return (
		<div className='flex w-full flex-col gap-y-8'>
			<Carousel />

			<div className='mb-16 flex flex-col items-center gap-8 md:mb-auto lg:flex-row lg:items-start'>
				<div className='flex w-full flex-col gap-y-4 lg:max-w-[calc(100%-300px)]'>
					<PendingTasks className='md:hidden' />
					<Stats className='lg:hidden' />
					<ActivitySelectorCard value={feed as EActivityFeed} />
					{feed === EActivityFeed.ALL ? <ActivityFeed items={(feedItems || []) as ActivityFeedItem[]} /> : <PostFeed items={(feedItems || []) as PostListingItem[]} />}
				</div>
				<div className='flex w-full flex-col gap-y-4 lg:w-[300px]'>
					<PendingTasks className='hidden md:flex' />
					<Stats className='hidden lg:flex' />
					<JoinFellowshipCard />
					<TrendingProposals proposals={trending} />
				</div>
			</div>
		</div>
	);
}

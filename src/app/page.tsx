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
import { EActivityFeed, PostListingItem, ServerComponentProps } from '@/global/types';
import { headers } from 'next/headers';
import { Metadata } from 'next';
import getOriginFromHeaders from './api/api-utils/getOriginFromHeaders';

type SearchParamProps = {
	feed: string;
};

export const metadata: Metadata = {
	title: 'Fellowship | Home',
	description: 'Fellowship never felt so good before. - Home'
};

async function getActivityFeed({ feedType, originUrl }: { feedType: EActivityFeed; originUrl: string }) {
	const feedRes = await fetch(`${originUrl}/api/v1/feed`, {
		body: JSON.stringify({ feedType }),
		method: 'POST',
		cache: 'no-cache' // TODO: remove this on prod
	}).catch((e) => {
		throw new ClientError(`${MESSAGES.STREAM_ERROR} - ${e?.message}`, API_ERROR_CODE.STREAM_ERROR);
	});

	const reader = await feedRes?.body
		?.getReader()
		?.read()
		.catch((e) => {
			throw new ClientError(`${MESSAGES.STREAM_ERROR} - ${e?.message}`, API_ERROR_CODE.STREAM_ERROR);
		});

	const readVal = reader?.value;

	let feedItems: PostListingItem[] = [];

	if (readVal) {
		const textDecoder = new TextDecoder();
		const jsonString = textDecoder.decode(readVal);
		const parsedObject = JSON.parse(jsonString);

		feedItems = parsedObject;
	}

	return feedItems;
}

export default async function Home({ searchParams }: ServerComponentProps<unknown, SearchParamProps>) {
	// TODO: default should be pending if user is logged in and is a fellow
	const { feed = EActivityFeed.ALL } = searchParams ?? {};

	// validate feed search param
	if (feed && !Object.values(EActivityFeed).includes(feed as EActivityFeed)) {
		throw new ClientError(MESSAGES.INVALID_SEARCH_PARAMS_ERROR, API_ERROR_CODE.INVALID_SEARCH_PARAMS_ERROR);
	}

	const headersList = headers();
	const originUrl = getOriginFromHeaders(headersList);

	const feedItems = await getActivityFeed({ feedType: feed as EActivityFeed, originUrl });

	return (
		<div className='flex w-full flex-col gap-y-8'>
			<Carousel />

			<div className='flex flex-col items-center gap-8 xl:flex-row xl:items-start'>
				<div className='flex w-full flex-col gap-y-4'>
					<ActivitySelectorCard value={feed as EActivityFeed} />
					<ActivityFeed items={feedItems} />
				</div>
				<div className='flex w-6/12 flex-col gap-y-4 xl:w-4/12'>
					<Stats />
					<JoinFellowshipCard />
					<TrendingProposals />
				</div>
			</div>
		</div>
	);
}

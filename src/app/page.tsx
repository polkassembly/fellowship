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
import { EActivityFeed, ServerComponentProps } from '@/global/types';
import consolePretty from '@/utils/consolePretty';

type SearchParamProps = {
	feed: string;
};

export default async function Home({ searchParams }: ServerComponentProps<unknown, SearchParamProps>) {
	const { feed = EActivityFeed.ALL } = searchParams ?? {};

	// validate feed search param
	if (feed && !Object.values(EActivityFeed).includes(feed as EActivityFeed)) {
		throw new ClientError(MESSAGES.INVALID_SEARCH_PARAMS_ERROR, API_ERROR_CODE.INVALID_SEARCH_PARAMS_ERROR);
	}

	const feedRes = await fetch('http://localhost:3000/api/v1/feed', {
		body: JSON.stringify({ feed }),
		method: 'POST',
		cache: 'no-cache'
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

	if (readVal) {
		const textDecoder = new TextDecoder();
		const jsonString = textDecoder.decode(readVal);
		const parsedObject = JSON.parse(jsonString);

		consolePretty({ parsedObject2: parsedObject });
	}

	// TODO: default should be pending if user is logged in and is a fellow

	return (
		<div className='flex w-full flex-col gap-y-8'>
			<Carousel />

			<div className='flex flex-col items-center gap-8 xl:flex-row xl:items-start'>
				<div className='flex w-full flex-col gap-y-4'>
					<ActivitySelectorCard value={feed as EActivityFeed} />
					<ActivityFeed />
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

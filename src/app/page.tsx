// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import ActivitySelectorCard from '@/components/Home/ActivitySelectorCard';
import Carousel from '@/components/Home/Carousel';
import JoinFellowshipCard from '@/components/Home/JoinFellowshipCard';
import Stats from '@/components/Home/Stats';
import TrendingProposals from '@/components/Home/TrendingProposals';
import { InvalidSearchParamsError } from '@/global/exceptions';
import { EActivityFeed, ServerComponentProps } from '@/global/types';

type SearchParamProps = {
	feed: string;
};

export default async function Home({ searchParams }: ServerComponentProps<unknown, SearchParamProps>) {
	const { feed = EActivityFeed.ALL } = searchParams ?? {};

	// TODO: default should be pending if user is logged in and is a fellow

	// validate feed search param
	if (feed && !Object.values(EActivityFeed).includes(feed as EActivityFeed)) {
		throw new InvalidSearchParamsError();
	}

	return (
		<div className='flex w-full flex-col gap-y-8'>
			<Carousel />

			<div className='flex flex-col items-center gap-8 xl:flex-row xl:items-start'>
				<div className='flex w-full flex-col gap-y-4'>
					<ActivitySelectorCard value={feed as EActivityFeed} />

					<div className='flex w-full flex-col gap-y-4'>
						<div id='feed-item-1'>Item 1</div>
						<div id='feed-item-2'>Item 2</div>
						<div id='feed-item-3'>Item 3</div>
					</div>
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

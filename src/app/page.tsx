// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import ActivitySelectorCard from '@/components/Home/ActivitySelectorCard';
import Carousel from '@/components/Home/Carousel';
import { InvalidSearchParamsError } from '@/global/exceptions';
import { EActivityFeed, ServerComponentProps } from '@/global/types';

type SearchParamProps = {
	feed: string;
};

export default async function Home({ searchParams }: ServerComponentProps<unknown, SearchParamProps>) {
	const { feed = EActivityFeed.ALL } = searchParams ?? {};

	// validate feed
	if (feed && !Object.values(EActivityFeed).includes(feed as EActivityFeed)) {
		throw new InvalidSearchParamsError();
	}

	return (
		<div className='flex w-full flex-col gap-y-8'>
			<Carousel />

			<div className='flex gap-x-8'>
				<div className='flex w-full flex-col gap-y-4'>
					<ActivitySelectorCard value={feed as EActivityFeed} />
				</div>
				<div className='flex w-4/12 flex-col bg-teal-600'>World</div>
			</div>
		</div>
	);
}

// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { API_ERROR_CODE } from '@/global/constants/errorCodes';
import { ClientError } from '@/global/exceptions';
import MESSAGES from '@/global/messages';
import { EActivityFeed, Network, ServerComponentProps } from '@/global/types';
import { headers } from 'next/headers';
import { Metadata } from 'next';
import getOriginUrl from '@/utils/getOriginUrl';
import getActivityFeed from './api/v1/feed/getActivityFeed';
import HomeClientWrapper from '@/app/HomeClientWrapper';

type SearchParamProps = {
	feed: string;
	network?: string;
};

export const metadata: Metadata = {
	title: 'Fellowship | Home',
	description: 'Fellowship never felt so good before. - Home'
};

export default async function Home({ searchParams }: Readonly<ServerComponentProps<unknown, SearchParamProps>>) {
	const { feed = EActivityFeed.ALL, network } = searchParams ?? {};

	// validate feed search param
	if (feed && !Object.values(EActivityFeed).includes(feed as EActivityFeed)) {
		throw new ClientError(MESSAGES.INVALID_SEARCH_PARAMS_ERROR, API_ERROR_CODE.INVALID_SEARCH_PARAMS_ERROR);
	}

	const headersList = headers();
	const originUrl = getOriginUrl(headersList);

	const feedItems = await getActivityFeed({ feedType: feed as EActivityFeed, originUrl, network: network as Network });

	return (
		<HomeClientWrapper
			feedItems={feedItems}
			feed={feed as EActivityFeed}
			network={network as Network}
			originUrl={originUrl}
		/>
	);
}

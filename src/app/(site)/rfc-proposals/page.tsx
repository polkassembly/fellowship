// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { EActivityFeed, Network, PostListingItem, ServerComponentProps } from '@/global/types';
import { headers } from 'next/headers';
import { Metadata } from 'next';
import getOriginUrl from '@/utils/getOriginUrl';
import getActivityFeed from '@/app/api/v1/feed/getActivityFeed';
import Image from 'next/image';
import VotingProposalsFeed from '@/components/VotingProposals';

type SearchParamProps = {
	feed: string;
	network?: string;
};

export const metadata: Metadata = {
	title: 'Fellowship | Home',
	description: 'Fellowship never felt so good before. - Home'
};

export default async function RFCProposalsPage({ searchParams }: ServerComponentProps<unknown, SearchParamProps>) {
	// TODO: default should be pending if user is logged in and is a fellow
	const { network } = searchParams ?? {};

	const headersList = headers();
	const originUrl = getOriginUrl(headersList);

	const feedItems = (await getActivityFeed({ feedType: EActivityFeed.RFC_PROPOSALS, originUrl, network: network as Network })) as PostListingItem[];

	return (
		<div className='flex w-full flex-col gap-y-8'>
			<div className='flex items-center rounded-[20px] border border-primary_border px-6 py-4'>
				<Image
					alt='Vote icon'
					src='/icons/vote-filled.svg'
					width={24}
					height={24}
					className='mr-2'
				/>
				<div>
					<h3 className='text-xl font-semibold leading-6'>RFC Proposals</h3>
				</div>
			</div>

			<VotingProposalsFeed
				feedType={EActivityFeed.RFC_PROPOSALS}
				items={feedItems}
			/>
		</div>
	);
}

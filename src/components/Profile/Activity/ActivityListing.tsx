// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import getUserActivityFeed from '@/app/api/v1/address/[address]/activity/getUserActivityFeed';
import React, { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/Misc/LoadingSpinner';
import { useApiContext } from '@/contexts';
import getOriginUrl from '@/utils/getOriginUrl';
import { ScrollShadow } from '@nextui-org/scroll-shadow';
import { UserActivityListingItem } from '@/global/types';
import Image from 'next/image';
import { Button } from '@nextui-org/button';
import ListingItem from './ListingItem';

interface ActivityListingProps {
	address: string;
	items: UserActivityListingItem[];
}

function ActivityListing({ address, items }: ActivityListingProps) {
	const { network } = useApiContext();

	const [page, setPage] = useState(1);
	const [feedItems, setFeedItems] = useState<UserActivityListingItem[]>([]);
	const [isFetching, setIsFetching] = useState(false);
	const [isLastPage, setIsLastPage] = useState(false);

	useEffect(() => {
		setFeedItems(items || []);
	}, [items]);

	useEffect(() => {
		setIsLastPage(false);
	}, [network]);

	const handleLoadMore = async () => {
		setIsFetching(true);
		const originUrl = getOriginUrl();
		const nextPage = page ? page + 1 : 1;
		const newFeedItems = await getUserActivityFeed({ address, originUrl, page: nextPage, network });

		if (newFeedItems.length) {
			const allItems = [...feedItems, ...newFeedItems];
			setFeedItems(allItems);
			setPage(nextPage);
		} else {
			setIsLastPage(true);
		}

		setIsFetching(false);
	};

	if (!feedItems.length) {
		return (
			<div className='flex h-full flex-1 flex-col items-center justify-center py-10 text-sm font-normal leading-[21px] tracking-[0.14px] text-secondary'>
				<Image
					alt='empty user-activity icon'
					src='/icons/empty-states/user-activity.svg'
					width={164}
					height={156}
					className='cursor-pointer'
				/>
				<p className='m-0 mb-2 mt-[14px] p-0 text-base font-medium leading-6 tracking-[0.08px]'>No Activity Available</p>
				<p className='m-0 p-0 text-sm font-normal leading-[21px] tracking-[0.14px]'>You can see your likes, dislikes, comments, votes here</p>
			</div>
		);
	}

	return (
		<ScrollShadow className='flex max-h-screen w-full flex-col overflow-auto px-6 py-4'>
			{feedItems.map((feedItem, idx) => (
				<ListingItem
					key={feedItem.id}
					feedItem={feedItem}
					isLastItem={idx === feedItems.length - 1}
				/>
			))}

			{!isFetching && !isLastPage && (
				<Button
					className='mt-4 min-h-[40px]'
					onClick={handleLoadMore}
				>
					Load More
				</Button>
			)}

			{isFetching && !isLastPage && (
				<div className='mb-6 mt-2'>
					<LoadingSpinner message='Fetching feed...' />
				</div>
			)}

			{isLastPage && <div className='mb-6 mt-4 flex justify-center text-sm'>Yay! You have reached the end of the feed.</div>}
		</ScrollShadow>
	);
}

export default ActivityListing;

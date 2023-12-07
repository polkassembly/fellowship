// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import React, { useEffect, useRef, useState } from 'react';
import { EActivityFeed, ActivityFeedItem } from '@/global/types';
import { parseAsInteger, useQueryState } from 'next-usequerystate';
import { useParams, usePathname } from 'next/navigation';
import getActivityFeed from '@/app/api/v1/feed/getActivityFeed';
import getOriginUrl from '@/utils/getOriginUrl';
import { ScrollShadow } from '@nextui-org/scroll-shadow';
import { useApiContext } from '@/contexts';
import LoadingSpinner from '../Misc/LoadingSpinner';
import PostListingCard from './PostListingCard';
import ActivityListingCard from './ActivityListingCard';

// import InductionListingCard from './InductionListingCard';

interface Props {
	items: ActivityFeedItem[];
}

function ActivityFeed({ items }: Props) {
	const { feed = EActivityFeed.ALL } = useParams();
	const pathname = usePathname();

	const { network } = useApiContext();

	const observerTarget = useRef(null);

	const [page, setPage] = useQueryState('page', parseAsInteger);
	const [feedItems, setFeedItems] = useState<ActivityFeedItem[]>(items || []);
	const [isFetching, setIsFetching] = useState(false);
	const [isLastPage, setIsLastPage] = useState(false);

	useEffect(() => {
		setFeedItems(items || []);
	}, [items]);

	useEffect(() => {
		setIsLastPage(false);
	}, [network]);

	useEffect(() => {
		if (pathname === '/' && (!page || Number(page) < 1)) setPage(1);
	}, [page, pathname, setPage]);

	// eslint-disable-next-line sonarjs/cognitive-complexity
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (feedItems.length && entries[0].isIntersecting) {
					(async () => {
						setIsFetching(true);
						const originUrl = getOriginUrl();
						const nextPage = page ? page + 1 : 1;
						const newFeedItems = (await getActivityFeed({ feedType: feed as EActivityFeed, originUrl, page: nextPage, network })) as ActivityFeedItem[];

						if (newFeedItems.length) {
							const feedItemsMap: {
								[key: string]: ActivityFeedItem;
							} = {};
							const allItems = [...feedItems, ...newFeedItems];
							allItems.forEach((item) => {
								feedItemsMap[item.id] = item;
							});
							setFeedItems(Object.values(feedItemsMap).reverse());
							setPage(nextPage);
						} else {
							setIsLastPage(true);
						}

						setIsFetching(false);
					})();
				}
			},
			{ threshold: 1 }
		);

		if (observerTarget.current) {
			observer.observe(observerTarget.current);
		}

		return () => {
			if (observerTarget.current) {
				// eslint-disable-next-line react-hooks/exhaustive-deps
				observer.unobserve(observerTarget.current);
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [feed, observerTarget, page]);

	if (!feedItems.length) {
		return <div className='p-6 text-center text-sm'>No feed items found.</div>;
	}

	return (
		<ScrollShadow className='flex max-h-screen w-full flex-col gap-y-4 overflow-auto'>
			{feedItems.map((feedItem) => (
				<div key={feedItem.id}>{feedItem.postListingItem ? <PostListingCard feedItem={feedItem.postListingItem} /> : <ActivityListingCard feedItem={feedItem} />}</div>
			))}

			{!isFetching && !isLastPage && <div ref={observerTarget} />}

			{isFetching && !isLastPage && (
				<div className='mb-6 mt-2'>
					<LoadingSpinner message='Fetching feed...' />
				</div>
			)}

			{isLastPage && <div className='mb-6 mt-4 flex justify-center text-sm'>Yay! You have reached the end of the feed.</div>}
		</ScrollShadow>
	);
}

export default ActivityFeed;

// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import React, { useEffect, useRef, useState } from 'react';
import { RFCPullRequestItem } from '@/global/types';
import getOriginUrl from '@/utils/getOriginUrl';
import { ScrollShadow } from '@nextui-org/scroll-shadow';
import { useApiContext } from '@/contexts';
import LoadingSpinner from '@/components/Misc/LoadingSpinner';
import getRFCPullRequests from '@/app/api/v1/feed/rfc-pull-requests/getRFCPullRequests';
import RFCPullRequestListingCard from './RFCPullRequestListingCard';

// import InductionListingCard from './InductionListingCard';

interface Props {
	items: RFCPullRequestItem[];
}

export default function RFCPullRequestsFeed({ items }: Props) {
	const { network } = useApiContext();

	const observerTarget = useRef(null);

	const [feedItems, setFeedItems] = useState<RFCPullRequestItem[]>(items || []);
	const [isFetching, setIsFetching] = useState(false);
	const [isLastPage, setIsLastPage] = useState(false);

	useEffect(() => {
		setFeedItems(items || []);
	}, [items]);

	useEffect(() => {
		setIsLastPage(false);
	}, [network]);

	// eslint-disable-next-line sonarjs/cognitive-complexity
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (feedItems.length && entries[0].isIntersecting) {
					(async () => {
						setIsFetching(true);
						const originUrl = getOriginUrl();
						const newFeedItems = (await getRFCPullRequests({ originUrl, lastCursor: feedItems[feedItems.length - 1].cursor, network })) as RFCPullRequestItem[];

						if (newFeedItems.length) {
							const feedItemsMap: {
								[key: string]: RFCPullRequestItem;
							} = {};
							const allItems = [...feedItems, ...newFeedItems];
							allItems.forEach((item) => {
								feedItemsMap[item.id] = item;
							});
							setFeedItems(Object.values(feedItemsMap).reverse());
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
	}, [observerTarget]);

	if (!feedItems.length) {
		return <div className='p-6 text-center text-sm'>No feed items found.</div>;
	}

	return (
		<ScrollShadow className='flex max-h-screen w-full flex-col gap-y-4 overflow-auto'>
			{feedItems.map((feedItem) => (
				<RFCPullRequestListingCard
					key={feedItem.id}
					feedItem={feedItem}
				/>
			))}

			{!isFetching && !isLastPage && (
				<div
					className='bg-red-500'
					ref={observerTarget}
				/>
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

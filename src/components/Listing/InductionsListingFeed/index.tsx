// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import React, { useEffect, useRef, useState } from 'react';
import { PostListingItem } from '@/global/types';
import { parseAsInteger, useQueryState } from 'next-usequerystate';
import { usePathname } from 'next/navigation';
import getOriginUrl from '@/utils/getOriginUrl';
import { ScrollShadow } from '@nextui-org/scroll-shadow';
import { useApiContext } from '@/contexts';
import PostListingCard from '@/components/Home/PostListingCard';
import LoadingSpinner from '@/components/Misc/LoadingSpinner';
import getInductionsFeed from '@/app/api/v1/feed/inductions/getInductionsFeed';

// import InductionListingCard from './InductionListingCard';

interface Props {
	items: PostListingItem[];
}

function InductionsListingFeed({ items }: Props) {
	const pathname = usePathname();

	const { network } = useApiContext();

	const observerTarget = useRef(null);

	const [page, setPage] = useQueryState('page', parseAsInteger);
	const [feedItems, setFeedItems] = useState<PostListingItem[]>(items || []);
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
						const newFeedItems = (await getInductionsFeed({ originUrl, page: nextPage, network })) as PostListingItem[];

						if (newFeedItems.length) {
							const feedItemsMap: {
								[key: string]: PostListingItem;
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
	}, [observerTarget, page]);

	if (!feedItems.length) {
		return <div className='p-6 text-center text-sm'>No feed items found.</div>;
	}

	return (
		<ScrollShadow className='flex max-h-screen w-full flex-col gap-y-4 overflow-auto'>
			{feedItems.map((feedItem) => (
				<PostListingCard
					key={feedItem.id}
					feedItem={feedItem}
				/>
			))}

			{!isFetching && !isLastPage && <div ref={observerTarget} />}

			{isFetching && !isLastPage && (
				<div className='mb-6 mt-2'>
					<LoadingSpinner message='Fetching feed...' />
				</div>
			)}

			{isLastPage && <div className='mb-6 mt-4 flex justify-center text-sm'>Yay! You have reached the end of the feed.</div>}

			{/* <InductionListingCard /> */}
		</ScrollShadow>
	);
}

export default InductionsListingFeed;

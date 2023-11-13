// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import React, { useEffect, useRef, useState } from 'react';
import { PostListingItem, ProposalType, EActivityFeed } from '@/global/types';
import { parseAsInteger, useQueryState } from 'next-usequerystate';
import { useParams } from 'next/navigation';
import getActivityFeed from '@/app/api/v1/feed/getActivityFeed';
import getOriginUrl from '@/utils/getOriginUrl';
import { ScrollShadow } from '@nextui-org/scroll-shadow';
import PostListingCard from './PostListingCard';
import LoadingSpinner from '../Misc/LoadingSpinner';

// import InductionListingCard from './InductionListingCard';

interface Props {
	items: PostListingItem[];
}

function ActivityFeed({ items }: Props) {
	const observerTarget = useRef(null);
	const { feed = EActivityFeed.ALL } = useParams();

	const [page, setPage] = useQueryState('page', parseAsInteger);
	const [feedItems, setFeedItems] = useState<PostListingItem[]>(items || []);
	const [isFetching, setIsFetching] = useState(false);
	const [isLastPage, setIsLastPage] = useState(false);

	useEffect(() => {
		if (!page || Number(page) < 1) setPage(1);
	}, [page, setPage]);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (feedItems.length && entries[0].isIntersecting) {
					(async () => {
						setIsFetching(true);
						const originUrl = getOriginUrl();
						const nextPage = page ? page + 1 : 1;
						const newFeedItems = await getActivityFeed({ feedType: feed as EActivityFeed, originUrl, page: nextPage });

						if (newFeedItems.length) {
							setFeedItems([...feedItems, ...newFeedItems]);
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
				observer.unobserve(observerTarget.current);
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [feed, observerTarget, page]);

	return (
		<ScrollShadow className='flex max-h-screen w-full flex-col gap-y-4 overflow-auto'>
			{feedItems.map(
				(feedItem) =>
					feedItem.proposalType === ProposalType.FELLOWSHIP_REFERENDUMS && (
						<PostListingCard
							key={`${feedItem.proposalType}_${feedItem.id}`}
							feedItem={feedItem}
						/>
					)
			)}

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

export default ActivityFeed;

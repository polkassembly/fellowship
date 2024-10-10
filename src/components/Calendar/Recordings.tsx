// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import React, { useEffect, useRef, useState } from 'react';
import { IRecording } from '@/global/types';
import { parseAsInteger, useQueryState } from 'next-usequerystate';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import getOriginUrl from '@/utils/getOriginUrl';
import { ScrollShadow } from '@nextui-org/scroll-shadow';
import { useApiContext } from '@/contexts';
import getRecordings from '@/app/api/v1/recordings/getRecordings';
import LoadingSpinner from '../Misc/LoadingSpinner';
import RecordingListingCard from './RecordingListingCard';

function Recordings() {
	const pathname = usePathname();

	const { network } = useApiContext();
	const originUrl = getOriginUrl();

	const observerTarget = useRef(null);

	const [page, setPage] = useQueryState('page', parseAsInteger);
	const [recordings, setRecordings] = useState<IRecording[]>([]);
	const [totalCount, setTotalCount] = useState(0);
	const [isFetching, setIsFetching] = useState(false);
	const [isLastPage, setIsLastPage] = useState(false);

	useEffect(() => {
		async function fetchRecordings() {
			setIsFetching(true);
			try {
				const { totalCount: count, recordings: items } = await getRecordings({ originUrl, network });
				setRecordings(items || []);
				setTotalCount(count);
			} catch (error) {
				console.error('Failed to fetch recordings:', error);
			} finally {
				setIsFetching(false);
			}
		}

		fetchRecordings();
	}, [network, originUrl]);

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
				if (recordings.length && entries[0].isIntersecting) {
					(async () => {
						try {
							setIsFetching(true);
							const nextPage = page ? page + 1 : 1;
							const res = await getRecordings({ originUrl, page: nextPage, network });
							const newRecordings = res.recordings;

							if (newRecordings.length) {
								const recordingsMap = new Map<string, IRecording>();
								const allItems = [...recordings, ...newRecordings];
								allItems.forEach((item) => {
									recordingsMap.set(item.id, item);
								});
								setRecordings(Array.from(recordingsMap.values()));
								setPage(nextPage);
							} else {
								setIsLastPage(true);
							}
						} catch (error) {
							console.error('Failed to fetch recordings:', error);
						} finally {
							setIsFetching(false);
						}
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

	return (
		<>
			<div className='mb-5 flex w-full items-center gap-2 rounded-2xl border border-primary_border bg-cardBg p-5 shadow-md'>
				<Image
					src='/icons/recorder.svg'
					alt='calendar icon'
					width={32}
					height={32}
					className='dark:grayscale dark:invert dark:filter'
				/>
				<h2 className='w-full text-xl font-semibold'>
					Recordings <span className='ml-2 text-sm font-thin text-secondaryText'>{`(${totalCount})`}</span>
				</h2>
			</div>
			{!recordings.length ? (
				<div className='w-full rounded-2xl border border-primary_border bg-cardBg p-6 text-center text-sm shadow-md'>
					There are currently no recordings at this time. Please check back later!
				</div>
			) : (
				<ScrollShadow className='flex max-h-screen w-full flex-col gap-y-4 overflow-auto'>
					{recordings.map((recording) => (
						<RecordingListingCard
							key={recording.id}
							recording={recording}
						/>
					))}

					{!isFetching && !isLastPage && <div ref={observerTarget} />}

					{isFetching && !isLastPage && (
						<div className='mb-6 mt-2'>
							<LoadingSpinner message='Fetching feed...' />
						</div>
					)}

					{isLastPage && <div className='mb-6 mt-4 flex justify-center text-sm'>Yay! You have reached the end of the feed.</div>}
				</ScrollShadow>
			)}
		</>
	);
}

export default Recordings;

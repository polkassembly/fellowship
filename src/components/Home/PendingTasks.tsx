// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { Card } from '@nextui-org/card';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApiContext, useUserDetailsContext } from '@/contexts';
import { EActivityFeed } from '@/global/types';
import getPendingActivityCount from '@/app/api/v1/feed/pending/getPendingActivityCount';
import getOriginUrl from '@/utils/getOriginUrl';
import Progress from '../Misc/Progress';
import LoadingSpinner from '../Misc/LoadingSpinner';

function PendingTasks({ className }: Readonly<{ className?: string }>) {
	const { network } = useApiContext();
	const { loginAddress, addresses } = useUserDetailsContext();
	const router = useRouter();

	const [completedTasks, setCompletedTasks] = useState<number>(0);
	const [allTasks, setAllTasks] = useState<number>(54);

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		(async () => {
			setLoading(true);
			try {
				const originUrl = getOriginUrl();

				const data = await getPendingActivityCount({
					originUrl,
					address: loginAddress || addresses?.[0] || '',
					network,
					page: 1
				});
				if (data) {
					setCompletedTasks(data.userCompletedCount);
					setAllTasks(data.allPendingCount);
				}
			} catch (error) {
				//
			}
			setLoading(false);
		})();
	}, [network, loginAddress, addresses]);

	const handleShowPendingTasks = (activityValue: string) => {
		router.push(`/?feed=${activityValue}&network=${network}`);
	};

	return (
		<Card
			className={`flex flex-col items-center gap-y-6 border border-primary_border bg-cardBg p-6 ${className}`}
			shadow='none'
		>
			{loading ? (
				<LoadingSpinner message='fetching pending tasks...' />
			) : (
				<div>
					<button
						type='button'
						className='mb-3 cursor-pointer font-medium'
						onClick={() => handleShowPendingTasks(EActivityFeed.PENDING)}
					>
						Pending tasks &gt;
					</button>
					<div className='flex w-full flex-row items-center gap-3'>
						<div className='min-w-max rounded-full'>
							<Progress
								percentage={Math.round((Number(completedTasks ?? 0) / Number(allTasks ?? 0)) * 100)}
								size={80}
								color='#47BE61'
								strokeWidth={7}
							/>
						</div>

						<p className='text-xs'>
							you have completed <b>{completedTasks}</b> out of <b>{allTasks}</b> tasks
						</p>
					</div>
				</div>
			)}
		</Card>
	);
}

export default PendingTasks;

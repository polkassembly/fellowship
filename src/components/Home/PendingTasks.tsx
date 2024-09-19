// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { Card } from '@nextui-org/card';
import React, { useEffect, useState, cache } from 'react';
import { useApiContext } from '@/contexts';
import LoadingSpinner from '../Misc/LoadingSpinner';
import Progress from '../Misc/Progress';

const getPendingTasks = cache(() => {
	return 45;
});

function PendingTasks({ className }: Readonly<{ className?: string }>) {
	const { api, apiReady } = useApiContext();
	const [pendingTasks, setPendingTasks] = useState<number>(0);
	const [allTasks, setAllTasks] = useState<number>(54);

	const [loading, setLoading] = useState(true);

	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		async function fetchPendingTasks() {
			if (!api || !apiReady) return;

			try {
				const pendingTasks = await getPendingTasks();

				setPendingTasks(pendingTasks);
				setLoading(false);
			} catch (error) {
				console.error('Error fetching pendingTasks:', error);
				setLoading(false);
			}
		}

		fetchPendingTasks();
	}, [api, apiReady]);

	// only mount on client to prevent hydration error
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	return (
		<Card
			className={`flex flex-col items-center gap-y-6 border border-primary_border bg-cardBg p-6 ${className}`}
			shadow='none'
		>
			{loading ? (
				<LoadingSpinner message='fetching pending tasks...' />
			) : (
				<div>
					<h1 className='mb-3'>Pending tasks &gt;</h1>
					<div className='flex w-full flex-row items-center gap-3'>
						<div className='min-w-max rounded-full'>
							<Progress
								percentage={Math.round((pendingTasks / allTasks) * 100)}
								size={80}
								color='#47BE61'
								strokeWidth={7}
							/>
						</div>

						<p className='text-xs'>
							you have completed <b>{pendingTasks}</b> out of <b>{allTasks}</b> tasks
						</p>
					</div>
				</div>
			)}
		</Card>
	);
}

export default PendingTasks;
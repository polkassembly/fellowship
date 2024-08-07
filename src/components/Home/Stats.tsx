// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { Card } from '@nextui-org/card';
import React, { useEffect, useState } from 'react';

import Image from 'next/image';
import { useApiContext } from '@/contexts';

function StatDisplay({ heroImg, title, value, icon, percentage }: { heroImg: string; title: string; value: number; icon?: string; percentage?: number }) {
	return (
		<div className='flex w-full flex-row items-center'>
			<div className='min-w-max rounded-xl border-2 border-primary_border p-1'>
				<Image
					src={heroImg}
					alt='Stats Icon'
					className='h-[70px] w-[70px] rounded-lg md:h-[40px] md:w-[40px] xl:h-[65px] xl:w-[65px] 2xl:h-[70px] 2xl:w-[70px]'
					width={70}
					height={70}
				/>
			</div>
			<div className='ml-3 flex flex-col'>
				<small className='text-sm font-normal'>{title}</small>
				<p className='text-2xl font-semibold'>{value}</p>
				{percentage && (
					<small className='flex items-center text-xs font-normal'>
						{icon && (
							<Image
								src={icon}
								alt='Up Arrow Icon'
								width={20}
								height={20}
							/>
						)}
						<span className='ml-1'>
							<b>{percentage}%</b> this month
						</span>
					</small>
				)}
			</div>
		</div>
	);
}

function Stats({ className }: { className?: string }) {
	const { api, apiReady } = useApiContext();

	const [memberCount, setMemberCount] = useState(0);

	useEffect(() => {
		if (!api || !apiReady) return;

		(async () => {
			const count = (await api.query.fellowshipCollective.memberCount(0)) || 0;
			setMemberCount(Number(count.toString()));
		})();
	}, [api, apiReady]);

	return (
		<Card
			className={`flex flex-col items-center gap-y-6 border border-primary_border p-6 ${className}`}
			shadow='none'
		>
			<StatDisplay
				heroImg='/icons/stats-users.svg'
				title='Number of fellows'
				value={memberCount}
				// icon='/icons/arrow-up-green.svg'
				// percentage={12.8}
			/>
			{/* <Divider />
			<StatDisplay
				heroImg='/icons/stats-github.svg'
				title='Github Commits'
				value={60}
				icon='/icons/arrow-down-red.svg'
				percentage={12.8}
			/> */}
		</Card>
	);
}

export default Stats;

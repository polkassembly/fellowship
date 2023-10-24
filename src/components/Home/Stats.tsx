// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Card } from '@nextui-org/card';
import React from 'react';

import Image from 'next/image';
import { Divider } from '@nextui-org/divider';

function MetricDisplay({ heroImg, title, value, icon, percentage }: { heroImg: string; title: string; value: number; icon: string; percentage: number }) {
	return (
		<div className='flex flex-row items-center'>
			<div className='min-w-max'>
				<Image
					src={heroImg}
					alt='Stats Icon'
					className='h-[70px] w-[70px] md:h-[40px] md:w-[40px] xl:h-[65px] xl:w-[65px] 2xl:h-[70px] 2xl:w-[70px]'
					width={70}
					height={70}
				/>
			</div>
			<div className='ml-3 flex flex-col'>
				<small className='text-sm font-normal'>{title}</small>
				<p className='text-2xl font-semibold'>{value}</p>
				<small className='flex items-center text-xs font-normal'>
					<Image
						src={icon}
						alt='Up Arrow Icon'
						width={20}
						height={20}
					/>
					<span className='ml-1'>
						<b>{percentage}%</b> this month
					</span>
				</small>
			</div>
		</div>
	);
}

function Stats() {
	return (
		<Card
			className='flex flex-col items-center gap-y-6 border border-primary_border p-6'
			shadow='none'
		>
			<MetricDisplay
				heroImg='/icons/stats-users.svg'
				title='Number of fellows'
				value={56}
				icon='/icons/arrow-up-green.svg'
				percentage={12.8}
			/>
			<Divider />
			<MetricDisplay
				heroImg='/icons/stats-github.svg'
				title='Github Commits'
				value={60}
				icon='/icons/arrow-down-red.svg'
				percentage={12.8}
			/>
		</Card>
	);
}

export default Stats;

// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import React from 'react';
import { Card } from '@nextui-org/card';
import { RadioGroup, Radio } from '@nextui-org/radio';
import { EActivityFeed } from '@/global/types';
import { useRouter } from 'next/navigation';

function ActivitySelectorCard({ value = EActivityFeed.ALL }: { value?: EActivityFeed }) {
	const router = useRouter();

	const handleOnValueChange = (activityValue: string) => {
		router.push(`/?feed=${activityValue}`);
	};

	return (
		<Card
			className='flex flex-col gap-y-3 border border-primary_border p-6'
			shadow='none'
			radius='lg'
		>
			<h2 className='text-xl font-semibold'>Activity</h2>
			<RadioGroup
				orientation='horizontal'
				classNames={{
					wrapper: 'gap-8'
				}}
				defaultValue={value.toString()}
				onValueChange={handleOnValueChange}
			>
				{Object.values(EActivityFeed).map((feedType) => (
					<Radio
						key={feedType}
						value={feedType}
						size='md'
						classNames={{
							label: 'flex items-center'
						}}
					>
						<span className='text-xs capitalize'>{feedType.replaceAll('-', ' ')}</span>
					</Radio>
				))}
			</RadioGroup>
		</Card>
	);
}

export default ActivitySelectorCard;

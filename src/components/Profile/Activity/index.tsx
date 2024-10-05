// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { EUserActivityType, UserActivityListingItem } from '@/global/types';
import { Button } from '@nextui-org/button';
import { Card } from '@nextui-org/card';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/dropdown';
import React, { useState } from 'react';
import Image from 'next/image';
import ActivityListing from './ActivityListing';

interface Props {
	address: string;
	activities: UserActivityListingItem[];
}

function UserActivity({ address, activities }: Props) {
	const [type, setType] = useState(EUserActivityType.ALL);

	const types = [
		{
			key: EUserActivityType.ALL,
			name: 'All'
		},
		{
			key: EUserActivityType.VOTES,
			name: 'Votes'
		},
		{
			key: EUserActivityType.REFERENDUMS,
			name: 'Referendums'
		}
	];

	return (
		<Card className='rounded-[20px] border border-primary_border bg-cardBg pb-4'>
			<div className='flex items-center justify-between border-b border-primary_border px-4 py-6'>
				<h5 className='text-base font-semibold leading-6 tracking-[0.16px]'>Activity</h5>
				<Dropdown>
					<DropdownTrigger>
						<Button
							variant='bordered'
							className='h-unit-8 flex justify-between border-1 border-primary_border px-3 text-sm font-medium'
						>
							<span className='mr-3'>{types.find((t) => t.key === type)?.name || ''}</span>
							<Image
								alt='down chevron'
								src='/icons/chevron.svg'
								width={12}
								height={12}
								className='rounded-full dark:dark-icon-filter'
							/>
						</Button>
					</DropdownTrigger>

					<DropdownMenu
						variant='bordered'
						aria-label='Network selection dropdown'
						onAction={(key) => {
							setType(key as EUserActivityType);
						}}
					>
						{types.map((s) => (
							<DropdownItem key={s.key}>{s.name}</DropdownItem>
						))}
					</DropdownMenu>
				</Dropdown>
			</div>
			<ActivityListing
				items={activities}
				address={address}
			/>
		</Card>
	);
}

export default UserActivity;

// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import React from 'react';

import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, DropdownSection } from '@nextui-org/dropdown';
import { Button } from '@nextui-org/button';
import networkConstants from '@/utils/networkConstants';
import { NetworkProperties } from '@/global/types';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const networkOptions: { [index: string]: NetworkProperties[] } = {
	polkadot: [],
	kusama: [],
	solo: []
};

Object.values(networkConstants).forEach((chainProperties) => {
	switch (chainProperties.category) {
		case 'polkadot':
			networkOptions.polkadot.push(chainProperties);
			break;
		case 'kusama':
			networkOptions.kusama.push(chainProperties);
			break;
		default:
			networkOptions.solo.push(chainProperties);
	}
});

const generateDropdownItems = (groupName: keyof typeof networkOptions) => {
	return networkOptions[groupName as string].map((chainProperties) => (
		<DropdownItem
			key={chainProperties.name}
			startContent={
				<Image
					alt={`${chainProperties.name} logo`}
					src={`${chainProperties.logoUrl}`}
					width={12}
					height={12}
					className='rounded-full'
				/>
			}
		>
			<Link href={`/?network=${chainProperties.name.toLowerCase()}`}>{chainProperties.name}</Link>
		</DropdownItem>
	));
};

// TODO: get current network from redux and populate trigger button content

function NetworkDropdown() {
	const router = useRouter();

	return (
		<Dropdown>
			<DropdownTrigger>
				<Button
					variant='bordered'
					className='flex h-unit-8 justify-between border-1 border-primary_border px-5 text-sm font-medium'
				>
					<Image
						alt='down chevron'
						src='/parachain-logos/kusama-logo.svg'
						width={16}
						height={16}
						className='rounded-full'
					/>
					<span>Kusama</span>
					<Image
						alt='down chevron'
						src='/icons/chevron.svg'
						width={12}
						height={12}
						className='rounded-full'
					/>
				</Button>
			</DropdownTrigger>

			<DropdownMenu
				variant='bordered'
				aria-label='Network selection dropdown'
				onAction={(key) => {
					router.push(`/?network=${key.toString().toLowerCase()}`);
				}}
			>
				<DropdownSection
					title='Polkadot & Parachains'
					classNames={{
						heading: 'font-medium'
					}}
					showDivider
				>
					{generateDropdownItems('polkadot')}
				</DropdownSection>

				<DropdownSection
					title='Kusama & Parachains'
					classNames={{
						heading: 'font-medium'
					}}
				>
					{generateDropdownItems('kusama')}
				</DropdownSection>
			</DropdownMenu>
		</Dropdown>
	);
}

export default NetworkDropdown;

// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import React from 'react';

import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/dropdown';
import { Button } from '@nextui-org/button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import networkConstants from '@/global/networkConstants';
import { Network, NetworkProperties } from '@/global/types';
import { useApiContext } from '@/contexts';

function NetworkDropdown({ closeMenu }: { closeMenu: () => void }) {
	const router = useRouter();
	const { network, setNetwork } = useApiContext();
	const currentNetworkProperties = networkConstants[String(network)];

	// TODO: fix hyrdation warning

	return (
		<Dropdown>
			<DropdownTrigger>
				<Button
					variant='bordered'
					// eslint-disable-next-line prettier/prettier
					className='flex h-unit-10 gap-2 rounded-lg border-1 border-primary_border px-5 text-sm font-medium lg:h-unit-8 lg:rounded-2xl'
				>
					<Image
						alt={`${currentNetworkProperties.name} Logo`}
						src={currentNetworkProperties.logoUrl}
						width={16}
						height={16}
						className='rounded-full'
					/>
					<span>{currentNetworkProperties.name}</span>
					<Image
						alt='down chevron'
						src='/icons/chevron.svg'
						width={12}
						height={12}
						className='ml-auto rounded-full dark:dark-icon-filter'
					/>
				</Button>
			</DropdownTrigger>

			<DropdownMenu
				variant='bordered'
				aria-label='Network selection dropdown'
				onAction={(key) => {
					setNetwork(key as Network);
					closeMenu();
					router.push(`/?network=${key}`);
				}}
			>
				{Object.values(networkConstants).map((networkObj: NetworkProperties) => (
					<DropdownItem
						key={networkObj.key}
						startContent={
							<Image
								alt={`${networkObj.name} logo`}
								src={`${networkObj.logoUrl}`}
								width={12}
								height={12}
								className='rounded-full'
							/>
						}
					>
						{networkObj.name}
					</DropdownItem>
				))}
			</DropdownMenu>
		</Dropdown>
	);
}

export default NetworkDropdown;

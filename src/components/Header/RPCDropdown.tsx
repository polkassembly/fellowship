// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/dropdown';
import { Button } from '@nextui-org/button';
import Image from 'next/image';
import { useApiContext } from '@/contexts';
import { TRPCEndpoint } from '@/global/types';
import networkConstants from '@/global/networkConstants';

function RPCDropdown({ closeMenu }: { closeMenu: () => void }) {
	const { network } = useApiContext();

	const { wsProvider, setWsProvider } = useApiContext();

	const rpcEndpoints = networkConstants[String(network)]?.rpcEndpoints;

	const currentRPC = rpcEndpoints.find((rpc: TRPCEndpoint) => rpc.key === wsProvider) || rpcEndpoints[0];

	const handleEndpointChange = (key: string) => {
		if (wsProvider === key) return;
		setWsProvider(key);
	};

	return (
		<Dropdown>
			<DropdownTrigger>
				<Button
					variant='bordered'
					// eslint-disable-next-line prettier/prettier
					className='flex h-unit-10 gap-2 rounded-lg border-1 border-primary_border px-5 text-sm font-medium lg:h-unit-8 lg:rounded-2xl'
				>
					<Image
						alt='signal icon'
						src='/icons/signal-icon.svg'
						width={15}
						height={15}
					/>
					<span className='lg:hidden'>{currentRPC.label}</span>
					<Image
						alt='down chevron'
						src='/icons/chevron.svg'
						width={12}
						height={12}
						className='ml-auto rounded-full lg:hidden'
					/>
				</Button>
			</DropdownTrigger>
			<DropdownMenu
				aria-label='RPC Endpoint selection dropdown'
				onAction={(key) => {
					handleEndpointChange(key as string);
					closeMenu();
				}}
			>
				{rpcEndpoints.map((item: TRPCEndpoint) => (
					<DropdownItem
						key={item.key}
						// eslint-disable-next-line prettier/prettier
						className={currentRPC.key === item.key ? 'bg-primary_accent/10 text-primary dark:bg-primary_accent dark:text-white' : ''}
					>
						{item.label}
					</DropdownItem>
				))}
			</DropdownMenu>
		</Dropdown>
	);
}

export default RPCDropdown;

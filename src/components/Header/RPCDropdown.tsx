// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useState, useEffect } from 'react';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/dropdown';
import { Button } from '@nextui-org/button';
import Image from 'next/image';
import { useApiContext } from '@/contexts';
import { RPCEndpoint } from '@/global/types';
import networkConstants from '@/global/networkConstants';

function RPCDropdown() {
	const { network } = useApiContext();

	const { wsProvider, setWsProvider } = useApiContext();

	const [rpcLabel, setRpcLabel] = useState<string>('');

	const [rpcEndpoints, setRPCEndpoints] = useState<RPCEndpoint[]>([]);

	useEffect(() => {
		setRPCEndpoints(networkConstants[String(network)]?.rpcEndpoints);
	}, [network]);

	useEffect(() => {
		const currentRPC = rpcEndpoints.find((rpc: RPCEndpoint) => rpc.key === wsProvider);
		if (currentRPC) setRpcLabel(currentRPC.label);
	}, [rpcEndpoints, wsProvider]);

	const handleEndpointChange = (key: string) => {
		if (wsProvider === key) return;
		setWsProvider(key);
	};

	return (
		<Dropdown>
			<DropdownTrigger>
				<Button variant='bordered'>
					<span>{rpcLabel}</span>
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
				aria-label='RPC Endpoint selection dropdown'
				onAction={(key) => handleEndpointChange(key as string)}
			>
				{rpcEndpoints.map((item: RPCEndpoint) => (
					<DropdownItem
						key={item.key}
						className={wsProvider === item.key ? 'bg-primary/10 text-primary dark:bg-primary dark:text-white' : ''}
					>
						{item.label}
					</DropdownItem>
				))}
			</DropdownMenu>
		</Dropdown>
	);
}

export default RPCDropdown;

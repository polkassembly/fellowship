// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import React, { useMemo } from 'react';
import { useApiContext, useUserDetailsContext } from '@/contexts';
import { UserPlus } from 'lucide-react';
import { Button } from '@nextui-org/button';
import Image from 'next/image';
import LinkWithNetwork from '../../Misc/LinkWithNetwork';
import getSubstrateAddress from '@/utils/getSubstrateAddress';
import QuickActions from './QuickActions';
import Treasury from './Treasury';
import ActivityFeed from './ActivityFeed';

export default function RightSidebar() {
	const { fellows } = useApiContext();
	const { loginAddress } = useUserDetailsContext();

	// Check if current user is a fellow
	const isFellow = useMemo(() => {
		if (!loginAddress || !fellows?.length) return false;
		const substrateAddress = getSubstrateAddress(loginAddress);
		return fellows.find((f: any) => f.address === substrateAddress) !== undefined;
	}, [loginAddress, fellows]);

	return (
		<aside className='flex h-full w-[300px] flex-col border-l border-primary_border bg-componentBg'>
			{/* Conditional rendering based on fellowship status */}

			<div className='border-b border-primary_border p-4'>
				{!isFellow ? (
					<Button
						href='/join-fellowship'
						as={LinkWithNetwork}
						radius='sm'
						className='font-poppins w-full bg-primary_accent text-white hover:bg-primary_accent/90'
						startContent={<UserPlus className='h-4 w-4' />}
					>
						Join Fellowship
					</Button>
				) : (
					<LinkWithNetwork
						className='flex cursor-pointer items-center justify-center gap-1 rounded-3xl bg-rankRequestBtn px-3 py-2 text-xs font-medium leading-[21px] text-white'
						href={`/address/${loginAddress}/create-rank-request`}
					>
						<Image
							alt='btn icon'
							src='/icons/medal-fill.svg'
							width={16}
							height={16}
						/>
						Create Rank Request
					</LinkWithNetwork>
				)}
			</div>
			{isFellow && <QuickActions />}

			{/* Scrollable Content */}
			<div className='flex-1 overflow-y-auto scrollbar-hide'>
				<Treasury isFellow={isFellow} />
				<ActivityFeed />
			</div>
		</aside>
	);
}

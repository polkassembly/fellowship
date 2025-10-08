// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import React, { useMemo } from 'react';
import { useApiContext, useUserDetailsContext } from '@/contexts';
import { UserPlus } from 'lucide-react';
import { Button } from '@nextui-org/button';
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
		<aside className='flex h-full w-[300px] flex-col border-l border-primary_border bg-white'>
			{/* Conditional rendering based on fellowship status */}
			{!isFellow ? (
				<div className='border-b border-primary_border p-4'>
					<Button
						href='/join-fellowship'
						as={LinkWithNetwork}
						radius='sm'
						className='font-poppins w-full bg-primary_accent text-white hover:bg-primary_accent/90'
						startContent={<UserPlus className='h-4 w-4' />}
					>
						Join Fellowship
					</Button>
				</div>
			) : (
				<QuickActions />
			)}

			{/* Scrollable Content */}
			<div className='flex-1 overflow-y-auto scrollbar-hide'>
				<Treasury isFellow={isFellow} />
				<ActivityFeed />
			</div>
		</aside>
	);
}

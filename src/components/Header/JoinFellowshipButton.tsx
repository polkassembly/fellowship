// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import React from 'react';
import { Button } from '@nextui-org/button';
import Image from 'next/image';
import { useApiContext, useUserDetailsContext } from '@/contexts';
import UserAvatar from '../Profile/UserAvatar';
import LinkWithNetwork from '../Misc/LinkWithNetwork';

function JoinFellowshipButton({ className = '' }: { className?: string }) {
	const { fellows } = useApiContext();
	const { loginAddress } = useUserDetailsContext();
	return (
		<>
			<div className={`flex items-center ${className}`}>
				<div className='min-w-max'>
					<UserAvatar />
				</div>
				<div className='ml-3 flex flex-col gap-y-1.5'>
					<small className='text-xs'>Not a member yet ?</small>
					<Button
						href='/join-fellowship'
						as={LinkWithNetwork}
						color='primary'
						size='sm'
						variant='bordered'
						className='h-unit-7 text-xs'
						suppressHydrationWarning
					>
						Join Fellowship
					</Button>
				</div>
			</div>
			{loginAddress && fellows.map((fellow) => fellow.address).includes(loginAddress) && (
				<LinkWithNetwork
					className='flex cursor-pointer gap-1 rounded-3xl bg-[#407BFF] px-3 py-2 text-sm font-medium leading-[21px]'
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
		</>
	);
}

export default JoinFellowshipButton;

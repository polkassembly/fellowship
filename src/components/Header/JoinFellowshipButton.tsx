// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import React from 'react';
import { Button } from '@nextui-org/button';
import UserAvatar from '../Profile/UserAvatar';
import LinkWithNetwork from '../Misc/LinkWithNetwork';

function JoinFellowshipButton({ className = '' }: { className?: string }) {
	return (
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
	);
}

export default JoinFellowshipButton;

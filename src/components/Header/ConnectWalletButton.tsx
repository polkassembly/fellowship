// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useUserDetailsContext } from '@/contexts';
import { logout } from '@/services/auth.service';
import { Button } from '@nextui-org/button';
import Link from 'next/link';
import React from 'react';

function ConnectWalletButton() {
	const { id, setUserDetailsContextState } = useUserDetailsContext();
	return id ? (
		<Button
			radius='full'
			variant='bordered'
			color='primary'
			size='sm'
			className='h-unit-8 border-1 px-5 font-medium md:text-xs lg:text-sm'
			onClick={() => logout(setUserDetailsContextState)}
		>
			Logout
		</Button>
	) : (
		<Button
			href='/login'
			as={Link}
			radius='full'
			variant='bordered'
			color='primary'
			size='sm'
			className='h-unit-8 border-1 px-5 font-medium md:text-xs lg:text-sm'
		>
			Connect Wallet
		</Button>
	);
}

export default ConnectWalletButton;

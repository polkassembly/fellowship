// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Button } from '@nextui-org/button';
import React from 'react';

function ConnectWalletButton() {
	return (
		<Button
			radius='full'
			variant='bordered'
			color='primary'
			size='sm'
			className='h-unit-9 px-5 font-medium md:text-xs lg:text-sm'
		>
			Connect Wallet
		</Button>
	);
}

export default ConnectWalletButton;

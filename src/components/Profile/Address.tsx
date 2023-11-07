// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import getEncodedAddress from '@/utils/getEncodedAddress';
import getNetwork from '@/utils/getNetwork';
import Identicon from '@polkadot/react-identicon';
import React from 'react';

interface Props {
	name: string;
	address: string;
}

function Address({ name, address }: Props) {
	const network = getNetwork();
	const encodedAddress = getEncodedAddress(address, network);

	return (
		<div className='flex flex-row items-center gap-3'>
			<Identicon
				className='image identicon'
				value={encodedAddress}
				size={24}
				theme='polkadot'
			/>

			<span className='text-start'>
				<h6 className='font-medium'>{name || 'Untitled'}</h6>
				<p className='text-xs'>{encodedAddress}</p>
			</span>
		</div>
	);
}

export default Address;

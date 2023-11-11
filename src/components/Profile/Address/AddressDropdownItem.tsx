// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import Identicon from '@polkadot/react-identicon';
import React from 'react';

interface Props {
	name: string;
	address: string;
	className?: string;
	addressDisplayText?: string;
}

function AddressDropdownItem({ name, address, addressDisplayText, className }: Props) {
	return (
		<div
			className={`${className} flex flex-row items-center gap-3`}
			title={address}
		>
			<Identicon
				className='image identicon'
				value={address}
				size={24}
				theme='polkadot'
			/>

			<span className='text-start'>
				<h6 className='font-medium'>{name || 'Untitled'}</h6>
				<p className='text-xs'>{addressDisplayText || address}</p>
			</span>
		</div>
	);
}

export default AddressDropdownItem;

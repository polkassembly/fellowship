// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import Identicon from '@polkadot/react-identicon';
import React from 'react';
import { useApiContext } from '@/contexts';
import Rank from '@/components/Members/Rank';
import getEncodedAddress from '@/utils/getEncodedAddress';
import IdentityBadge from './IdentityBadge';

interface Props {
	name: string;
	address: string;
	className?: string;
	addressDisplayText?: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onChainIdentity?: any;
	iconSize?: number;
	showRank?: boolean;
}

function AddressDropdownItem({ name, address, addressDisplayText, className, onChainIdentity, iconSize = 24, showRank = true }: Props) {
	const { fellows, network } = useApiContext();
	const fellow = fellows.find((fellow) => getEncodedAddress(fellow?.address || '', network) === address);
	return (
		<div
			className={`${className} flex flex-row items-center gap-3`}
			title={address}
		>
			<Identicon
				className='image identicon'
				value={address}
				size={iconSize}
				theme='polkadot'
			/>

			<IdentityBadge
				onChainIdentity={onChainIdentity}
				iconSize={iconSize}
			/>

			<span className='text-start'>
				<h6 className='font-medium'>{name || addressDisplayText || address}</h6>
				{name && <p className='text-xs'>{addressDisplayText || address}</p>}
			</span>

			{showRank && fellow && fellow?.rank ? <Rank rank={fellow?.rank} /> : null}
		</div>
	);
}

export default AddressDropdownItem;

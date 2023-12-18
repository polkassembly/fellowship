// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import midTruncateText from '@/utils/midTruncateText';
import Identicon from '@polkadot/react-identicon';
import React from 'react';
import Link from 'next/link';
import { useApiContext } from '@/contexts';
import IdentityBadge from './IdentityBadge';

interface Props {
	address: string;
	className?: string;
	addressDisplayText?: string;
	startChars?: number;
	endChars?: number;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onChainIdentity?: any;
	iconSize?: number;
}

function AddressInline({ address, addressDisplayText, className, startChars, endChars, onChainIdentity, iconSize = 20 }: Props) {
	const { network } = useApiContext();
	return (
		<Link
			target='_blank'
			href={`/address/${address}?network=${network}`}
		>
			<div
				className={`${className} flex flex-row items-center gap-1.5`}
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

				<p className='flex flex-nowrap whitespace-nowrap font-semibold'>
					{addressDisplayText ||
						(startChars && endChars
							? midTruncateText({
									text: address,
									startChars,
									endChars
							  })
							: address)}
				</p>
			</div>
		</Link>
	);
}

export default AddressInline;

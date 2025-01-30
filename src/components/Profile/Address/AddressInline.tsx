// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import midTruncateText from '@/utils/midTruncateText';
import Identicon from '@polkadot/react-identicon';
import React from 'react';
import { useApiContext } from '@/contexts';
import Rank from '@/components/Members/Rank';
import LinkWithNetwork from '@/components/Misc/LinkWithNetwork';
import getSubstrateAddress from '@/utils/getSubstrateAddress';
import getEncodedAddress from '@/utils/getEncodedAddress';
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
	showRank?: boolean;
}

function AddressInline({ address, addressDisplayText, className, startChars, endChars, onChainIdentity, iconSize = 20, showRank = true }: Props) {
	const { fellows, network } = useApiContext();
	const fellow = fellows.find((fellow) => getEncodedAddress(fellow?.address || '', network) === address);

	const substrateAddress = getSubstrateAddress(address) || address;

	return (
		<div
			className={`${className} flex flex-row items-center gap-1.5`}
			title={address}
		>
			<LinkWithNetwork
				href={`/address/${substrateAddress}`}
				target='_blank'
				className={`${className} flex flex-row items-center gap-1.5 hover:underline`}
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

				<p className='flex flex-nowrap whitespace-nowrap'>
					{addressDisplayText ||
						(startChars && endChars
							? midTruncateText({
									text: address,
									startChars,
									endChars
								})
							: address)}
				</p>
			</LinkWithNetwork>

			{showRank && fellow && fellow?.rank ? <Rank rank={fellow?.rank} /> : null}
		</div>
	);
}

export default AddressInline;

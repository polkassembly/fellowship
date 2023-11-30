// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import midTruncateText from '@/utils/midTruncateText';
import Identicon from '@polkadot/react-identicon';
import React from 'react';

interface Props {
	address: string;
	className?: string;
	addressDisplayText?: string;
	startChars?: number;
	endChars?: number;
}

function AddressInline({ address, addressDisplayText, className, startChars, endChars }: Props) {
	return (
		<div
			className={`${className} flex flex-row items-center gap-1.5`}
			title={address}
		>
			<Identicon
				className='image identicon'
				value={address}
				size={20}
				theme='polkadot'
			/>

			<p className='text-xs'>
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
	);
}

export default AddressInline;

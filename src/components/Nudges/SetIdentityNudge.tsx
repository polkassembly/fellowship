// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import React, { useState } from 'react';
import Image from 'next/image';

function SetIdentityNudge() {
	const [isNudgeVisible, setIsNudgeVisible] = useState(true);

	const handleNudgeClose = () => {
		setIsNudgeVisible(false);
	};

	if (!isNudgeVisible) return null;

	return (
		<div className='bg-nudgePurpleBg mb-5 flex w-full flex-row items-center justify-between gap-8 rounded-lg border-none px-5 py-2 text-xs'>
			<button
				type='button'
				className='flex flex-col gap-2 text-white sm:inline-flex sm:flex-row sm:items-center'
				onClick={() => {}}
			>
				Identity has not been verified yet
				<span className='inline-flex cursor-pointer items-center gap-2 rounded-md bg-black/30 px-2 py-1 hover:opacity-80'>
					<Image
						src='/icons/shield-user.svg'
						alt='notificationIcon'
						width={16}
						height={16}
					/>
					Set on-chain identity
				</span>
			</button>
			<button
				type='button'
				className='ml-auto p-0 text-sm text-white'
				onClick={handleNudgeClose}
			>
				&#x2715;
			</button>
		</div>
	);
}

export default SetIdentityNudge;

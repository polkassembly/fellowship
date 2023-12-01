// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
/* eslint-disable @next/next/no-img-element */
import React from 'react';

function ProfileBanner() {
	return (
		<div className='flex w-full items-center'>
			<img
				src='/icons/profile-banner.svg'
				alt='profile banner'
				className='h-full w-full object-cover'
			/>
		</div>
	);
}

export default ProfileBanner;

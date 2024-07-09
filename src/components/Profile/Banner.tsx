// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
/* eslint-disable @next/next/no-img-element */

import React, { useMemo } from 'react';
import { Button } from '@nextui-org/button';
import Image from 'next/image';
import getSubstrateAddress from '@/utils/getSubstrateAddress';
import { useUserDetailsContext } from '@/contexts';

function ProfileBanner({ openProfileEdit, address }: { openProfileEdit: () => void; address: string }) {
	const userDetails = useUserDetailsContext();

	const isLoggedInUserProfile = useMemo(() => {
		const substrateAddress = getSubstrateAddress(address);
		return userDetails?.addresses?.find((a) => getSubstrateAddress(a) === substrateAddress);
	}, [address, userDetails]);
	return (
		<div className='relative flex w-full items-center overflow-hidden rounded-2xl'>
			<img
				src='/icons/profile-banner.svg'
				alt='profile banner'
				className='h-full min-h-[120px] w-full object-cover'
			/>
			{isLoggedInUserProfile ? (
				<div className='absolute bottom-5 right-5 flex items-center md:bottom-auto md:top-5'>
					<Button
						onPress={openProfileEdit}
						radius='full'
						variant='light'
						className='hidden h-10 items-center justify-center rounded-full bg-[rgba(210,216,224,0.20)] md:flex'
					>
						<Image
							alt='edit icon'
							src='/icons/edit-pencil.svg'
							width={20}
							height={20}
							className='cursor-pointer grayscale invert filter'
						/>
						<span className='text-white'>Edit Profile</span>
					</Button>
					<Button
						onPress={openProfileEdit}
						radius='full'
						isIconOnly
						variant='light'
						className='flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(210,216,224,0.20)] md:hidden'
					>
						<Image
							alt='edit icon'
							src='/icons/edit-pencil.svg'
							width={20}
							height={20}
							className='cursor-pointer grayscale invert filter'
						/>
					</Button>
				</div>
			) : null}
		</div>
	);
}

export default ProfileBanner;

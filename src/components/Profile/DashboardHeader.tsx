// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import React, { useMemo, useState } from 'react';
import { Button } from '@nextui-org/button';
import { Card } from '@nextui-org/card';
import { Chip } from '@nextui-org/chip';
import { useDisclosure } from '@nextui-org/modal';
import Identicon from '@polkadot/react-identicon';
import Image from 'next/image';
import { ToggleLeft, ToggleRight } from 'lucide-react';
import { useApiContext, useUserDetailsContext } from '@/contexts';
import RANK_CONSTANTS from '@/global/constants/rankConstants';
import midTruncateText from '@/utils/midTruncateText';
import getEncodedAddress from '@/utils/getEncodedAddress';
import { useIdentity } from '@/hooks/useIdentity';
import ProfileSocials from './Socials';
import { ISocial } from '@/global/types';
import getSubstrateAddress from '@/utils/getSubstrateAddress';

interface Props {
	address: string;
	socialLinks: ISocial[];
}

function DashboardHeader(props: Props) {
	const { address, socialLinks } = props;
	const { fellows, network } = useApiContext();
	const { loginAddress } = useUserDetailsContext();
	const [isActive, setIsActive] = useState(true);
	const { isOpen: isModalOpen, onOpenChange } = useDisclosure();

	const { identity: onChainIdentity } = useIdentity(address);

	const encodedAddress = getEncodedAddress(address, network) || address;
	const onChainUsername = onChainIdentity?.displayParent || onChainIdentity?.display || '';

	const fellow = fellows.find((f) => f.address === address);
	const rankInfo = fellow ? RANK_CONSTANTS[fellow.rank] : null;

	// Check if current user is viewing their own profile
	const isLoggedInUserProfile = useMemo(() => {
		const substrateAddress = getSubstrateAddress(address);
		console.log('substrateAddress', substrateAddress);
		console.log('loginAddress', loginAddress);
		return getSubstrateAddress(loginAddress) === substrateAddress;
	}, [address, loginAddress]);

	console.log('isLoggedInUserProfile', isLoggedInUserProfile);

	const displayName =
		onChainUsername ||
		midTruncateText({
			text: encodedAddress,
			startChars: 5,
			endChars: 5
		});

	const handleStatusToggle = () => {
		setIsActive(!isActive);
	};

	return (
		<Card className='w-full rounded-2xl border border-primary_border bg-cardBg p-6'>
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-4'>
					{/* User Avatar */}
					<div className='relative'>
						<Card className='flex h-20 w-20 items-center justify-center rounded-full bg-primary_accent'>
							<Identicon
								className='image identicon'
								value={address}
								size={72}
								theme='polkadot'
							/>
						</Card>
						{fellow && rankInfo && (
							<div className='absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-primary_border bg-cardBg'>
								<Image
									alt='rank icon'
									src={rankInfo.icon}
									width={16}
									height={16}
								/>
							</div>
						)}
					</div>

					{/* User Info */}
					<div className='flex flex-col'>
						<h1 className='text-2xl font-semibold text-black dark:text-white'>{displayName}</h1>
						<p className='text-sm font-medium text-secondaryText'>{fellow ? rankInfo?.name || 'Fellow' : 'Community Member'}</p>
						<div className='mt-2 flex items-center gap-3'>
							{fellow && (
								<Chip
									size='sm'
									className='bg-primary_accent font-medium text-white'
									variant='solid'
								>
									{fellow.rank ? `Dan ${fellow.rank}` : 'Fellow'}
								</Chip>
							)}
							<Chip
								size='sm'
								className={`font-medium ${isActive ? 'bg-successBg text-success' : 'bg-errorBg text-error'}`}
								variant='flat'
							>
								{isActive ? 'Active' : 'Inactive'}
							</Chip>
						</div>
					</div>
				</div>

				{/* Status Toggle */}
				<div className='flex flex-col items-end gap-2'>
					<div className='flex items-center gap-3'>
						<span className='text-sm font-medium text-secondaryText'>Status</span>
						<Button
							isIconOnly
							variant='light'
							className='min-w-0 p-0 hover:bg-transparent'
							onPress={handleStatusToggle}
							isDisabled={!isLoggedInUserProfile}
						>
							{isActive ? <ToggleRight className='h-8 w-8 text-primary_accent' /> : <ToggleLeft className='h-8 w-8 text-secondaryText' />}
						</Button>
					</div>
					<ProfileSocials
						links={socialLinks || []}
						isModalOpen={isModalOpen}
						onOpenChange={onOpenChange}
					/>
				</div>
			</div>

			{/* Biography Section */}
			<div className='mt-4 border-t border-primary_border pt-4'>
				<p className='text-sm leading-relaxed text-secondaryText'>
					Experienced blockchain researcher specializing in consensus mechanisms and cryptographic protocols. Active contributor to Polkadot ecosystem with focus on runtime
					optimization and security research. Published author and speaker at major blockchain conferences.
				</p>
			</div>
		</Card>
	);
}

export default DashboardHeader;

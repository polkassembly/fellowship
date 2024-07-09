// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import React, { useState, useMemo } from 'react';
import { IAddProfileResponse, ISocial } from '@/global/types';
import { Button } from '@nextui-org/button';
import { socials } from '@/global/constants/socials';
import Image from 'next/image';
import nextApiClientFetch from '@/utils/nextApiClientFetch';
import queueNotification from '@/utils/queueNotification';
import { useApiContext, useUserDetailsContext } from '@/contexts';
import { useDisclosure } from '@nextui-org/modal';
import getSubstrateAddress from '@/utils/getSubstrateAddress';
import SocialIcon from './SocialIcon';
import EditSocialModal from './EditSocialModal';

function ProfileSocials({ links, address }: { links: ISocial[]; address: string }) {
	const [socialLinks, setSocialLinks] = useState<ISocial[]>(links);
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [loading, setLoading] = useState<boolean>(false);
	const { network } = useApiContext();
	const userDetails = useUserDetailsContext();

	const updateSocialLinks = async (onSuccess?: () => void) => {
		if (!socialLinks) return;

		try {
			setLoading(true);
			const { data, error } = await nextApiClientFetch<IAddProfileResponse>({
				network,
				url: 'api/v1/auth/actions/addProfile',
				isPolkassemblyAPI: true,
				data: {
					username: userDetails?.username,
					social_links: JSON.stringify(socialLinks || [])
				}
			});
			if (data?.token) {
				queueNotification({
					header: 'Success!',
					message: 'Profile updated successfully.',
					status: 'success'
				});
				onSuccess?.();
			} else {
				console.log(error);
				queueNotification({
					header: 'Error!',
					message: 'Failed to update your profile.',
					status: 'error'
				});
			}
		} catch (error) {
			queueNotification({
				header: 'Error!',
				message: 'Failed to update your profile.',
				status: 'error'
			});
		} finally {
			setLoading(false);
		}
	};

	const isLoggedInUserProfile = useMemo(() => {
		const substrateAddress = getSubstrateAddress(address);
		return userDetails?.addresses?.find((a) => getSubstrateAddress(a) === substrateAddress);
	}, [address, userDetails]);

	return (
		<>
			<div className='flex h-[60px] min-w-[348px] items-center gap-x-3 rounded-[20px] border bg-secondary px-6 py-[10px]'>
				{socials.map((social) => {
					const strLink = social.toString().toLocaleLowerCase();
					return (
						<SocialIcon
							key={strLink}
							src={`/icons/socials/${strLink}.svg`}
							alt={strLink}
						/>
					);
				})}
				{isLoggedInUserProfile ? (
					<Button
						onPress={onOpen}
						isIconOnly
						radius='full'
						variant='light'
						className='flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(210,216,224,0.20)]'
					>
						<Image
							alt='edit icon'
							src='/icons/edit-pencil.svg'
							width={20}
							height={20}
							className='cursor-pointer grayscale invert filter'
						/>
					</Button>
				) : null}
			</div>
			<EditSocialModal
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				socialLinks={socialLinks}
				setSocialLinks={setSocialLinks}
				loading={loading}
				handleSave={updateSocialLinks}
			/>
		</>
	);
}

export default ProfileSocials;

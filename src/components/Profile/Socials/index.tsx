// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import React, { useState } from 'react';
import { IAddProfileResponse, ISocial } from '@/global/types';
import { socials } from '@/global/constants/socials';
import nextApiClientFetch from '@/utils/nextApiClientFetch';
import queueNotification from '@/utils/queueNotification';
import { useApiContext, useUserDetailsContext } from '@/contexts';
import SocialIcon from './SocialIcon';
import EditSocialModal from './EditSocialModal';

function ProfileSocials({ links, isModalOpen, onOpenChange }: { links: ISocial[]; isModalOpen: boolean; onOpenChange: () => void }) {
	const [socialLinks, setSocialLinks] = useState<ISocial[]>(links);
	const [loading, setLoading] = useState<boolean>(false);
	const { network } = useApiContext();
	const userDetails = useUserDetailsContext();

	console.log('ProfileSocials -> socialLinks', links);

	const updateSocialLinks = async (onSuccess?: () => void) => {
		if (!socialLinks) return;

		try {
			setLoading(true);
			const { data, error } = await nextApiClientFetch<IAddProfileResponse>({
				network,
				url: 'api/v1/auth/actions/addProfileSocialLinks',
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

	return (
		<>
			<div className='flex h-[60px] w-full items-center justify-around gap-x-3 rounded-[20px] border bg-secondary px-3 py-[10px] md:w-fit md:min-w-[348px] md:px-6'>
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
			</div>
			<EditSocialModal
				isOpen={isModalOpen}
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

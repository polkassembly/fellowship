// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import React from 'react';
import { IProfile } from '@/global/types';
import { useDisclosure } from '@nextui-org/modal';
import ContributionGraph from './Activity/ContributionGraph';
import ProfileBanner from './Banner';
import ProfileSocials from './Socials';
import ProfileAddressDetails from './AddressDetails';
import Manifesto from './Manifesto';
import ProfileProposals from './Proposals';
import UserActivity from './Activity';
import PromotionDetails from './PromotionDetails';

interface Props {
	profile: IProfile;
}

function Profile(props: Props) {
	const { profile } = props;
	const { address, manifesto, social_links: socialLinks } = profile;
	const { isOpen: isModalOpen, onOpen: openProfileEdit, onOpenChange } = useDisclosure();
	return (
		<section className='relative flex flex-col pb-16 md:pb-0'>
			<ProfileBanner
				openProfileEdit={openProfileEdit}
				address={address}
			/>
			<div className='top-[151px] flex w-full flex-col items-center justify-between gap-5 xl:absolute xl:flex-row'>
				<ProfileAddressDetails address={address} />
				<ProfileSocials
					links={socialLinks || []}
					isModalOpen={isModalOpen}
					onOpenChange={onOpenChange}
				/>
			</div>
			<ContributionGraph
				classNames='mt-[56px]'
				githubUsername={socialLinks?.find((social) => social.type === 'Github')?.link || ''}
				openProfileEdit={openProfileEdit}
			/>
			<div className='mt-4 flex flex-col gap-4 md:grid md:grid-cols-11'>
				<section className='flex w-full flex-col gap-4 md:col-span-5'>
					<Manifesto
						manifesto={manifesto}
						address={address}
					/>
					<PromotionDetails address={address} />
				</section>
				<section className='w-full md:col-span-6'>
					<ProfileProposals address={address} />
				</section>
			</div>
			<div className='mt-4 pb-4'>
				<UserActivity
					activities={profile.activities}
					address={address}
				/>
			</div>
		</section>
	);
}

export default Profile;

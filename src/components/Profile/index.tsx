// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import { IProfile } from '@/global/types';
import ProfileBanner from './Banner';
import ProfileSocials from './Socials';
import ProfileAddressDetails from './AddressDetails';
import Manifesto from './Manifesto';
import ProfileProposals from './Proposals';
import UserActivity from './Activity';

interface Props {
	profile: IProfile;
}

function Profile(props: Props) {
	const { profile } = props;
	const { address, manifesto, social_links: socialLinks } = profile;
	return (
		<section className='relative flex flex-col'>
			<ProfileBanner />
			<div className='absolute top-[151px] flex w-full items-center justify-between'>
				<ProfileAddressDetails address={address} />
				<ProfileSocials
					links={socialLinks || []}
					address={address}
				/>
			</div>
			<div className='mt-[56px] grid grid-cols-11 gap-x-4'>
				<section className='col-span-5'>
					<Manifesto
						manifesto={manifesto}
						address={address}
					/>
				</section>
				<section className='col-span-6'>
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

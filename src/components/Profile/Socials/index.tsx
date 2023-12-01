// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import SocialIcon from './Social';

const socials = [
	{
		src: '/icons/socials/github.svg',
		alt: 'github'
	},
	{
		src: '/icons/socials/mail.svg',
		alt: 'mail'
	},
	{
		src: '/icons/socials/twitter.svg',
		alt: 'twitter'
	},
	{
		src: '/icons/socials/telegram.svg',
		alt: 'telegram'
	},
	{
		src: '/icons/socials/riot.svg',
		alt: 'riot'
	},
	{
		src: '/icons/socials/discord.svg',
		alt: 'discord'
	}
];

function ProfileSocials() {
	return (
		<div className='flex h-[60px] min-w-[348px] items-center gap-x-3 rounded-[20px] border bg-secondary px-6 py-[10px]'>
			{socials.map((social) => (
				<SocialIcon
					key={social.src}
					src={social.src}
					alt={social.alt}
				/>
			))}
		</div>
	);
}

export default ProfileSocials;

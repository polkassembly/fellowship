// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import Image from 'next/image';
import ComingSoonLabel from '../common-ui/ComingSoonLabel';

enum CHANNELS {
	TELEGRAM = 'telegram',
	DISCORD = 'discord',
	ELEMENT = 'element',
	GITHUB = 'github'
}

const botChannels = [
	{
		Icon: (
			<Image
				alt='telegram icon'
				src='/icons/settings/telegram.svg'
				width={15}
				height={15}
			/>
		),
		channel: CHANNELS.TELEGRAM,
		description: 'a Telegram chat to get Telegram notifications',
		title: 'Telegram Notifications'
	},
	{
		Icon: (
			<Image
				alt='discord icon'
				src='/icons/settings/discord.svg'
				width={15}
				height={15}
			/>
		),
		channel: CHANNELS.DISCORD,
		description: 'a Discord Channel chat to get Discord notifications',
		title: 'Discord Notifications'
	},
	{
		Icon: (
			<Image
				alt='element icon'
				src='/icons/settings/element.svg'
				width={15}
				height={15}
			/>
		),
		channel: CHANNELS.ELEMENT,
		description: '',
		title: 'Element Notifications'
	},
	{
		Icon: (
			<Image
				alt='github icon'
				src='/icons/settings/github.svg'
				width={15}
				height={15}
			/>
		),
		channel: CHANNELS.GITHUB,
		description: '',
		title: 'GitHub Notifications'
	}
];

export default function BotChannelsCard() {
	return (
		<div className='mb-2 flex flex-col gap-2'>
			{botChannels.map((botChannel) => (
				<div className='flex flex-col gap-5 border-b border-dashed border-primary_border py-4 first:mt-2 first:border-t last:border-b-0 last:pb-0 md:flex-row'>
					<h3 className='m-0 flex items-center gap-2 text-sm'>
						{botChannel.Icon}
						<p className='m-0 ml-1 mr-1 p-0'>{botChannel.title}</p>
					</h3>
					{botChannel.description ? (
						<div className='flex items-center gap-2'>
							<p className='m-0 flex items-center gap-1 p-0 text-sm font-medium text-primary'>
								<Image
									alt='plus icon'
									src='/icons/settings/plus-circled.svg'
									width={16}
									height={16}
								/>{' '}
								<span>Add the Polkassembly Bot</span>
							</p>
							<p className='m-0 p-0 text-xs'>to {botChannel.description}</p>
						</div>
					) : (
						<ComingSoonLabel />
					)}
				</div>
			))}
		</div>
	);
}

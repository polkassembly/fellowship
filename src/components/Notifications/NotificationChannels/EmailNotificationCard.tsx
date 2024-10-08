// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useState } from 'react';
import Image from 'next/image';
import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { CHANNEL } from '@/global/types';
import { Switch } from '@nextui-org/switch';
import DisabledConfirmation from './Modals/Confirmation';

export default function EmailNotificationCard({
	toggleChannelPreferences,
	email,
	isEmailVerified,
	notificationEnabled
}: Readonly<{
	toggleChannelPreferences: (channel: CHANNEL, enabled: boolean) => void;
	email: string;
	isEmailVerified: boolean;
	notificationEnabled: boolean;
}>) {
	const [showConfirmationModal, setShowConfirmationModal] = useState(false);

	const confirmDecision = () => {
		setShowConfirmationModal(true);
	};

	return (
		<>
			<div className='mb-2 flex flex-col gap-2'>
				<h3 className='m-0 flex items-center gap-2 text-sm'>
					<span className='flex items-center gap-2'>
						<Image
							alt='email icon'
							src='/icons/settings/email-filled.svg'
							width={15}
							height={12.5}
						/>
						<p className='m-0 ml-1 mr-1 p-0'>Email Notifications</p>
					</span>
					{email && (
						<Switch
							defaultSelected={notificationEnabled}
							onValueChange={(isSelected) => (!isSelected ? confirmDecision() : toggleChannelPreferences(CHANNEL.EMAIL, true))}
							color='primary'
							size='sm'
						/>
					)}
				</h3>
				{email && isEmailVerified ? (
					<span>{email}</span>
				) : (
					<div className='flex items-center gap-5'>
						<Input
							type='email'
							label='Enter Email Address'
							size='sm'
							variant='bordered'
							value={email}
						/>
						<Button className='bg-primary text-white'>Verify</Button>
					</div>
				)}
			</div>
			<DisabledConfirmation
				open={showConfirmationModal}
				onConfirm={() => {
					setShowConfirmationModal(false);
					toggleChannelPreferences(CHANNEL.EMAIL, false);
				}}
				onCancel={() => setShowConfirmationModal(false)}
				channel={CHANNEL.EMAIL}
			/>
		</>
	);
}

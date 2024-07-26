// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import Notifications from '@/components/Notifications';
import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
	title: 'Fellowship | Settings',
	description: 'Fellowship never felt so good before. - Home'
};

export default async function Settings() {
	return (
		<div className='flex w-full flex-col gap-y-8'>
			<div className='flex items-center rounded-[20px] border border-primary_border px-6 py-4'>
				<Image
					alt='Settings icon'
					src='/icons/settings.svg'
					width={24}
					height={24}
					className='mr-2 dark:contrast-[200%] dark:grayscale dark:invert dark:filter'
				/>
				<div>
					<h3 className='text-xl font-semibold leading-6'>Settings</h3>
				</div>
			</div>
			{
				// todo: add settings tabs here
			}
			<Notifications />
		</div>
	);
}

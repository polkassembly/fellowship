// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import Image from 'next/image';
import React from 'react';

interface IParticipantProps {
	name: string;
	avatar: string;
	status: 'accepted' | 'pending' | 'rejected';
}

export default function Participant({ name, avatar, status }: IParticipantProps) {
	return (
		<div className='flex items-center gap-5 rounded-lg border border-primary_border p-3'>
			<Image
				src={avatar}
				alt='participant avatar'
				width={32}
				height={32}
				className='rounded-full'
			/>
			<h3 className='text-base font-semibold leading-6'>{name}</h3>
			{status === 'accepted' && <span className='bg-successBg ml-auto rounded-lg px-3 py-1 text-success'>Accepted</span>}
			{status === 'pending' && <span className='bg-warningBg ml-auto rounded-lg px-3 py-1 text-warning'>Pending</span>}
			{status === 'rejected' && <span className='bg-errorBg text-error ml-auto rounded-lg px-3 py-1'>Rejected </span>}
		</div>
	);
}

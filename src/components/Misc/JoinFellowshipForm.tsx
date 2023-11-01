// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Divider } from '@nextui-org/divider';
import AlertCard from './AlertCard';

function JoinFellowshipForm() {
	return (
		<div className='flex flex-col items-center justify-center gap-4'>
			<Image
				className='fill-red-700'
				alt='Join Fellowship Icon'
				src='/misc/join-fellowship.svg'
				width={356}
				height={198}
			/>

			<section className='flex w-full flex-col gap-3'>
				<h3 className='text-base font-medium'>Application Request for Fellowship</h3>
				<p className='text-sm'>As a member of fellowship community you are expected to faithfully uphold the below tenets:</p>

				<ul className='ml-6 flex list-disc flex-col gap-3 text-sm font-normal italic'>
					<li>Sincerely uphold the interests of Polkadot and avoid actions which clearly work against it.</li>
					<li>Respect the philosophy and principles of Polkadot.</li>
					<li>Respect the operational procedures, norms and voting conventions of the Fellowship.</li>
					<li>
						Respect your fellow Members and the wider community <Link href='/'>Learn more</Link>
					</li>
				</ul>

				<div className='my-6 flex flex-col gap-6'>
					<Divider />

					{/* TODO: change copy */}
					<AlertCard
						type='info'
						message='Note: A fellow with at least rank x must apply for fellowship on behalf of another user.'
					/>
				</div>
			</section>
		</div>
	);
}

export default JoinFellowshipForm;

// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { Button } from '@nextui-org/button';
import { useUserDetailsContext } from '@/contexts';
import Link from 'next/link';
import { IPost } from '@/global/types';
import InductMemberForm from './InductMemberForm';

interface Props {
	post: IPost;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
export default function InductMemberPageContent({ post }: Props) {
	const { id } = useUserDetailsContext();

	return (
		<div className='rounded-2xl border border-primary_border p-6'>
			{!id ? (
				<div className='p-6 text-center'>
					Please{' '}
					<Link
						href='/login'
						className='text-link'
					>
						login
					</Link>{' '}
					to induct a member to the fellowship.
				</div>
			) : (
				<>
					<InductMemberForm />

					<Button
						color='primary'
						className='flex w-full flex-1 text-sm'
					>
						Submit Application
					</Button>
				</>
			)}
		</div>
	);
}

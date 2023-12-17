// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { Button } from '@nextui-org/button';
import { useUserDetailsContext } from '@/contexts';
import { useRef } from 'react';
import { RFCPullRequestItem } from '@/global/types';
import LinkWithNetwork from '../Misc/LinkWithNetwork';
import CreateRFCProposalForm from './CreateRFCProposalForm';

interface Props {
	prItem: RFCPullRequestItem;
}

export default function CreateRFCProposalPageContent({ prItem }: Props) {
	const { id } = useUserDetailsContext();

	const formRef = useRef<HTMLFormElement>(null);

	const handleSubmit = () => {
		if (formRef.current) {
			formRef?.current?.requestSubmit(); // Call the submit function from the child component
		}
	};

	return (
		<div className='rounded-2xl border border-primary_border p-6'>
			{!id ? (
				<div className='p-6 text-center'>
					Please{' '}
					<LinkWithNetwork
						href='/login'
						className='text-link'
					>
						login
					</LinkWithNetwork>{' '}
					to create a RFC proposal
				</div>
			) : (
				<div className='flex flex-col gap-6'>
					<CreateRFCProposalForm
						formRef={formRef}
						prItem={prItem}
					/>

					<Button
						size='md'
						color='primary'
						className='flex min-h-[40px] w-full flex-1 text-sm'
						onPress={handleSubmit}
					>
						Submit Proposal
					</Button>
				</div>
			)}
		</div>
	);
}

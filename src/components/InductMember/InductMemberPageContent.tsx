// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { Button } from '@nextui-org/button';
import { useUserDetailsContext } from '@/contexts';
import { IPost } from '@/global/types';
import PostDataContextProvider from '@/contexts/PostDataContext';
import { useRef, useState } from 'react';
import InductMemberForm from './InductMemberForm';
import InductMemberSuccessModal from './InductMemberSuccessModal';
import LinkWithNetwork from '../Misc/LinkWithNetwork';

interface Props {
	post: IPost;
}

export default function InductMemberPageContent({ post }: Props) {
	const { id } = useUserDetailsContext();

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const formRef = useRef<any>(null);

	const [setsubmitBtnText, setSetsubmitBtnText] = useState('Next Step');
	const [successDetails, setSuccessDetails] = useState({
		proposer: '',
		inductee: ''
	});

	const handleNextStep = () => {
		formRef?.current?.nextStep?.();
	};

	if (successDetails.proposer) {
		return <InductMemberSuccessModal successDetails={successDetails} />;
	}

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
					to induct a member to the fellowship.
				</div>
			) : (
				<div className='flex flex-col gap-6'>
					<PostDataContextProvider postItem={post}>
						<InductMemberForm
							ref={formRef}
							setSetsubmitBtnText={setSetsubmitBtnText}
							setSuccessDetails={setSuccessDetails}
						/>
					</PostDataContextProvider>

					<Button
						size='md'
						color='primary'
						className='flex min-h-[40px] w-full flex-1 text-sm'
						onPress={handleNextStep}
					>
						{setsubmitBtnText}
					</Button>
				</div>
			)}
		</div>
	);
}

// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import JoinFellowshipForm from '@/components/JoinFellowship/JoinFellowshipForm';
import { Button } from '@nextui-org/button';
import { useRef, useState } from 'react';
import Image from 'next/image';
import { useUserDetailsContext } from '@/contexts';
import LinkWithNetwork from '@/components/Misc/LinkWithNetwork';

export default function JoinFellowship() {
	const { id } = useUserDetailsContext();

	const joinFellowshipFormRef = useRef<HTMLFormElement>(null);

	const [isPreview, setIsPreview] = useState(false);

	const handleSubmit = () => {
		if (joinFellowshipFormRef.current) {
			joinFellowshipFormRef?.current?.requestSubmit(); // Call the submit function from the child component
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
					to create an application request for fellowship
				</div>
			) : (
				<>
					<JoinFellowshipForm
						isPreview={isPreview}
						formRef={joinFellowshipFormRef}
					/>

					<Button
						color='primary'
						onPress={() => {
							if (!isPreview) {
								setIsPreview(true);
							} else {
								handleSubmit();
							}
						}}
						className='flex w-full flex-1 bg-primary_accent text-sm'
					>
						{isPreview ? (
							'Submit Application'
						) : (
							<>
								Preview Application Request
								<Image
									alt='Join Fellowship Icon'
									src='/icons/arrow-right-white.svg'
									width={20}
									height={20}
								/>
							</>
						)}
					</Button>

					{isPreview && (
						<div className='flex justify-center'>
							<Button
								onPress={() => setIsPreview(false)}
								variant='light'
								className='mt-3'
								size='sm'
							>
								Go back
							</Button>
						</div>
					)}
				</>
			)}
		</div>
	);
}

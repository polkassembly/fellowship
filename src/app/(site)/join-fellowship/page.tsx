// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import JoinFellowshipForm from '@/components/JoinFellowship/JoinFellowshipForm';
import { Button } from '@nextui-org/button';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useUserDetailsContext } from '@/contexts';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/Misc/LoadingSpinner';

export default function JoinFellowship() {
	const { id } = useUserDetailsContext();
	const router = useRouter();

	const joinFellowshipFormRef = useRef<HTMLFormElement>(null);

	const [isPreview, setIsPreview] = useState(false);

	const handleSubmit = () => {
		if (joinFellowshipFormRef.current) {
			joinFellowshipFormRef?.current?.requestSubmit(); // Call the submit function from the child component
		}
	};

	useEffect(() => {
		if (!id) {
			router.push('/login');
		}
	}, [id, router]);

	if (id) {
		return (
			<div className='rounded-2xl border border-primary_border p-6'>
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
					className='flex w-full flex-1 text-sm'
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
			</div>
		);
	}

	return <LoadingSpinner />;
}

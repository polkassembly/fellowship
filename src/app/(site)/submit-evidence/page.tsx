// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import SubmitEvidenceForm from '@/components/SubmitEvidence/SubmitEvidenceForm';
import { Button } from '@nextui-org/button';
import { useRef, useState } from 'react';
import { useUserDetailsContext } from '@/contexts';
import LinkWithNetwork from '@/components/Misc/LinkWithNetwork';

export default function SubmitEvidence() {
	const { id } = useUserDetailsContext();

	const formRef = useRef<HTMLFormElement>(null);
	const [isFormValid, setIsFormValid] = useState(false);
	const [isFormLoading, setIsFormLoading] = useState(false);

	const handleSubmit = () => {
		if (formRef.current) {
			formRef?.current?.requestSubmit();
		}
	};

	return (
		<div className='rounded-2xl border border-primary_border p-6'>
			<h3 className='mb-3 font-semibold'>Submit Evidence</h3>

			<div>
				{!id ? (
					<div className='p-6 text-center'>
						Please{' '}
						<LinkWithNetwork
							href='/login'
							className='text-link'
						>
							login
						</LinkWithNetwork>{' '}
						to submit evidence.
					</div>
				) : (
					<div className='flex flex-col gap-6'>
						<SubmitEvidenceForm
							formRef={formRef}
							onSuccess={() => {
								// Optionally redirect or show success message
							}}
							onFormStateChange={(isValid, isLoading) => {
								setIsFormValid(isValid);
								setIsFormLoading(isLoading);
							}}
						/>

						<Button
							color='primary'
							onPress={handleSubmit}
							disabled={!isFormValid || isFormLoading}
							className='flex min-h-[40px] flex-1 text-sm'
						>
							{isFormLoading ? 'Submitting...' : 'Submit Evidence'}
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}

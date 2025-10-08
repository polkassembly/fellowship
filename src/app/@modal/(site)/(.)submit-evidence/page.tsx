// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import SubmitEvidenceForm from '@/components/SubmitEvidence/SubmitEvidenceForm';
import { Button } from '@nextui-org/button';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/modal';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';
import { Divider } from '@nextui-org/divider';
import { useUserDetailsContext } from '@/contexts';
import LinkWithNetwork from '@/components/Misc/LinkWithNetwork';
import { FileText } from 'lucide-react';

function SubmitEvidenceModal() {
	const router = useRouter();
	const { id } = useUserDetailsContext();

	const formRef = useRef<HTMLFormElement>(null);
	const [isModalOpen, setIsModalOpen] = useState(true);
	const [isFormValid, setIsFormValid] = useState(false);
	const [isFormLoading, setIsFormLoading] = useState(false);

	const handleOnClose = () => {
		router.back();
	};

	const handleSubmit = () => {
		if (formRef.current) {
			formRef?.current?.requestSubmit();
		}
	};

	return (
		<Modal
			isOpen={isModalOpen}
			onClose={handleOnClose}
			size='4xl'
			scrollBehavior='inside'
			shouldBlockScroll
			className='bg-cardBg'
		>
			<ModalContent>
				{() =>
					id ? (
						<>
							<ModalHeader className='flex items-center gap-2 text-sm'>
								<FileText className='h-6 w-6 font-semibold' />
								<h3 className='font-semibold'>Submit Evidence</h3>
							</ModalHeader>
							<Divider />

							<ModalBody>
								<SubmitEvidenceForm
									formRef={formRef}
									onSuccess={() => setIsModalOpen(false)}
									onFormStateChange={(isValid, isLoading) => {
										setIsFormValid(isValid);
										setIsFormLoading(isLoading);
									}}
								/>
							</ModalBody>

							<Divider />

							<ModalFooter>
								<Button
									color='primary'
									onPress={handleSubmit}
									disabled={!isFormValid || isFormLoading}
									className='flex flex-1 bg-primary_accent text-sm'
								>
									{isFormLoading ? 'Submitting...' : 'Submit Evidence'}
								</Button>
							</ModalFooter>
						</>
					) : (
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
					)
				}
			</ModalContent>
		</Modal>
	);
}

export default SubmitEvidenceModal;

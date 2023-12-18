// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { Button } from '@nextui-org/button';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/modal';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Divider } from '@nextui-org/divider';
import { useUserDetailsContext } from '@/contexts';
import LinkWithNetwork from '@/components/Misc/LinkWithNetwork';
import { RFCPullRequestItem } from '@/global/types';
import CreateRFCProposalForm from './CreateRFCProposalForm';

interface Props {
	prItem: RFCPullRequestItem;
}

export default function CreateRFCProposalModal({ prItem }: Props) {
	const router = useRouter();
	const { id } = useUserDetailsContext();

	const formRef = useRef<HTMLFormElement>(null);

	const [isOpen, setIsOpen] = useState(true);

	const handleOnClose = () => {
		router.back();
	};

	const handleSubmit = () => {
		if (formRef.current) {
			formRef?.current?.requestSubmit(); // Call the submit function from the child component
		}
	};

	return (
		<Modal
			isOpen
			className={`${!isOpen ? 'hidden' : ''}`}
			onClose={handleOnClose}
			size='4xl'
			scrollBehavior='inside'
			shouldBlockScroll
		>
			<ModalContent>
				{() =>
					id ? (
						<>
							<ModalHeader className='flex items-center gap-2 text-sm'>
								<>
									<Image
										alt='Create RFC Proposal Icon'
										src='/icons/sidebar/git-branch-outlined.svg'
										width={24}
										height={24}
										className='ml-[-8px] mr-2'
									/>
									<h3 className='font-semibold'>Create RFC Proposal</h3>
								</>
							</ModalHeader>
							<Divider />

							<ModalBody>
								<CreateRFCProposalForm
									formRef={formRef}
									prItem={prItem}
									onSuccess={() => setIsOpen(false)}
								/>
							</ModalBody>

							<Divider />

							<ModalFooter>
								<Button
									color='primary'
									onPress={() => handleSubmit()}
									className='flex flex-1 text-sm'
								>
									Submit Proposal
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
							to create a RFC proposal.
						</div>
					)
				}
			</ModalContent>
		</Modal>
	);
}

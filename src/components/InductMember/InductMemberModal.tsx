// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { useUserDetailsContext } from '@/contexts';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/modal';
import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import { Divider } from '@nextui-org/divider';
import { Button } from '@nextui-org/button';
import { useRouter } from 'next/navigation';
import InductMemberForm from './InductMemberForm';

function InductMemberModal() {
	const router = useRouter();
	const { id } = useUserDetailsContext();

	const handleOnClose = () => {
		router.back();
	};

	return (
		<Modal
			isOpen
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
								<Image
									alt='Join Fellowship Icon'
									src='/icons/add-user-grey-filled.svg'
									width={24}
									height={24}
									className='ml-[-8px] mr-2'
								/>
								<h3 className='font-semibold'>Member Induction</h3>
							</ModalHeader>
							<Divider />

							<ModalBody>
								<InductMemberForm />
							</ModalBody>

							<Divider />

							<ModalFooter>
								<Button
									color='primary'
									className='flex flex-1 text-sm'
								>
									Next Step
								</Button>
							</ModalFooter>
						</>
					) : (
						<div className='p-6 text-center'>
							Please{' '}
							<Link
								href='/login'
								className='text-link'
							>
								login
							</Link>{' '}
							to induct a member to the Fellowship.
						</div>
					)
				}
			</ModalContent>
		</Modal>
	);
}

export default InductMemberModal;

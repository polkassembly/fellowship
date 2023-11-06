// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { Modal, ModalContent, ModalHeader, ModalBody } from '@nextui-org/modal';
import { useRouter } from 'next/navigation';
import React from 'react';
import Image from 'next/image';
import { Divider } from '@nextui-org/divider';
import LoginForm from '@/components/Auth/LoginForm';

function LoginModal() {
	const router = useRouter();

	const handleOnClose = () => {
		router.back();
	};

	return (
		<Modal
			isOpen
			onClose={handleOnClose}
			size='xl'
			scrollBehavior='inside'
			shouldBlockScroll
		>
			<ModalContent>
				{() => (
					<>
						<ModalHeader className='flex gap-2 text-xl font-semibold'>
							<Image
								alt='Login Icon'
								src='/icons/login.svg'
								width={24}
								height={24}
								className='ml-[-8px] mr-2'
							/>
							Login
						</ModalHeader>
						<Divider />

						<ModalBody>
							<LoginForm />
						</ModalBody>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}

export default LoginModal;

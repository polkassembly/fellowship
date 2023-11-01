// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import JoinFellowshipForm from '@/components/Misc/JoinFellowshipForm';
import { Button } from '@nextui-org/button';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/modal';
import { useRouter } from 'next/navigation';
import React from 'react';
import Image from 'next/image';
import { Divider } from '@nextui-org/divider';

function JoinFellowship() {
	const router = useRouter();

	const handleOnClose = () => {
		router.back();
	};

	return (
		<Modal
			isOpen
			onClose={handleOnClose}
			size='4xl'
			scrollBehavior='inside'
		>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className='flex gap-2 text-xl font-semibold'>
							<Image
								alt='Join Fellowship Icon'
								src='/icons/add-user-grey-filled.svg'
								width={24}
								height={24}
								className='ml-[-8px] mr-2'
							/>
							Join Fellowship
						</ModalHeader>
						<Divider />

						<ModalBody>
							<JoinFellowshipForm />
						</ModalBody>

						<Divider />

						<ModalFooter>
							<Button
								color='primary'
								onPress={onClose}
								className='flex flex-1 text-sm'
							>
								Preview Application Request
								<Image
									alt='Join Fellowship Icon'
									src='/icons/arrow-right-white.svg'
									width={20}
									height={20}
								/>
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}

export default JoinFellowship;

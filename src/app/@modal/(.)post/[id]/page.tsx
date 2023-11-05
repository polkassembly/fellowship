// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { Divider } from '@nextui-org/divider';
import { Modal, ModalContent, ModalHeader, ModalBody } from '@nextui-org/modal';
import { useRouter } from 'next/navigation';
import React from 'react';

interface Props {
	params: {
		id: string;
	};
}

function PostModalPage({ params: { id } }: Props) {
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
						<ModalHeader className='flex gap-2 text-xl font-semibold'>Post {id}</ModalHeader>
						<Divider />

						<ModalBody>Post Content here</ModalBody>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}

export default PostModalPage;

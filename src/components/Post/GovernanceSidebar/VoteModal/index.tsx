// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/modal';
import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Divider } from '@nextui-org/divider';
import { Button } from '@nextui-org/button';
import { VoteDecisionType } from '@/global/types';
import VoteForm from './VoteForm';

interface Props {
	isModalOpen: boolean;
	defaultVoteType?: VoteDecisionType;
	closeModal: () => void;
}

function VoteModal({ isModalOpen, defaultVoteType, closeModal }: Props) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const formRef = useRef<any>(null);

	const [disableConfirm, setDisableConfirm] = useState(true);

	const handleConfirm = () => {
		formRef?.current?.submitVote?.();
	};

	return (
		<Modal
			isOpen={isModalOpen}
			onClose={closeModal}
			size='xl'
			scrollBehavior='inside'
			shouldBlockScroll
			isDismissable={false}
		>
			<ModalContent>
				{() => (
					<>
						<ModalHeader className='flex items-center gap-2 text-sm'>
							<Image
								alt='Cast Vote Icon'
								src='/icons/post/cast-vote-hammer.svg'
								width={24}
								height={24}
								className='mr-2'
							/>
							<h3 className='text-base font-semibold'>Cast Your Vote</h3>
						</ModalHeader>
						<Divider />

						<ModalBody className='p-6'>
							<VoteForm
								defaultVoteType={defaultVoteType}
								ref={formRef}
								onSuccess={closeModal}
								setDisableConfirm={setDisableConfirm}
							/>
						</ModalBody>

						<Divider />
						<ModalFooter>
							<Button
								color='primary'
								className='flex w-min text-sm'
								size='sm'
								onPress={handleConfirm}
								isDisabled={disableConfirm}
							>
								Confirm
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}

export default VoteModal;

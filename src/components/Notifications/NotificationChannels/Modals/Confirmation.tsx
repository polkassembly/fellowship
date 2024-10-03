// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/modal';
import { Button } from '@nextui-org/button';
import Image from 'next/image';

function DisabledConfirmation({ open, onConfirm, onCancel, channel }: Readonly<{ open: boolean; onConfirm: () => void; onCancel: () => void; channel: string }>) {
	return (
		<Modal
			isOpen={open}
			onClose={onCancel}
		>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className='flex gap-2 border-b border-primary_border text-xl font-semibold'>
							<Image
								alt='Login Icon'
								src='/icons/check-green.svg'
								width={24}
								height={24}
								className='ml-[-8px] mr-2'
							/>
							Confirmation
						</ModalHeader>

						<ModalBody className='flex flex-col gap-5 py-5'>
							<p className='text-[16px] font-medium leading-[21px]'>{`Are you sure you want to disable Polkassembly bot from your ${channel} channel chat?`}</p>
							<div className='flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-300/20 p-2'>
								<Image
									alt='Login Icon'
									src='/icons/info.svg'
									width={20}
									height={20}
									className='dark:grayscale dark:invert dark:filter'
								/>
								<p className='text-sm'>Disabling bot means no more notifications for {channel} channel chat, Stay connected and informed by keeping the bot enabled.</p>
							</div>
						</ModalBody>

						<ModalFooter className='border-t border-primary_border'>
							<Button
								color='danger'
								variant='light'
								onPress={onClose}
							>
								Cancel
							</Button>
							<Button
								color='primary'
								onPress={onConfirm}
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

export default DisabledConfirmation;

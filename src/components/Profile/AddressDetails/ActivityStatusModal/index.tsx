// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import LoadingSpinner from '@/components/Misc/LoadingSpinner';
import { useApiContext, useUserDetailsContext } from '@/contexts';
import { Divider } from '@nextui-org/divider';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/modal';
import React, { useRef, useState } from 'react';
import { Button } from '@nextui-org/button';
import LinkWithNetwork from '@/components/Misc/LinkWithNetwork';
import getSubstrateAddress from '@/utils/getSubstrateAddress';
import ActivityStatusForm from './ActivityStatusForm';

interface Props {
	isOpen: boolean;
	onClose?: () => void;
	address: string;
	isActive: boolean;
	onSuccess: (isActive: boolean) => void;
}

function ActivityStatusModal({ isOpen, address, isActive, onClose, onSuccess }: Props) {
	const substrateAddress = getSubstrateAddress(address);

	const { id } = useUserDetailsContext();
	const { api, apiReady, fellows } = useApiContext();

	const [submitBtnText, setSubmitBtnText] = useState('Submit Transaction');

	const formRef = useRef<HTMLFormElement>(null);

	const handleSubmit = () => {
		formRef?.current?.requestSubmit(); // Call the submit function from the child component
	};

	return (
		<Modal
			isOpen={isOpen}
			size='4xl'
			scrollBehavior='inside'
			shouldBlockScroll
			onClose={() => onClose?.()}
		>
			<ModalContent>
				{() =>
					id ? (
						<>
							<ModalHeader className='flex items-center gap-2 text-sm'>
								<h3 className='font-semibold'>Set Active Status</h3>
							</ModalHeader>
							<Divider />

							<ModalBody>
								{!api || !apiReady || !fellows || !fellows.length ? (
									<LoadingSpinner />
								) : !substrateAddress ? (
									<div className='flex items-center justify-center'>Invalid address passed in url.</div>
								) : (
									<ActivityStatusForm
										formRef={formRef}
										setSubmitBtnText={setSubmitBtnText}
										address={substrateAddress}
										isActive={isActive}
										onSuccess={onSuccess}
									/>
								)}
							</ModalBody>

							<Divider />

							<ModalFooter>
								<Button
									color='primary'
									onPress={() => handleSubmit()}
									className='flex flex-1 text-sm'
								>
									{submitBtnText}
								</Button>
							</ModalFooter>
						</>
					) : (
						<div className='p-6 text-center'>
							Please&nbsp;
							<LinkWithNetwork
								href='/login'
								className='text-link'
							>
								login
							</LinkWithNetwork>
							&nbsp;to change activity status.
						</div>
					)
				}
			</ModalContent>
		</Modal>
	);
}

export default ActivityStatusModal;

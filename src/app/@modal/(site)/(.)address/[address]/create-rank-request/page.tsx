// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { Button } from '@nextui-org/button';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/modal';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';
import { Divider } from '@nextui-org/divider';
import { useApiContext, useUserDetailsContext } from '@/contexts';
import LinkWithNetwork from '@/components/Misc/LinkWithNetwork';
import CreateRankRequestForm from '@/components/Profile/CreateRankRequestForm';
import { ServerComponentProps } from '@/global/types';
import getSubstrateAddress from '@/utils/getSubstrateAddress';
import LoadingSpinner from '@/components/Misc/LoadingSpinner';

interface IParams {
	address: string;
}

function CreateRankRequestModal({ params }: ServerComponentProps<IParams, unknown>) {
	const address = params?.address;

	const router = useRouter();
	const { id } = useUserDetailsContext();
	const { api, apiReady, fellows } = useApiContext();

	const [submitBtnText, setSubmitBtnText] = useState('Create Rank Request');

	const formRef = useRef<HTMLFormElement>(null);

	const handleOnClose = () => {
		router.back();
	};

	const handleSubmit = () => {
		formRef?.current?.requestSubmit(); // Call the submit function from the child component
	};

	const routeSubstrateAddress = getSubstrateAddress(address || '');
	if (!routeSubstrateAddress) return <div>Invalid fellow address in route.</div>;

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
								<h3 className='font-semibold'>Create Rank Request</h3>
							</ModalHeader>
							<Divider />

							<ModalBody>
								{!api || !apiReady || !fellows || !fellows.length ? (
									<LoadingSpinner />
								) : !fellows.find((fellow) => fellow.address === routeSubstrateAddress) ? (
									<div className='p-6 text-center'>This address is not a fellow of this network.</div>
								) : (
									<CreateRankRequestForm
										setSubmitBtnText={setSubmitBtnText}
										formRef={formRef}
										address={routeSubstrateAddress}
									/>
								)}
							</ModalBody>

							<Divider />

							<ModalFooter>
								{fellows.find((fellow) => fellow.address === routeSubstrateAddress) && (
									<Button
										color='primary'
										onPress={() => handleSubmit()}
										className='flex flex-1 text-sm'
									>
										{submitBtnText}
									</Button>
								)}
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
							&nbsp;to create a rank request.
						</div>
					)
				}
			</ModalContent>
		</Modal>
	);
}

export default CreateRankRequestModal;

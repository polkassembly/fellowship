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
import { ServerComponentProps } from '@/global/types';
import getSubstrateAddress from '@/utils/getSubstrateAddress';
import LoadingSpinner from '@/components/Misc/LoadingSpinner';
import SalaryInductionForm from '@/components/Profile/SalaryInductionForm';

interface IParams {
	address: string;
}

interface ISearchParams {
	isRegister: string;
}

function SalaryInductModalPage({ params, searchParams }: ServerComponentProps<IParams, ISearchParams>) {
	const address = params?.address;
	const isRegistration = searchParams?.isRegister === 'true';

	const router = useRouter();
	const { id } = useUserDetailsContext();
	const { api, apiReady, fellows } = useApiContext();

	const [submitBtnText, setSubmitBtnText] = useState('Submit Transaction');

	const formRef = useRef<HTMLFormElement>(null);

	const handleOnClose = () => {
		router.back();
	};

	const handleSubmit = () => {
		formRef?.current?.requestSubmit(); // Call the submit function from the child component
	};

	const routeSubstrateAddress = getSubstrateAddress(address || '');
	if (!routeSubstrateAddress) return <div>Invalid address in route.</div>;

	if (!fellows.find((fellow) => fellow.address === routeSubstrateAddress)) {
		return (
			<div className='rounded-2xl border border-primary_border p-6'>
				<h3 className='font-semibold'>Salary Induction</h3>

				<div className='p-6 text-center'>This address is not a fellow of this network.</div>
			</div>
		);
	}

	return (
		<Modal
			isOpen
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
								<h3 className='font-semibold'>Salary {isRegistration ? 'Registration' : 'Induction'}</h3>
							</ModalHeader>
							<Divider />

							<ModalBody>
								{!api || !apiReady || !fellows || !fellows.length ? (
									<LoadingSpinner />
								) : (
									<SalaryInductionForm
										isRegistration={isRegistration}
										setSubmitBtnText={setSubmitBtnText}
										formRef={formRef}
										address={routeSubstrateAddress}
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
							&nbsp;to get {isRegistration ? 'registered' : 'inducted'} for salary.
						</div>
					)
				}
			</ModalContent>
		</Modal>
	);
}

export default SalaryInductModalPage;

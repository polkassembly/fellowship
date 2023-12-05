// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { useApiContext, useUserDetailsContext } from '@/contexts';
import { ServerComponentProps } from '@/global/types';
import getSubstrateAddress from '@/utils/getSubstrateAddress';
import React, { useRef, useState } from 'react';
import LoadingSpinner from '@/components/Misc/LoadingSpinner';
import LinkWithNetwork from '@/components/Misc/LinkWithNetwork';
import { Button } from '@nextui-org/button';
import SalaryInductionForm from '@/components/Profile/SalaryInductionForm';

interface IParams {
	address: string;
}

interface ISearchParams {
	isRegister: string;
}

function SalaryInductPage({ params, searchParams }: ServerComponentProps<IParams, ISearchParams>) {
	const address = params?.address;
	const isRegistration = searchParams?.isRegister === 'true';

	const { id } = useUserDetailsContext();
	const { api, apiReady, fellows } = useApiContext();

	const [submitBtnText, setSubmitBtnText] = useState('Submit Transaction');

	const formRef = useRef<HTMLFormElement>(null);

	const handleSubmit = () => {
		formRef?.current?.requestSubmit(); // Call the submit function from the child component
	};

	const routeSubstrateAddress = getSubstrateAddress(address || '');
	if (!routeSubstrateAddress) return <div>Invalid address in route.</div>;

	if (!fellows || !fellows.length)
		return (
			<div className='flex h-[50vh] items-center justify-center'>
				<LoadingSpinner />
			</div>
		);

	if (!fellows.find((fellow) => fellow.address === routeSubstrateAddress)) {
		return (
			<div className='rounded-2xl border border-primary_border p-6'>
				<h3 className='font-semibold'>Salary {isRegistration ? 'Registration' : 'Induction'}</h3>

				<div className='p-6 text-center'>This address is not a fellow of this network.</div>
			</div>
		);
	}

	return (
		<div className='rounded-2xl border border-primary_border p-6'>
			<h3 className='font-semibold'>Salary {isRegistration ? 'Registration' : 'Induction'}</h3>

			<div>
				{!id ? (
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
				) : !api || !apiReady || !fellows || !fellows.length ? (
					<LoadingSpinner />
				) : (
					<div className='flex flex-col gap-6'>
						<SalaryInductionForm
							isRegistration={isRegistration}
							setSubmitBtnText={setSubmitBtnText}
							formRef={formRef}
							address={routeSubstrateAddress}
						/>

						<Button
							color='primary'
							onPress={() => handleSubmit()}
							className='flex min-h-[40px] flex-1 text-sm'
						>
							{submitBtnText}
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}

export default SalaryInductPage;

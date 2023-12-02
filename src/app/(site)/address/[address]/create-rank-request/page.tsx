// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { useApiContext, useUserDetailsContext } from '@/contexts';
import { ServerComponentProps } from '@/global/types';
import getSubstrateAddress from '@/utils/getSubstrateAddress';
import React, { useRef, useState } from 'react';
import LoadingSpinner from '@/components/Misc/LoadingSpinner';
import CreateRankRequestForm from '@/components/Profile/CreateRankRequestForm';
import LinkWithNetwork from '@/components/Misc/LinkWithNetwork';
import { Button } from '@nextui-org/button';

interface IParams {
	address: string;
}

function CreateRankRequestPage({ params }: ServerComponentProps<IParams, unknown>) {
	const address = params?.address;

	const { id } = useUserDetailsContext();
	const { api, apiReady, fellows } = useApiContext();

	const [submitBtnText, setSubmitBtnText] = useState('Create Rank Request');

	const formRef = useRef<HTMLFormElement>(null);

	const handleSubmit = () => {
		formRef?.current?.requestSubmit(); // Call the submit function from the child component
	};

	const routeSubstrateAddress = getSubstrateAddress(address || '');
	if (!routeSubstrateAddress) return <div>Invalid address in route.</div>;

	if (!fellows.find((fellow) => fellow.address === routeSubstrateAddress)) {
		return (
			<div className='rounded-2xl border border-primary_border p-6'>
				<h3 className='font-semibold'>Create Rank Request</h3>

				<div className='p-6 text-center'>This address is not a fellow of this network.</div>
			</div>
		);
	}

	return (
		<div className='rounded-2xl border border-primary_border p-6'>
			<h3 className='font-semibold'>Create Rank Request</h3>

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
						&nbsp;to create an application request for fellowship
					</div>
				) : !api || !apiReady || !fellows || !fellows.length ? (
					<LoadingSpinner />
				) : (
					<div className='flex flex-col gap-6'>
						<CreateRankRequestForm
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

export default CreateRankRequestPage;

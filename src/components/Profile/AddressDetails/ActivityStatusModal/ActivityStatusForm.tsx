// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { useApiContext, useUserDetailsContext } from '@/contexts';
import { Wallet } from '@/global/types';
import { InjectedAccount } from '@polkadot/extension-inject/types';
import React, { FormEvent, RefObject, useState } from 'react';
import getSubstrateAddress from '@/utils/getSubstrateAddress';
import queueNotification from '@/utils/queueNotification';
import executeTx from '@/utils/executeTx';
import WalletButtonsRow from '@/components/Auth/WalletButtonsRow';
import AddressDropdown from '@/components/Auth/AddressDropdown';
import AlertCard from '@/components/Misc/AlertCard';
import LoadingSpinner from '@/components/Misc/LoadingSpinner';
import Address from '../../Address';

interface Props {
	isRegistration?: boolean;
	address: string;
	formRef?: RefObject<HTMLFormElement>;
	isActive: boolean;
	setSubmitBtnText?: React.Dispatch<React.SetStateAction<string>>;
	onSuccess: (isActive: boolean) => void;
}

function ActivityStatusForm({ address, formRef, setSubmitBtnText, isRegistration = false, isActive, onSuccess }: Props) {
	const { loginWallet, id } = useUserDetailsContext();
	const { api, apiReady, network, fellows } = useApiContext();

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(loginWallet);
	const [selectedAddress, setSelectedAddress] = useState<InjectedAccount | null>(null);
	const [txStatus, setTxStatus] = useState('');

	const submitForm = async (e: FormEvent) => {
		e.preventDefault();

		if (!selectedAddress?.address || !fellows?.find((fellow) => fellow.address === (getSubstrateAddress(selectedAddress?.address || '') || ''))) {
			setError('Please select the address mentioned above.');
			return;
		}

		if (!id || loading || !api || !apiReady || !selectedAddress || !address) return;

		setLoading(true);
		setError('');

		const tx = api.tx.fellowshipCore.setActive(isActive);

		const onFailed = (message: string) => {
			setLoading(false);
			queueNotification({
				header: 'Transaction Failed!',
				message,
				status: 'error'
			});
			setSubmitBtnText?.('Submit Transaction');
			setTxStatus('');
		};

		const onTxSuccess = async () => {
			queueNotification({
				header: 'Transaction Successful!',
				message: 'Set status successful.',
				status: 'success'
			});

			setLoading(false);

			setSubmitBtnText?.('Transaction Successful');

			onSuccess(isActive);
		};

		setLoading(true);
		setSubmitBtnText?.('Executing Transaction...');
		setTxStatus('Waiting for confirmation');

		await executeTx({
			address: selectedAddress.address,
			api,
			apiReady,
			errorMessageFallback: 'Error while executing transaction. Please try again.',
			network,
			onFailed,
			onSuccess: onTxSuccess,
			tx,
			setStatus: (status: string) => setTxStatus(status)
		});
	};

	if (!fellows || !fellows.length) {
		return <LoadingSpinner />;
	}

	return (
		<form
			ref={formRef}
			onSubmit={submitForm}
			className='flex flex-col gap-6 py-6'
		>
			<div className='flex flex-col gap-2 text-xs'>
				<span className='text-xs capitalize'>Address to set {isActive ? 'active' : 'inactive'}:</span>
				<div className='flex h-12 w-full items-center justify-between rounded-xl border-1 border-primary_border p-3 font-normal'>
					<span>
						<Address
							variant='dropdownItem'
							address={address}
						/>
					</span>
				</div>
			</div>

			{error && (
				<AlertCard
					className='w-full'
					type='error'
					message={error}
				/>
			)}

			{txStatus && (
				<AlertCard
					className='w-full'
					type='default'
					message={
						<div className='flex items-center gap-3'>
							<LoadingSpinner
								size='sm'
								message=''
							/>
							<span>{txStatus}</span>
						</div>
					}
				/>
			)}

			<div className='flex w-full flex-col items-start'>
				<div className='flex flex-col items-start justify-start gap-2 text-center text-xs'>
					<h3>Please select a wallet : </h3>
					<WalletButtonsRow
						disabled={loading}
						onWalletClick={(e, wallet) => setSelectedWallet(wallet)}
					/>
				</div>
			</div>

			{selectedWallet && (
				<div className='flex w-full flex-col items-center justify-center gap-6'>
					{selectedAddress?.address && address !== getSubstrateAddress(selectedAddress.address) && (
						<AlertCard
							className='w-full'
							type='warning'
							message='This address is not the one above. Please select the correct address.'
						/>
					)}
					<AddressDropdown
						disabled={loading}
						wallet={selectedWallet}
						onAddressSelect={setSelectedAddress}
						label={`Select the address to ${isRegistration ? 'register' : 'induct'}:`}
					/>
				</div>
			)}
		</form>
	);
}

export default ActivityStatusForm;

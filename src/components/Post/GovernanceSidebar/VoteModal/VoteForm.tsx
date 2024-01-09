// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import AddressDropdown from '@/components/Auth/AddressDropdown';
import WalletButtonsRow from '@/components/Auth/WalletButtonsRow';
import AlertCard from '@/components/Misc/AlertCard';
import { useApiContext, usePostDataContext, useUserDetailsContext } from '@/contexts';
import { VoteDecisionType, Wallet } from '@/global/types';
import getSubstrateAddress from '@/utils/getSubstrateAddress';
import { InjectedAccount } from '@polkadot/extension-inject/types';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import executeTx from '@/utils/executeTx';
import LoadingSpinner from '@/components/Misc/LoadingSpinner';
import queueNotification from '@/utils/queueNotification';
import VoteSelect from './VoteSelect';

interface Props {
	defaultVoteType?: VoteDecisionType;
	onSuccess?: () => void;
}

const VoteForm = forwardRef(({ defaultVoteType, onSuccess }: Props, ref) => {
	const { loginWallet } = useUserDetailsContext();
	const { api, apiReady, network, fellows } = useApiContext();
	const {
		postData: { id: postId }
	} = usePostDataContext();

	const [loading, setLoading] = useState(false);
	const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(loginWallet);
	const [selectedAddress, setSelectedAddress] = useState<InjectedAccount | null>(null);
	const [setselectedVoteType, setSetselectedVoteType] = useState(defaultVoteType ?? VoteDecisionType.AYE);
	const [error, setError] = useState('');
	const [txStatus, setTxStatus] = useState('');

	const onWalletClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, wallet: Wallet) => {
		setSelectedWallet(wallet);
	};

	const handleSubmitVote = async () => {
		if (!api || !apiReady || loading) return;

		if (!selectedAddress?.address || !fellows?.find((fellow) => fellow.address === (getSubstrateAddress(selectedAddress?.address || '') || ''))) {
			setError('Please select a fellow address.');
			return;
		}

		setError('');

		const voteTx = api.tx.fellowshipCollective.vote(postId, setselectedVoteType === VoteDecisionType.AYE);

		const onTxSuccess = () => {
			setLoading(false);
			queueNotification({
				header: 'Success!',
				message: `Vote on referendum #${postId} successful.`,
				status: 'success'
			});
			onSuccess?.();
		};

		const onTxFailed = (message: string) => {
			setLoading(false);
			setTxStatus('');
			setError(`Transaction failed - ${message}`);
			queueNotification({
				header: 'Failed!',
				message,
				status: 'error'
			});
		};

		if (!voteTx) {
			setError('Invalid transaction, please reload and try again.');
			return;
		}

		setLoading(true);
		setTxStatus('Sending transaction...');

		await executeTx({
			address: selectedAddress?.address,
			api,
			apiReady,
			errorMessageFallback: 'Transaction failed.',
			network,
			onFailed: onTxFailed,
			onSuccess: onTxSuccess,
			setStatus: (status: string) => setTxStatus(status),
			tx: voteTx
		});
	};

	useImperativeHandle(ref, () => ({
		submitVote() {
			handleSubmitVote();
		}
	}));

	return (
		<section className='flex flex-col gap-6'>
			<div className='flex flex-col items-center justify-center gap-2 text-center text-xs'>
				<h3 className='text-foreground/60'>Please select a wallet : </h3>
				<WalletButtonsRow
					disabled={loading}
					onWalletClick={onWalletClick}
				/>
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

			{selectedWallet && (
				<div className='flex w-full flex-col items-center justify-center gap-6'>
					{selectedAddress?.address && !fellows?.find((fellow) => fellow.address === (getSubstrateAddress(selectedAddress?.address || '') || '')) && (
						<AlertCard
							className='w-full'
							type='warning'
							message='Please connect an address which is part of the fellowship to cast your vote'
						/>
					)}

					<AddressDropdown
						disabled={loading}
						wallet={selectedWallet}
						onAddressSelect={setSelectedAddress}
						label='Select a fellow address :'
					/>

					<VoteSelect
						defaultVoteType={defaultVoteType}
						onSelection={setSetselectedVoteType}
						label='Select a vote type :'
						disabled={loading}
					/>
				</div>
			)}
		</section>
	);
});

export default VoteForm;

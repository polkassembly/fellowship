// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { RFCPullRequestItem, Wallet } from '@/global/types';
import { RefObject, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useApiContext, useUserDetailsContext } from '@/contexts';
import { InjectedAccount } from '@polkadot/extension-inject/types';
import { Input } from '@nextui-org/input';
import getSubstrateAddress from '@/utils/getSubstrateAddress';
import { BN_HUNDRED } from '@polkadot/util';
import queueNotification from '@/utils/queueNotification';
import executeTx from '@/utils/executeTx';
import saveNewProposal from '@/utils/saveNewProposal';
import { Radio, RadioGroup } from '@nextui-org/radio';
import { blake2AsHex } from '@polkadot/util-crypto';
import AlertCard from '../Misc/AlertCard';
import WalletButtonsRow from '../Auth/WalletButtonsRow';
import AddressDropdown from '../Auth/AddressDropdown';
import MarkdownEditor from '../TextEditor/MarkdownEditor';
import LoadingSpinner from '../Misc/LoadingSpinner';
import CreateRFCProposalSuccessModal from './CreateRFCProposalSuccessModal';

enum RfcRequestType {
	APPROVE = 'APPROVE',
	REJECT = 'REJECT'
}

interface Props {
	prItem: RFCPullRequestItem;
	formRef: RefObject<HTMLFormElement>;
	onSuccess?: () => void;
}

function CreateRFCProposalForm({ prItem, formRef, onSuccess: onFormSuccess }: Props) {
	const { loginWallet, id } = useUserDetailsContext();
	const { api, apiReady, network, fellows } = useApiContext();

	const {
		register,
		formState: { errors },
		control,
		handleSubmit
	} = useForm({
		defaultValues: {
			title: `RFC: PR #${prItem.id} - ${prItem.title || ''}`,
			description: ''
		}
	});

	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(loginWallet);
	const [selectedAddress, setSelectedAddress] = useState<InjectedAccount | null>(null);
	const [txStatus, setTxStatus] = useState('');
	const [rfcRequestType, setRfcRequestType] = useState<RfcRequestType>(RfcRequestType.APPROVE);
	const [successDetails, setSuccessDetails] = useState({ proposer: selectedAddress?.address || '', postId: 0, requestType: RfcRequestType.APPROVE, prItem });

	const submitForm = async ({ title, description }: { title: string; description: string }) => {
		if (!id || loading || !api || !apiReady || !selectedAddress) return;

		setError('');

		if (
			!selectedAddress?.address ||
			!getSubstrateAddress(selectedAddress.address) ||
			!fellows?.find((fellow) => fellow.address === (getSubstrateAddress(selectedAddress?.address || '') || ''))
		) {
			setError('Please select a valid fellow address.');
			return;
		}

		if (!id) {
			setError('You must be logged in to submit a proposal');
			return;
		}

		if (!title) {
			setError('Title is required');
			return;
		}

		if (!description) {
			setError('Description is required');
			return;
		}

		if (!rfcRequestType) {
			setError('Please select a RFC Proposal Type');
			return;
		}

		setLoading(true);
		setError('');

		const proposalOrigin = { FellowshipOrigins: 'Fellows' };

		const paddedPrNumber = `0000${prItem.id}`.slice(-4);
		const inlineBytes = api.tx.system.remarkWithEvent(`RFC_${rfcRequestType}(${paddedPrNumber}, ${blake2AsHex(description)})`).method.toHex();

		const tx = api.tx.fellowshipReferenda.submit(proposalOrigin, { Inline: inlineBytes }, { After: BN_HUNDRED });

		const onFailed = (message: string) => {
			setLoading(false);
			queueNotification({
				header: 'Create Proposal Transaction Failed!',
				message,
				status: 'error'
			});
			setTxStatus('');
		};

		const onSuccess = async () => {
			let postId = Number(await api.query.fellowshipReferenda.referendumCount()) - 1;

			if (postId < 0) {
				postId = 0;
			}

			saveNewProposal({
				postId,
				content: description,
				proposerAddress: selectedAddress.address,
				title,
				userId: id,
				network,
				onError: (err) => {
					// eslint-disable-next-line no-console
					console.error('Error while saving proposal description: ', postId, err);
				}
			});

			queueNotification({
				header: 'Transaction Successful!',
				message: 'Proposal created successfully.',
				status: 'success'
			});

			onFormSuccess?.();

			setSuccessDetails({
				proposer: selectedAddress.address,
				postId,
				requestType: rfcRequestType,
				prItem
			});
		};

		setTxStatus('Waiting for confirmation');

		await executeTx({
			address: selectedAddress.address,
			api,
			apiReady,
			errorMessageFallback: 'Error while executing transaction. Please try again.',
			network,
			onFailed,
			onSuccess,
			tx,
			setStatus: (status: string) => setTxStatus(status)
		});

		setLoading(false);
	};

	return (
		<>
			{Boolean(successDetails.postId) && <CreateRFCProposalSuccessModal successDetails={successDetails} />}

			<section className='flex flex-col gap-3'>
				<form
					ref={formRef}
					onSubmit={handleSubmit(submitForm)}
					className='flex flex-col gap-4'
				>
					<div className='flex w-full flex-col items-start'>
						<div className='flex flex-col items-start justify-start gap-2 text-center text-sm'>
							<h3>Please select a wallet : </h3>
							<WalletButtonsRow
								disabled={loading}
								onWalletClick={(e, w) => setSelectedWallet(w)}
							/>
						</div>
					</div>

					{selectedWallet && (
						<div className='w-full'>
							<span className='text-sm'>
								Inductee Address <span className='text-rose-500'>*</span>
							</span>
							<AddressDropdown
								disabled={loading}
								wallet={selectedWallet}
								onAddressSelect={setSelectedAddress}
							/>
						</div>
					)}

					{error && (
						<AlertCard
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

					<RadioGroup
						isDisabled={loading}
						aria-disabled={loading}
						label='Select RFC Proposal Type :'
						orientation='horizontal'
						className='text-xs'
						value={rfcRequestType}
						onChange={(e) => {
							if (loading) return;
							setRfcRequestType(e.target.value as RfcRequestType);
						}}
					>
						<Radio
							isDisabled={loading}
							value={RfcRequestType.APPROVE}
						>
							<span className='text-xs'>Approve</span>
						</Radio>
						<Radio
							isDisabled={loading}
							value={RfcRequestType.REJECT}
						>
							<span className='text-xs'>Reject</span>
						</Radio>
					</RadioGroup>

					<div>
						<Input
							label={
								<span>
									Title<span className='text-base text-rose-500'>*</span>
								</span>
							}
							placeholder='Enter your proposal title'
							labelPlacement='outside'
							variant='bordered'
							radius='sm'
							classNames={{
								label: 'text-sm font-normal -mb-1',
								inputWrapper: 'border-primary_border border-1'
							}}
							{...register('title')}
							aria-invalid={errors.title ? 'true' : 'false'}
							disabled={loading}
						/>
						{errors.title?.message && (
							<small
								className='text-warning'
								role='alert'
							>
								{errors.title.message.toString()}
							</small>
						)}
					</div>

					<div>
						<div className='mb-1 text-sm font-normal'>
							Description<span className='text-base text-rose-500'>*</span>
						</div>

						<Controller
							name='description'
							control={control}
							render={({ field }) => (
								<MarkdownEditor
									{...field}
									disabled={loading}
								/>
							)}
						/>
						{errors.description?.message && (
							<small
								className='text-warning'
								role='alert'
							>
								{errors.description.message.toString()}
							</small>
						)}
					</div>
				</form>
			</section>
		</>
	);
}

export default CreateRFCProposalForm;

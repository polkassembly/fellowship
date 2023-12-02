// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { useApiContext, useUserDetailsContext } from '@/contexts';
import { IPreimage, Wallet } from '@/global/types';
import { InjectedAccount } from '@polkadot/extension-inject/types';
import React, { RefObject, useState } from 'react';
import getSubstrateAddress from '@/utils/getSubstrateAddress';
import { Radio, RadioGroup } from '@nextui-org/radio';
import RANK_CONSTANTS from '@/global/constants/rankConstants';
import Image from 'next/image';
import { Controller, useForm } from 'react-hook-form';
import { Input } from '@nextui-org/input';
import getPreimage from '@/utils/getPreimage';
import queueNotification from '@/utils/queueNotification';
import executeTx from '@/utils/executeTx';
import { BN_HUNDRED } from '@polkadot/util';
import WalletButtonsRow from '@/components/Auth/WalletButtonsRow';
import AddressDropdown from '@/components/Auth/AddressDropdown';
import AlertCard from '@/components/Misc/AlertCard';
import LoadingSpinner from '@/components/Misc/LoadingSpinner';
import MarkdownEditor from '@/components/TextEditor/MarkdownEditor';
import saveNewProposal from '@/utils/saveNewProposal';
import CreateRankRequestSuccessModalForm from './CreateRankRequestSuccessModalForm';
import Address from '../Address';

enum RankRequestType {
	RETAIN = 'retain',
	PROMOTE = 'promote'
}

interface Props {
	address: string;
	formRef?: RefObject<HTMLFormElement>;
	setSubmitBtnText?: React.Dispatch<React.SetStateAction<string>>;
}

function CreateRankRequestForm({ address, formRef, setSubmitBtnText }: Props) {
	const { loginWallet, id } = useUserDetailsContext();
	const { api, apiReady, network, fellows } = useApiContext();

	const {
		register,
		formState: { errors },
		control,
		handleSubmit,
		getValues
	} = useForm({
		defaultValues: {
			title: '',
			description: '',
			evidence: ''
		}
	});

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [rankRequestType, setRankRequestType] = useState<RankRequestType>(RankRequestType.PROMOTE);
	const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(loginWallet);
	const [selectedAddress, setSelectedAddress] = useState<InjectedAccount | null>(null);
	const [txStatus, setTxStatus] = useState('');
	const [successDetails, setSuccessDetails] = useState({
		proposer: '',
		address,
		preimageHash: '',
		preimageLength: 0,
		postId: 0
	});

	const currentRank = fellows.find((fellow) => fellow.address === address)?.rank;

	const handleSubmitProposal = async (preimage: IPreimage) => {
		if (!id || !api || !apiReady || !selectedAddress || !preimage || !preimage.notePreimageTx || !address) return;

		const proposalOrigin = { FellowshipOrigins: RANK_CONSTANTS[Number(currentRank)][rankRequestType === RankRequestType.PROMOTE ? 'promotionTrack' : 'retentionTrack'] };

		const proposalTx = api.tx.fellowshipReferenda.submit(proposalOrigin, { Lookup: { hash: preimage.preimageHash, len: String(preimage.preimageLength) } }, { After: BN_HUNDRED });

		const txArr = [preimage.notePreimageTx, proposalTx];

		const { evidence } = getValues();

		if (evidence) {
			const wish = rankRequestType === RankRequestType.PROMOTE ? 'Promotion' : 'Retention';
			const evidenceTx = api.tx?.fellowshipCore.submitEvidence(wish, evidence);
			txArr.unshift(evidenceTx);
		}

		const tx = api.tx.utility.batchAll(txArr);

		const onFailed = (message: string) => {
			setLoading(false);
			queueNotification({
				header: 'Create proposal transaction Failed!',
				message,
				status: 'error'
			});
			setSubmitBtnText?.('Submit Proposal');
			setTxStatus('');
		};

		const onSuccess = async () => {
			let postId = Number(await api.query.fellowshipReferenda.referendumCount()) - 1;

			if (postId < 0) {
				postId = 0;
			}

			const { title, description } = getValues();

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
				message: 'Proposal submitted successfully.',
				status: 'success'
			});

			setLoading(false);

			setSubmitBtnText?.('Proposal Submitted');

			setSuccessDetails({
				proposer: selectedAddress.address,
				address,
				preimageHash: preimage.preimageHash,
				preimageLength: preimage.preimageLength,
				postId
			});
		};

		setLoading(true);
		setSubmitBtnText?.('Submitting Proposal...');

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
	};

	const submitForm = async ({ title, description }: { title: string; description: string }) => {
		if (!selectedAddress?.address || !fellows?.find((fellow) => fellow.address === (getSubstrateAddress(selectedAddress?.address || '') || ''))) {
			setError('Please select a fellow address.');
			return;
		}

		if (!title || !description) {
			setError('Please fill in all the required fields.');
			return;
		}

		if (loading || !api || !apiReady) return;

		setLoading(true);
		setError('');

		let preimageTx;

		if (rankRequestType === RankRequestType.PROMOTE) {
			preimageTx = api.tx?.fellowshipCore.promote(selectedAddress.address, Number(currentRank) + 1);
		} else {
			preimageTx = api.tx?.fellowshipCore.approve(selectedAddress.address, Number(currentRank));
		}

		const preimage = getPreimage(api, preimageTx);

		if (!preimage.notePreimageTx) return;

		await handleSubmitProposal(preimage);
	};

	if (!fellows) {
		return <LoadingSpinner />;
	}

	if (successDetails.proposer) {
		return <CreateRankRequestSuccessModalForm successDetails={successDetails} />;
	}

	if (!currentRank) {
		return (
			<AlertCard
				className='w-full'
				type='warning'
				message='This address is not a fellow. Please select a fellow address.'
			/>
		);
	}

	return (
		<form
			ref={formRef}
			onSubmit={handleSubmit(submitForm)}
			className='flex flex-col gap-6 py-6'
		>
			<RadioGroup
				isDisabled={loading}
				aria-disabled={loading}
				label='Select Request Type :'
				orientation='horizontal'
				className='text-xs'
				value={rankRequestType}
				onChange={(e) => {
					if (loading) return;
					setRankRequestType(e.target.value as RankRequestType);
				}}
			>
				<Radio
					isDisabled={loading}
					value={RankRequestType.PROMOTE}
				>
					<span className='text-xs'>Rank Promotion</span>
				</Radio>
				<Radio
					isDisabled={loading}
					value={RankRequestType.RETAIN}
				>
					<span className='text-xs'>Rank Retention</span>
				</Radio>
			</RadioGroup>

			<div className='flex flex-col gap-2 text-xs'>
				<span className='text-xs capitalize'>Address To {rankRequestType} :</span>
				<div className='flex h-12 w-full items-center justify-between rounded-xl border-1 border-primary_border p-3 font-normal'>
					<span>
						<Address
							variant='dropdownItem'
							address={address}
						/>
					</span>
				</div>
			</div>

			<div className='flex flex-col gap-2 text-xs'>
				<span className='text-xs capitalize'>Current Rank :</span>
				<div className='flex h-12 w-full items-center justify-start gap-2 rounded-xl border-1 border-primary_border p-3 font-normal'>
					<Image
						alt='Rank Icon'
						src={RANK_CONSTANTS[Number(currentRank)].icon}
						width={24}
						height={24}
					/>
					{RANK_CONSTANTS[Number(currentRank)].displayName}&nbsp;({currentRank})
				</div>
			</div>

			{rankRequestType === RankRequestType.PROMOTE && (
				<div className='flex flex-col gap-2 text-xs'>
					<span className='text-xs capitalize'>Promoted Rank :</span>
					<div className='flex h-12 w-full items-center justify-start gap-2 rounded-xl border-1 border-primary_border p-3 font-normal'>
						<Image
							alt='Rank Icon'
							src={RANK_CONSTANTS[Number(currentRank) + 1].icon}
							width={24}
							height={24}
						/>
						{RANK_CONSTANTS[Number(currentRank) + 1].displayName}&nbsp;({currentRank + 1})
					</div>

					<AlertCard
						className='w-full'
						type='info'
						message={`Only rank ${RANK_CONSTANTS[Number(currentRank) + 3]?.displayName || RANK_CONSTANTS[9].displayName} (${
							RANK_CONSTANTS[Number(currentRank) + 3]?.rank || RANK_CONSTANTS[9].rank
						}) and above are eligible to vote on this proposal`}
					/>
				</div>
			)}

			<div>
				<Input
					label={
						<span className='text-xs'>
							Title<span className='text-rose-500'>*</span>
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
				<div className='mb-1 text-xs font-normal'>
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

			<div>
				<Input
					label={<span className='text-xs'>On-chain Evidence:</span>}
					placeholder='Enter a link or type here...'
					labelPlacement='outside'
					variant='bordered'
					radius='sm'
					classNames={{
						label: 'text-sm font-normal -mb-1',
						inputWrapper: 'border-primary_border border-1'
					}}
					{...register('evidence')}
					aria-invalid={errors.evidence ? 'true' : 'false'}
					disabled={loading}
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
					{selectedAddress?.address && !fellows?.find((fellow) => fellow.address === (getSubstrateAddress(selectedAddress?.address || '') || '')) && (
						<AlertCard
							className='w-full'
							type='warning'
							message='This address is not a fellow. Please select a fellow address.'
						/>
					)}

					<AddressDropdown
						disabled={loading}
						wallet={selectedWallet}
						onAddressSelect={setSelectedAddress}
						label='Select a fellow address :'
					/>
				</div>
			)}
		</form>
	);
}

export default CreateRankRequestForm;

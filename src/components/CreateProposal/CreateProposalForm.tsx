// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Select, SelectItem } from '@nextui-org/select';
import { Input, Textarea } from '@nextui-org/input';
import { useApiContext, useUserDetailsContext } from '@/contexts';
import { Wallet } from '@/global/types';
import { InjectedAccount } from '@polkadot/extension-inject/types';
import { useSearchParams } from 'next/navigation';
import queueNotification from '@/utils/queueNotification';
import LoadingSpinner from '@/components/Misc/LoadingSpinner';
import AlertCard from '@/components/Misc/AlertCard';
import AddressSwitch from '@/components/Misc/AddressSwitch';
import EvidenceSelector from '@/components/Misc/EvidenceSelector';
import getSubstrateAddress from '@/utils/getSubstrateAddress';
import MarkdownEditor from '@/components/TextEditor/MarkdownEditor';

interface Props {
	readonly formRef: React.RefObject<HTMLFormElement>;
	readonly onSuccess?: () => void;
	readonly onFormStateChange?: (isValid: boolean, isLoading: boolean) => void;
}

export enum ProposalType {
	PROMOTION = 'Promotion',
	RETENTION = 'Retention'
}

interface FormData {
	title: string;
	proposalType: ProposalType;
	motivation: string;
	interest: string;
	evidenceId: string;
}

function CreateProposalForm({ formRef, onSuccess, onFormStateChange }: Props) {
	const { api, apiReady, fellows } = useApiContext();
	const { id, addresses } = useUserDetailsContext();
	const searchParams = useSearchParams();

	const {
		formState: { errors },
		control,
		handleSubmit
	} = useForm<FormData>({
		defaultValues: {
			title: '',
			proposalType: ProposalType.PROMOTION,
			motivation: '',
			interest: '',
			evidenceId: searchParams?.get('evidenceId') || ''
		}
	});

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
	const [selectedAddress, setSelectedAddress] = useState<InjectedAccount | null>(null);
	const [txStatus, setTxStatus] = useState('');

	// Form validation state
	const isFormValid = Boolean(selectedWallet && selectedAddress && api && apiReady && !loading);

	// Notify parent component of form state changes
	React.useEffect(() => {
		onFormStateChange?.(isFormValid, loading);
	}, [isFormValid, loading, onFormStateChange]);

	const currentFellow = fellows?.find((fellow) => fellow.address === getSubstrateAddress(addresses?.[0] || ''));

	// Validation function to check if form can be submitted
	const validateFormData = (data: FormData): string | null => {
		if (!data.title || data.title.trim().length === 0) {
			return 'Title is required.';
		}

		if (data.title.trim().length < 5) {
			return 'Title must be at least 5 characters long.';
		}

		if (data.title.trim().length > 200) {
			return 'Title must be less than 200 characters.';
		}

		if (!data.proposalType || !Object.values(ProposalType).includes(data.proposalType)) {
			return 'Please select a valid proposal type.';
		}

		if (!data.motivation || data.motivation.trim().length === 0) {
			return 'Motivation is required.';
		}

		if (data.motivation.trim().length < 20) {
			return 'Motivation must be at least 20 characters long.';
		}

		if (data.motivation.trim().length > 5000) {
			return 'Motivation must be less than 5,000 characters.';
		}

		if (!data.interest || data.interest.trim().length === 0) {
			return 'Interest is required.';
		}

		if (data.interest.trim().length < 10) {
			return 'Interest must be at least 10 characters long.';
		}

		if (data.interest.trim().length > 2000) {
			return 'Interest must be less than 2,000 characters.';
		}

		if (!data.evidenceId || data.evidenceId.trim().length === 0) {
			return 'Evidence is required.';
		}

		return null;
	};

	const submitForm = async (data: FormData) => {
		// Early return if basic conditions are not met
		if (!id) {
			setError('Please login to create a proposal.');
			return;
		}

		if (loading) {
			setError('Transaction is already in progress.');
			return;
		}

		if (!api || !apiReady) {
			setError('API is not ready. Please try again.');
			return;
		}

		if (!selectedWallet) {
			setError('Please select a wallet.');
			return;
		}

		if (!selectedAddress) {
			setError('Please select an address.');
			return;
		}

		// Validate selected address
		if (!selectedAddress.address) {
			setError('Selected address is invalid.');
			return;
		}

		const fellowAddress = getSubstrateAddress(selectedAddress.address);
		if (!fellowAddress) {
			setError('Invalid address format. Please select a valid address.');
			return;
		}

		// Validate fellow status
		if (!fellows || fellows.length === 0) {
			setError('Fellows data is not available. Please try again.');
			return;
		}

		const fellow = fellows.find((f) => f.address === fellowAddress);
		if (!fellow) {
			setError('Selected address is not a fellow. Only fellows can create proposals.');
			return;
		}

		// Validate form data using validation function
		const formValidationError = validateFormData(data);
		if (formValidationError) {
			setError(formValidationError);
			return;
		}

		// Clear any previous errors
		setError('');

		setLoading(true);

		try {
			// TODO: Implement actual proposal creation logic
			// This would typically involve:
			// 1. Creating a preimage
			// 2. Submitting the proposal
			// 3. Handling the transaction

			// For now, simulate a successful transaction
			await new Promise((resolve) => setTimeout(resolve, 2000));

			queueNotification({
				header: 'Proposal Created Successfully!',
				message: `Your ${data.proposalType.toLowerCase()} proposal has been created.`,
				status: 'success'
			});

			setLoading(false);
			onSuccess?.();
		} catch (err) {
			console.error('Error creating proposal:', err);
			const errorMessage = err instanceof Error ? err.message : 'Failed to create proposal. Please try again.';
			setError(`Transaction failed: ${errorMessage}`);
			setLoading(false);
			setTxStatus('');
		}
	};

	return (
		<form
			ref={formRef}
			onSubmit={(e) => {
				e.preventDefault();
				if (!isFormValid) {
					setError('Please ensure all required fields are filled and a valid wallet/address is selected.');
					return;
				}
				handleSubmit(submitForm)(e);
			}}
			className='flex flex-col gap-4'
		>
			<AddressSwitch
				selectedWallet={selectedWallet}
				selectedAddress={selectedAddress}
				onWalletChange={setSelectedWallet}
				onAddressChange={setSelectedAddress}
				disabled={loading}
			/>

			{currentFellow && (
				<div className='rounded-lg bg-gray-50 p-3 dark:bg-gray-800'>
					<div className='text-sm text-gray-600 dark:text-gray-400'>
						Current Rank: <span className='font-semibold'>{currentFellow.rank}</span>
					</div>
				</div>
			)}

			<div>
				<div className='mb-1 text-xs font-normal'>
					Title<span className='text-base text-rose-500'>*</span>
				</div>
				<Controller
					name='title'
					control={control}
					rules={{
						required: 'Title is required',
						minLength: { value: 5, message: 'Title must be at least 5 characters' },
						maxLength: { value: 200, message: 'Title must be less than 200 characters' }
					}}
					render={({ field }) => (
						<Input
							{...field}
							placeholder='Enter proposal title'
							variant='bordered'
							radius='sm'
							classNames={{
								input: 'text-sm',
								inputWrapper: 'border-primary_border border-1'
							}}
							disabled={loading}
						/>
					)}
				/>
				{errors.title?.message && (
					<small
						className='text-warning'
						role='alert'
					>
						{errors.title.message}
					</small>
				)}
			</div>

			<div>
				<div className='mb-1 text-xs font-normal'>
					Proposal Type<span className='text-base text-rose-500'>*</span>
				</div>
				<Controller
					name='proposalType'
					control={control}
					rules={{ required: 'Please select a proposal type' }}
					render={({ field }) => (
						<Select
							{...field}
							placeholder='Select proposal type'
							className='w-full'
							variant='bordered'
							radius='sm'
							classNames={{
								trigger: 'border-primary_border border-1'
							}}
							disabled={loading}
						>
							<SelectItem
								key={ProposalType.PROMOTION}
								value={ProposalType.PROMOTION}
							>
								Promotion - Request rank advancement
							</SelectItem>
							<SelectItem
								key={ProposalType.RETENTION}
								value={ProposalType.RETENTION}
							>
								Retention - Keep current rank
							</SelectItem>
						</Select>
					)}
				/>
				{errors.proposalType?.message && (
					<small
						className='text-warning'
						role='alert'
					>
						{errors.proposalType.message}
					</small>
				)}
			</div>

			<div>
				<div className='mb-1 text-xs font-normal'>
					Motivation<span className='text-base text-rose-500'>*</span>
				</div>
				<Controller
					name='motivation'
					control={control}
					rules={{
						required: 'Motivation is required',
						minLength: { value: 20, message: 'Motivation must be at least 20 characters' },
						maxLength: { value: 5000, message: 'Motivation must be less than 5,000 characters' }
					}}
					render={({ field }) => (
						<Textarea
							{...field}
							placeholder='Explain your motivation for this proposal...'
							variant='bordered'
							radius='sm'
							minRows={2}
							maxRows={4}
							classNames={{
								input: 'text-sm',
								inputWrapper: 'border-primary_border border-1'
							}}
							disabled={loading}
						/>
					)}
				/>
				{errors.motivation?.message && (
					<small
						className='text-warning'
						role='alert'
					>
						{errors.motivation.message}
					</small>
				)}
			</div>

			<div>
				<div className='mb-1 text-xs font-normal'>
					Interest<span className='text-base text-rose-500'>*</span>
				</div>
				<Controller
					name='interest'
					control={control}
					rules={{
						required: 'Interest is required',
						minLength: { value: 10, message: 'Interest must be at least 10 characters' },
						maxLength: { value: 2000, message: 'Interest must be less than 2,000 characters' }
					}}
					render={({ field }) => (
						<Textarea
							{...field}
							placeholder='Describe your interest in this proposal...'
							variant='bordered'
							radius='sm'
							minRows={2}
							maxRows={4}
							classNames={{
								input: 'text-sm',
								inputWrapper: 'border-primary_border border-1'
							}}
							disabled={loading}
						/>
					)}
				/>
				{errors.interest?.message && (
					<small
						className='text-warning'
						role='alert'
					>
						{errors.interest.message}
					</small>
				)}
			</div>

			<Controller
				name='evidenceId'
				control={control}
				rules={{ required: 'Evidence is required' }}
				render={({ field }) => (
					<EvidenceSelector
						selectedEvidenceId={field.value}
						onEvidenceSelect={field.onChange}
						disabled={loading}
					/>
				)}
			/>
			{errors.evidenceId?.message && (
				<small
					className='text-warning'
					role='alert'
				>
					{errors.evidenceId.message}
				</small>
			)}

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
		</form>
	);
}

export default CreateProposalForm;

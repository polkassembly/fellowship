// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Select, SelectItem } from '@nextui-org/select';
import { useApiContext, useUserDetailsContext } from '@/contexts';
import { Wallet } from '@/global/types';
import { InjectedAccount } from '@polkadot/extension-inject/types';
import queueNotification from '@/utils/queueNotification';
import LoadingSpinner from '@/components/Misc/LoadingSpinner';
import AlertCard from '@/components/Misc/AlertCard';
import AddressSwitch from '@/components/Misc/AddressSwitch';
import getSubstrateAddress from '@/utils/getSubstrateAddress';
import executeTx from '@/utils/executeTx';
import MarkdownEditor from '@/components/TextEditor/MarkdownEditor';
import { useRouter } from 'next/navigation';
import { Button } from '@nextui-org/button';

interface Props {
	readonly formRef: React.RefObject<HTMLFormElement>;
	readonly onSuccess?: () => void;
	readonly onFormStateChange?: (isValid: boolean, isLoading: boolean) => void;
}

export enum FellowshipWish {
	RETENTION = 'Retention',
	PROMOTION = 'Promotion'
}

interface FormData {
	wish: FellowshipWish;
	evidence: string;
}

function SubmitEvidenceForm({ formRef, onSuccess, onFormStateChange }: Props) {
	const { api, apiReady, network, fellows } = useApiContext();
	const { id, addresses } = useUserDetailsContext();
	const router = useRouter();

	const {
		formState: { errors },
		control,
		handleSubmit
	} = useForm<FormData>({
		defaultValues: {
			wish: FellowshipWish.RETENTION,
			evidence: ''
		}
	});

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
	const [selectedAddress, setSelectedAddress] = useState<InjectedAccount | null>(null);
	const [txStatus, setTxStatus] = useState('');
	const [isSuccess, setIsSuccess] = useState(false);
	const [submittedEvidenceId, setSubmittedEvidenceId] = useState<string | null>(null);

	// Form validation state
	const isFormValid = Boolean(selectedWallet && selectedAddress && api && apiReady && !loading);

	// Notify parent component of form state changes
	React.useEffect(() => {
		onFormStateChange?.(isFormValid, loading);
	}, [isFormValid, loading, onFormStateChange]);

	const currentFellow = fellows?.find((fellow) => fellow.address === getSubstrateAddress(addresses?.[0] || ''));

	// Validation function to check if form can be submitted
	const validateFormData = (wish: FellowshipWish, evidence: string): string | null => {
		if (!wish || !Object.values(FellowshipWish).includes(wish)) {
			return 'Please select a valid wish type.';
		}

		if (!evidence || typeof evidence !== 'string') {
			return 'Evidence is required.';
		}

		const trimmedEvidence = evidence.trim();
		if (trimmedEvidence.length === 0) {
			return 'Evidence cannot be empty.';
		}

		if (trimmedEvidence.length < 10) {
			return 'Evidence must be at least 10 characters long.';
		}

		if (trimmedEvidence.length > 10000) {
			return 'Evidence is too long. Please keep it under 10,000 characters.';
		}

		return null;
	};

	const submitForm = async ({ wish, evidence }: FormData) => {
		// Early return if basic conditions are not met
		if (!id) {
			setError('Please login to submit evidence.');
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
			setError('Selected address is not a fellow. Only fellows can submit evidence.');
			return;
		}

		// Validate form data using validation function
		const formValidationError = validateFormData(wish, evidence);
		if (formValidationError) {
			setError(formValidationError);
			return;
		}

		const trimmedEvidence = evidence.trim();

		// Clear any previous errors
		setError('');

		setLoading(true);

		try {
			// Convert wish to the expected format for the extrinsic
			const wishValue = wish === FellowshipWish.PROMOTION ? 'Promotion' : 'Retention';

			// Convert evidence to bytes (using trimmed evidence)
			const evidenceBytes = new TextEncoder().encode(trimmedEvidence);

			// Create the submitEvidence transaction
			const tx = api.tx.coreFellowship.submitEvidence(wishValue, evidenceBytes);

			const onFailed = (message: string) => {
				setLoading(false);
				queueNotification({
					header: 'Submit Evidence Transaction Failed!',
					message,
					status: 'error'
				});
				setTxStatus('');
			};

			const onSuccessCallback = async () => {
				setLoading(false);
				// Generate a mock evidence ID - in real implementation, this would come from the transaction
				const evidenceId = `evidence_${Date.now()}`;
				setSubmittedEvidenceId(evidenceId);
				setIsSuccess(true);

				queueNotification({
					header: 'Evidence Submitted Successfully!',
					message: `Your ${wish.toLowerCase()} evidence has been submitted for ${fellow.rank} rank.`,
					status: 'success'
				});
				setTxStatus('');
			};

			await executeTx({
				address: selectedAddress.address,
				api,
				apiReady,
				errorMessageFallback: 'Error while executing transaction. Please try again.',
				network,
				onFailed,
				onSuccess: onSuccessCallback,
				setStatus: (status: string) => setTxStatus(status),
				tx
			});
		} catch (err) {
			console.error('Error submitting evidence:', err);
			const errorMessage = err instanceof Error ? err.message : 'Failed to submit evidence. Please try again.';
			setError(`Transaction failed: ${errorMessage}`);
			setLoading(false);
			setTxStatus('');
		}
	};

	// Show success state
	if (isSuccess) {
		return (
			<div className='flex flex-col gap-4 text-center'>
				<div className='rounded-lg bg-green-50 p-6 dark:bg-green-900/20'>
					<div className='mb-4 text-green-800 dark:text-green-200'>
						<svg
							className='mx-auto mb-4 h-12 w-12'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
							/>
						</svg>
						<h3 className='mb-2 text-lg font-semibold'>Evidence Submitted Successfully!</h3>
						<p className='text-sm'>Your evidence has been submitted and is now available for use in proposals.</p>
					</div>

					<div className='flex flex-col gap-3'>
						<Button
							color='primary'
							onPress={() => {
								// Navigate to create proposal with the evidence pre-selected
								const params = new URLSearchParams();
								if (submittedEvidenceId) {
									params.set('evidenceId', submittedEvidenceId);
								}
								router.push(`/create-proposal?${params.toString()}`);
							}}
							className='bg-primary_accent'
						>
							Create Rank Proposal with This Evidence
						</Button>

						<Button
							variant='light'
							onPress={() => {
								setIsSuccess(false);
								setSubmittedEvidenceId(null);
							}}
							className='text-text_secondary'
						>
							Submit Another Evidence
						</Button>
					</div>
				</div>
			</div>
		);
	}

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
					Wish Type<span className='text-base text-rose-500'>*</span>
				</div>
				<Controller
					name='wish'
					control={control}
					rules={{ required: 'Please select a wish type' }}
					render={({ field }) => (
						<Select
							{...field}
							placeholder='Select your wish'
							className='w-full'
							variant='bordered'
							radius='sm'
							classNames={{
								trigger: 'border-primary_border border-1'
							}}
							disabled={loading}
						>
							<SelectItem
								key={FellowshipWish.RETENTION}
								value={FellowshipWish.RETENTION}
							>
								Retention - Keep current rank
							</SelectItem>
							<SelectItem
								key={FellowshipWish.PROMOTION}
								value={FellowshipWish.PROMOTION}
							>
								Promotion - Request rank advancement
							</SelectItem>
						</Select>
					)}
				/>
				{errors.wish?.message && (
					<small
						className='text-warning'
						role='alert'
					>
						{errors.wish.message}
					</small>
				)}
			</div>

			<div>
				<div className='mb-1 text-xs font-normal'>
					Evidence<span className='text-base text-rose-500'>*</span>
				</div>
				<Controller
					name='evidence'
					control={control}
					rules={{
						required: 'Evidence is required',
						minLength: { value: 10, message: 'Evidence must be at least 10 characters' },
						maxLength: { value: 10000, message: 'Evidence must be less than 10,000 characters' }
					}}
					render={({ field }) => (
						<MarkdownEditor
							{...field}
							disabled={loading}
							ref={undefined}
						/>
					)}
				/>
				{errors.evidence?.message && (
					<small
						className='text-warning'
						role='alert'
					>
						{errors.evidence.message}
					</small>
				)}
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
		</form>
	);
}

export default SubmitEvidenceForm;

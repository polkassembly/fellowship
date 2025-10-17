// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import React, { useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
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

interface FormData {
	file: File | null;
	evidence: string;
}

function SubmitEvidenceForm({ formRef, onSuccess, onFormStateChange }: Props) {
	const { api, apiReady, network, fellows } = useApiContext();
	const { id, addresses } = useUserDetailsContext();
	const router = useRouter();

	const {
		formState: { errors },
		control,
		handleSubmit,
		setValue,
		watch
	} = useForm<FormData>({
		defaultValues: {
			file: null,
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
	const fileInputRef = useRef<HTMLInputElement>(null);

	const selectedFile = watch('file');

	// Form validation state
	const isFormValid = Boolean(selectedWallet && selectedAddress && api && apiReady && !loading);

	// Notify parent component of form state changes
	React.useEffect(() => {
		onFormStateChange?.(isFormValid, loading);
	}, [isFormValid, loading, onFormStateChange]);

	// File handling functions
	const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setValue('file', file);
			setError(''); // Clear any previous errors
		}
	};

	const handleRemoveFile = () => {
		setValue('file', null);
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	// Validation function to check if form can be submitted
	const validateFormData = (file: File | null, evidence: string): string | null => {
		if (!file) {
			return 'Please select a file to upload.';
		}

		// Check file size (e.g., max 10MB)
		const maxSize = 10 * 1024 * 1024; // 10MB
		if (file.size > maxSize) {
			return 'File size must be less than 10MB.';
		}

		// Check file type (allow common document types)
		const allowedTypes = [
			'application/pdf',
			'application/msword',
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
			'text/plain',
			'image/jpeg',
			'image/png',
			'image/gif'
		];
		if (!allowedTypes.includes(file.type)) {
			return 'Please select a valid file type (PDF, DOC, DOCX, TXT, JPG, PNG, GIF).';
		}

		if (!evidence || typeof evidence !== 'string') {
			return 'Evidence description is required.';
		}

		const trimmedEvidence = evidence.trim();
		if (trimmedEvidence.length === 0) {
			return 'Evidence description cannot be empty.';
		}

		if (trimmedEvidence.length < 10) {
			return 'Evidence description must be at least 10 characters long.';
		}

		if (trimmedEvidence.length > 10000) {
			return 'Evidence description is too long. Please keep it under 10,000 characters.';
		}

		return null;
	};

	const submitForm = async ({ file, evidence }: FormData) => {
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
		const formValidationError = validateFormData(file, evidence);
		if (formValidationError) {
			setError(formValidationError);
			return;
		}

		const trimmedEvidence = evidence.trim();

		// Clear any previous errors
		setError('');

		setLoading(true);

		try {
			// For now, we'll use a default wish value since the transaction expects it
			// In a real implementation, you might want to derive this from the file or make it configurable
			const wishValue = 'Promotion'; // Default to promotion for file-based evidence

			// Convert evidence description to bytes (using trimmed evidence)
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
					message: `Your evidence with file "${file?.name}" has been submitted for ${fellow.rank} rank.`,
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

			<div>
				<div className='mb-1 text-xs font-normal'>
					Evidence File<span className='text-base text-rose-500'>*</span>
				</div>
				<div className='flex flex-col gap-3'>
					<input
						ref={fileInputRef}
						type='file'
						accept='.pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif'
						onChange={handleFileSelect}
						className='hidden'
						disabled={loading}
						aria-label='Select evidence file'
					/>
					<Button
						type='button'
						variant='bordered'
						className='w-full border-1 border-primary_border'
						onPress={() => fileInputRef.current?.click()}
						disabled={loading}
					>
						{selectedFile ? selectedFile.name : 'Select File'}
					</Button>
					{selectedFile && (
						<div className='flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800'>
							<div className='flex flex-col'>
								<span className='text-sm font-medium'>{selectedFile.name}</span>
								<span className='text-xs text-gray-500'>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
							</div>
							<Button
								type='button'
								size='sm'
								variant='light'
								color='danger'
								onPress={handleRemoveFile}
								disabled={loading}
							>
								Remove
							</Button>
						</div>
					)}
				</div>
				{errors.file?.message && (
					<small
						className='text-warning'
						role='alert'
					>
						{errors.file.message}
					</small>
				)}
			</div>

			<div>
				<div className='mb-1 text-xs font-normal'>
					Evidence Description<span className='text-base text-rose-500'>*</span>
				</div>
				<Controller
					name='evidence'
					control={control}
					rules={{
						required: 'Evidence description is required',
						minLength: { value: 10, message: 'Evidence description must be at least 10 characters' },
						maxLength: { value: 10000, message: 'Evidence description must be less than 10,000 characters' }
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

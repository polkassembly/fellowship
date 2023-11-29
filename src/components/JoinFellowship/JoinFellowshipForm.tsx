// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import React, { RefObject, useState } from 'react';
import Image from 'next/image';
import { Divider } from '@nextui-org/divider';
import { Input } from '@nextui-org/input';
import { Controller, useForm } from 'react-hook-form';
import { useApiContext, useUserDetailsContext } from '@/contexts';
import DEFAULT_POST_TITLE from '@/global/constants/defaultTitle';
import nextApiClientFetch from '@/utils/nextApiClientFetch';
import { ChangeResponseType, CreatePostResponseType, EGovType, ProposalType, Wallet } from '@/global/types';
import queueNotification from '@/utils/queueNotification';
import { useRouter } from 'next/navigation';
import { InjectedAccount } from '@polkadot/extension-inject/types';
import AlertCard from '../Misc/AlertCard';
import MarkdownEditor from '../TextEditor/MarkdownEditor';
import PreviewApplicationRequest from './PreviewApplicationRequest';
import AddressDropdown from '../Auth/AddressDropdown';
import WalletButtonsRow from '../Auth/WalletButtonsRow';

interface Props {
	className?: string;
	formRef?: RefObject<HTMLFormElement>;
	isPreview?: boolean;
	onSuccess?: () => void;
}

function JoinFellowshipForm({ className = '', formRef, isPreview, onSuccess }: Props) {
	const router = useRouter();
	const { id, email_verified: userEmailVerified, loginWallet } = useUserDetailsContext();
	const { network } = useApiContext();

	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(loginWallet);
	const [selectedAddress, setSelectedAddress] = useState<InjectedAccount | null>(null);

	const {
		register,
		formState: { errors },
		control,
		handleSubmit,
		getValues
	} = useForm({
		defaultValues: {
			title: '',
			description: ''
		}
	});

	const onWalletClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, wallet: Wallet) => {
		setSelectedWallet(wallet);
	};

	const createSubscription = async (postId: number) => {
		if (userEmailVerified) return;

		const { data, error: createSubError } = await nextApiClientFetch<ChangeResponseType>({
			network,
			url: 'api/v1/auth/actions/postSubscribe',
			data: { post_id: postId, proposalType: ProposalType.DISCUSSIONS }
		});

		// eslint-disable-next-line no-console
		if (createSubError) console.error('Error subscribing to post', error);
		// eslint-disable-next-line no-console
		if (data?.message) console.log(data.message);
	};

	const submitForm = async ({ title, description }: { title: string; description: string }) => {
		if (loading) return;

		setError('');

		if (!id) {
			setError('You must be logged in to submit a proposal');
			return;
		}

		if (!selectedAddress) {
			setError('Please select a fellow address.');
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
		setLoading(true);

		const { data, error: apiError } = await nextApiClientFetch<CreatePostResponseType>({
			network,
			url: 'api/v1/auth/actions/createPost',
			isPolkassemblyAPI: true,
			data: {
				content: description,
				gov_type: EGovType.OPEN_GOV,
				proposalType: ProposalType.DISCUSSIONS,
				title,
				topicId: 10,
				userId: id,
				inductee_address: selectedAddress.address
			}
		});

		if (apiError || !data?.post_id) {
			setError(apiError || 'There was an error creating your post.');
			queueNotification({
				header: 'Error',
				message: 'There was an error creating your post.',
				status: 'error'
			});
		}

		if (data && data.post_id) {
			const postId = data.post_id;

			queueNotification({
				header: 'Thanks for sharing!',
				message: 'Post created successfully.',
				status: 'success'
			});

			createSubscription(postId);
			router.replace(`/join-fellowship/success?postId=${postId}`);
			onSuccess?.();
		}

		setLoading(false);
	};

	const { title, description } = getValues();

	return (
		<div className='p-6'>
			{isPreview && (
				<PreviewApplicationRequest
					address={selectedAddress?.address}
					loading={loading}
					title={title || DEFAULT_POST_TITLE}
					description={description || 'No description'}
					errorString={error}
				/>
			)}

			<div className={`${className} ${isPreview && 'max-h-0 overflow-hidden'} flex flex-col items-center justify-center gap-4`}>
				<Image
					className='fill-red-700'
					alt='Join Fellowship Icon'
					src='/misc/join-fellowship.svg'
					width={356}
					height={198}
				/>

				<section className='flex w-full flex-col gap-3'>
					<h3 className='text-base font-medium'>Application Request for Fellowship</h3>
					<p className='text-sm'>As a member of fellowship community you are expected to faithfully uphold the below tenets:</p>

					<ul className='ml-6 flex list-disc flex-col gap-3 text-sm font-normal italic'>
						<li>Sincerely uphold the interests of Polkadot and avoid actions which clearly work against it.</li>
						<li>Respect the philosophy and principles of Polkadot.</li>
						<li>Respect the operational procedures, norms and voting conventions of the Fellowship.</li>
						<li>Respect your fellow Members and the wider community.</li>
						{/* TODO: add learn more */}
					</ul>

					<div className='my-6 flex flex-col gap-6'>
						<Divider />

						{/* TODO: change copy */}
						<AlertCard
							type='info'
							message='Note: A fellow with at least rank x must apply for fellowship on behalf of another user.'
						/>

						{error && (
							<AlertCard
								type='error'
								message={error}
							/>
						)}

						<form
							ref={formRef}
							onSubmit={handleSubmit(submitForm)}
							className='flex flex-col gap-3'
						>
							<div className='flex w-full flex-col items-start'>
								<div className='flex flex-col items-start justify-start gap-2 text-center text-sm'>
									<h3>Please select a wallet : </h3>
									<WalletButtonsRow
										disabled={loading}
										onWalletClick={onWalletClick}
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
					</div>
				</section>
			</div>
		</div>
	);
}

export default JoinFellowshipForm;

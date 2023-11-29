// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import AlertCard from '@/components/Misc/AlertCard';
import MarkdownEditor from '@/components/TextEditor/MarkdownEditor';
import { useApiContext, usePostDataContext, useUserDetailsContext } from '@/contexts';
import { IEditPostResponse } from '@/global/types';
import nextApiClientFetch from '@/utils/nextApiClientFetch';
import queueNotification from '@/utils/queueNotification';
import { Button } from '@nextui-org/button';
import { Card } from '@nextui-org/card';
import { Input } from '@nextui-org/input';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

function EditPostCard() {
	const { id } = useUserDetailsContext();
	const { network } = useApiContext();

	const {
		postData: { id: postId, content, title, proposalType },
		setPostData
	} = usePostDataContext();

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const {
		register,
		formState: { errors },
		control,
		handleSubmit
	} = useForm({
		defaultValues: {
			title,
			description: content
		}
	});

	const submitForm = async ({ title: titleInput, description }: { title: string; description: string }) => {
		if (loading) return;

		setError('');

		if (!id) {
			setError('You must be logged in to submit a proposal');
			return;
		}

		if (!titleInput) {
			setError('Title is required');
			return;
		}

		if (!description) {
			setError('Description is required');
			return;
		}

		setLoading(true);

		const { data, error: editError } = await nextApiClientFetch<IEditPostResponse>({
			network,
			url: 'api/v1/auth/actions/editPost',
			isPolkassemblyAPI: true,
			data: {
				content: description,
				postId: Number(postId),
				proposalType,
				title: titleInput
			}
		});

		if (editError || !data) {
			// eslint-disable-next-line no-console
			console.error('Error saving post', editError);
			queueNotification({
				header: 'Error!',
				message: 'Error in saving your post.',
				status: 'error'
			});

			setError(editError || 'Error in saving post');
			setLoading(false);
			return;
		}

		queueNotification({
			header: 'Success!',
			message: 'Your post was edited',
			status: 'success'
		});

		setPostData((prev) => ({
			...prev,
			content: description,
			title: titleInput
		}));

		setLoading(false);
	};

	return (
		<Card
			shadow='none'
			className='flex flex-col gap-3 border border-primary_border p-6'
		>
			{error && (
				<AlertCard
					type='error'
					message={error}
				/>
			)}

			<form
				className='flex flex-col gap-3'
				onSubmit={handleSubmit(submitForm)}
			>
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
						{...register('title', { required: 'The title is required.' })}
						aria-invalid={errors.title ? 'true' : 'false'}
						// disabled={loading}
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
								// disabled={loading}
							/>
						)}
						rules={{ required: 'The content is required.' }}
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

				<Button
					color='primary'
					variant='flat'
					type='submit'
				>
					Save
				</Button>
			</form>
		</Card>
	);
}

export default EditPostCard;

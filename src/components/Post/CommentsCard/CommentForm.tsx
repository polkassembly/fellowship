// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import AlertCard from '@/components/Misc/AlertCard';
import LinkWithNetwork from '@/components/Misc/LinkWithNetwork';
import MarkdownEditor from '@/components/TextEditor/MarkdownEditor';
import { useApiContext, useCommentsContext, usePostDataContext, useUserDetailsContext } from '@/contexts';
import { IAddPostCommentResponse, PostCommentResponse } from '@/global/types';
import nextApiClientFetch from '@/utils/nextApiClientFetch';
import queueNotification from '@/utils/queueNotification';
import { Button } from '@nextui-org/button';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

function CommentForm() {
	const { network } = useApiContext();
	const { id, picture, username } = useUserDetailsContext();
	const {
		postData: { id: postId, proposalType, on_chain_info: onChainInfo }
	} = usePostDataContext();

	const { setPostComments } = useCommentsContext();

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const {
		formState: { errors },
		control,
		handleSubmit,
		resetField
	} = useForm({
		defaultValues: {
			comment: ''
		}
	});

	const submitForm = async ({ comment }: { comment: string }) => {
		if (!id || !username) return;

		if (!comment) {
			setError('Please enter the comment.');
			return;
		}

		setError('');
		setLoading(true);

		const newPostcomment: PostCommentResponse = {
			user_id: id,
			content: comment,
			created_at: new Date(),
			history: [],
			id: 'new_comment_id',
			isDeleted: false,
			updated_at: new Date(),
			sentiment: 0,
			username,
			user_profile_img: picture || '',
			replies: [],
			reactions: []
		};

		setPostComments((prevComments) => {
			return [newPostcomment, ...prevComments];
		});

		const { data: apiData, error: apiError } = await nextApiClientFetch<IAddPostCommentResponse>({
			url: 'api/v1/auth/actions/addPostComment',
			isPolkassemblyAPI: true,
			network,
			data: {
				userId: id,
				content: comment,
				postId,
				postType: proposalType,
				sentiment: 0,
				trackNumber: onChainInfo?.track_number || null
			}
		});

		if (apiError || !apiData?.id) {
			setError(apiError || 'Something went wrong saving your comment. Please try again.');
			setPostComments((prevComments) => {
				return prevComments.filter((commentObj) => commentObj.id !== 'new_comment_id');
			});
		}

		if (apiData?.id) {
			setPostComments((prevComments) => {
				return prevComments.map((commentObj) => {
					if (commentObj.id === 'new_comment_id') {
						return {
							...commentObj,
							id: apiData.id
						};
					}

					return commentObj;
				});
			});

			queueNotification({
				header: 'Comment added',
				message: 'Your comment has been added successfully.',
				status: 'success'
			});

			resetField('comment');
		}

		setLoading(false);
	};

	if (!id) {
		return (
			<AlertCard
				className='justify-center'
				message={
					<div>
						Please&nbsp;
						<LinkWithNetwork
							href='/login'
							className='text-link'
						>
							Login
						</LinkWithNetwork>
						&nbsp;to comment
					</div>
				}
			/>
		);
	}

	return (
		<form
			onSubmit={handleSubmit(submitForm)}
			className='flex flex-col gap-3'
		>
			{error && (
				<AlertCard
					message={error}
					type='error'
				/>
			)}

			<div className='flex flex-col gap-1'>
				<Controller
					name='comment'
					control={control}
					rules={{ required: 'Please enter the comment.' }}
					render={({ field }) => (
						<MarkdownEditor
							{...field}
							height={150}
							disabled={loading}
						/>
					)}
				/>
				{errors.comment?.message && (
					<small
						className='text-warning'
						role='alert'
					>
						{errors.comment.message.toString()}
					</small>
				)}
			</div>

			<Button
				color='primary'
				variant='solid'
				size='sm'
				className='max-w-min self-end text-xs'
				type='submit'
				isLoading={loading}
			>
				Comment
			</Button>
		</form>
	);
}

export default CommentForm;

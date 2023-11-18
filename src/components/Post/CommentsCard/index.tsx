// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { Card } from '@nextui-org/card';
import React, { useEffect, useState, memo } from 'react';
import { PostCommentResponse, ProposalType } from '@/global/types';
import nextApiClientFetch from '@/utils/nextApiClientFetch';
import AlertCard from '@/components/Misc/AlertCard';
import LoadingSpinner from '@/components/Misc/LoadingSpinner';
import { useCommentsContext } from '@/contexts';
import CommentForm from './CommentForm';
import CommentListing from './CommentListing';

type Props = {
	postId: number;
	proposalType: ProposalType;
};

function CommentsCard({ postId, proposalType }: Props) {
	const { postComments, setPostComments } = useCommentsContext();

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		(async () => {
			const { data, error: fetchingError } = await nextApiClientFetch<PostCommentResponse[]>({
				url: `/api/v1/${proposalType}/${postId}/comments`,
				isPolkassemblyAPI: false
			});

			if (!data || fetchingError) {
				setError(fetchingError || 'Error fetching comments. Please refresh and try again.');
				setLoading(false);
				return;
			}

			setPostComments(data);
			setLoading(false);
		})();
	}, [postId, proposalType, setPostComments]);

	return (
		<Card
			shadow='none'
			className='flex flex-col gap-6 border border-primary_border p-6'
		>
			<h2 className='text-base font-semibold'>
				Comments <span className='text-xs font-normal'>({postComments.length})</span>
			</h2>

			<CommentForm />

			{loading ? (
				<div className='my-4 flex justify-center'>
					<LoadingSpinner message='Fetching comments...' />
				</div>
			) : error ? (
				<AlertCard
					message={error}
					type='warning'
				/>
			) : (
				<CommentListing />
			)}
		</Card>
	);
}

export default memo(CommentsCard);

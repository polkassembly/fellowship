// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Card } from '@nextui-org/card';
import React from 'react';
import getComments from '@/app/api/v1/[proposalType]/[id]/comments/getComments';
import { headers } from 'next/headers';
import getOriginUrl from '@/utils/getOriginUrl';
import { ProposalType } from '@/global/types';
import CommentsContextProvider from '@/contexts/CommentsContext';
import CommentForm from './CommentForm';
import CommentListing from './CommentListing';

type Props = {
	postId: number;
	proposalType: ProposalType;
};

async function CommentsCard({ postId, proposalType }: Props) {
	const headersList = headers();
	const originUrl = getOriginUrl(headersList);
	const comments = await getComments({ id: Number(postId), originUrl, proposalType });

	return (
		<CommentsContextProvider initPostComments={comments || []}>
			<Card
				shadow='none'
				className='flex flex-col gap-6 border border-primary_border p-6'
			>
				<h2 className='text-base font-semibold'>
					Comments <span className='text-xs font-normal'>({comments.length})</span>
				</h2>

				<CommentForm />
				<CommentListing />
			</Card>
		</CommentsContextProvider>
	);
}

export default CommentsCard;

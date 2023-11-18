// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { useCommentsContext } from '@/contexts';
import React from 'react';
import CommentListingItem from './CommentListingItem';

function CommentListing() {
	const { postComments } = useCommentsContext();

	return (
		<div className='flex flex-col gap-4'>
			{postComments.map((comment) => (
				<CommentListingItem comment={comment} />
			))}
		</div>
	);
}

export default CommentListing;
